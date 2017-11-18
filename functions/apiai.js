const fetch = require('isomorphic-fetch')
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");
const privateFunctions = require('./private');

exports.sendMessage = (response, message) => {
    let responseJson = {
        "speech": message,
        "displayText": message,
        "data": { "slack": { "text": message } },
        "source": "haru067"
    }
    console.log(responseJson);
    return response.send(responseJson);
};

exports.getType = (request) => request.body.result.action;
exports.getGameMode = (request) => (request.body.result.parameters && request.body.result.parameters.rule) || 'regular';
exports.getRule = (request) => (request.body.result.parameters && request.body.result.parameters.rule) || 'rainmaker';

exports.validate = (request, response) => {
    let isValidToken = privateFunctions.isValidToken(request.get('accesstoken'));
    if (!isValidToken) {
        console.warn('Invalid token');
        return response.status(400).send('Bad request');
    }
    let receivedMessage = request.body.result.resolvedQuery;
    if (!receivedMessage) {
        console.warn('Empty message');
        return response.status(400).send('Bad request');
    }
    return null;
}

exports.fetchDefaultMessage = (request) => {
    // console.log('Called default conversation');
    const apikey = privateFunctions.getDocomoApiKey();
    const result = request.body.result;
    const message = result.resolvedQuery;
    console.log('received message:' + message);
    const user = request.get('user');
    const headers = { "Content-Type": "application/json; charset=utf-8" };
    const type = [undefined, 20, 30];
    const body = {
        utt: message,
        t: type[Math.floor(Math.random() * type.length)],
    };
    return fetch(`https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=${apikey}`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body)
    }).then(res => res.json()).then(json => json.utt);
};

exports.getScheduleMessage = (request, schedule) => {
    const user = request.get('user');
    console.log(schedule);

    let gameMode = schedule.game_mode.key;
    let stageA = schedule.stage_a.name;
    let stageB = schedule.stage_b.name;
    let startTime = schedule.start_time;
    let endTime = schedule.end_time;

    let time = moment.unix(startTime).format('H:mm') + ' - ' + moment.unix(endTime).format('H:mm');
    let displayGameMode = getDisplayGameMode(gameMode);
    let text = `${displayGameMode}は${time}まで、${stageA}と${stageB}やな`;
    if (user == 'haru067') {
        text = `${stageA}と${stageB} (${time})`;
    }
    return text;
};

exports.getNextScheduleMessage = (request, schedule) => {
    if (!schedule) {
        return 'これはもうわからんね'
    }
    const user = request.get('user');
    console.log(schedule);

    let rule = schedule.rule.name;
    let stageA = schedule.stage_a.name;
    let stageB = schedule.stage_b.name;
    let startTime = schedule.start_time;
    let endTime = schedule.end_time;

    let time = moment.unix(startTime).format('H:mm') + ' - ' + moment.unix(endTime).format('H:mm');
    let text = `次の${rule}は${time}で、${stageA}と${stageB}`;
    return text;
};

function getDisplayGameMode(rule) {
    if (rule == 'gachi') return 'ガチマ';
    if (rule == 'league') return 'リグマ';
    if (rule == 'regular') return 'ナワバリ';
}