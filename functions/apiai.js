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
    let body = request.body;
    let result = body && body.result;
    let receivedMessage = result && result.resolvedQuery;
    if (!receivedMessage) {
        console.warn('Empty message');
        return response.status(400).send('Bad request');
    }
    let lang = request.body.lang;
    if (!lang) {
        console.warn('Empty lang');
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

exports.getScheduleMessage = (i18n, request, schedule) => {
    const user = request.get('user');
    console.log(schedule);

    let gameMode = schedule.game_mode.key;
    let stageA = schedule.stage_a.name;
    let stageB = schedule.stage_b.name;
    let startTime = schedule.start_time;
    let endTime = schedule.end_time;

    let time = moment.unix(startTime).format('H:mm') + ' - ' + moment.unix(endTime).format('H:mm');
    let displayGameMode = getDisplayGameMode(i18n, gameMode);
    let text = `${displayGameMode}は${time}まで、${stageA}と${stageB}やな`;
    if (user == 'haru067') {
        text = `${stageA}と${stageB} (${time})`;
    }
    return text;
};

exports.getNextScheduleMessage = (i18n, request, schedule) => {
    if (!schedule) {
        return 'これはもうわからんね'
    }
    const user = request.get('user');
    console.log(schedule);

    let rule = getDisplayRule(i18n, schedule.rule.key);
    let stageA = getDisplayStageName(i18n, schedule.stage_a.id);
    let stageB = getDisplayStageName(i18n, schedule.stage_b.id);
    let startTime = schedule.start_time;
    let endTime = schedule.end_time;

    let time = moment.unix(startTime).format('H:mm') + ' - ' + moment.unix(endTime).format('H:mm');
    let text = i18n.__('RESPONSE_NEXT_STAGE', rule, time, stageA, stageB);
    return text;
};

exports.getMemo067ListMessage = (request, list) => {
    let message = Array.isArray(list) && list.length > 0 ? list.reduce((a, b) => `${a}、${b}`) : 'なにもないよ'
    message = '今のmemo067はね、' + message;
    return message;
};

exports.getMemo067DeleteMessage = (request, deleted) => {
    if (!deleted) {
        console.log(request.body.result);
        return "(´ε｀；)ｳｰﾝ…";
    }
    message = `「${deleted}」を完了した`
    return message;
};

function getDisplayStageName(i18n, stage_id) {
    let key = `STAGE_${stage_id}`;

    let text = null;
    try { text = i18n.__(key); }
    catch (error) { text = i18n.__('STAGE_1');}

    return text;
}

function getDisplayRule(i18n, rule) {
    let key = 'rainmaker';
    if (rule == 'rainmaker') key = 'RAINMAKER';
    if (rule == 'splat_zones') key = 'SPLAT_ZONES';
    if (rule == 'tower_control') key = 'TOWER_CONTROL';
    if (rule == 'clam_blitz') key = 'CLAM_BLITZ';
    return i18n.__(key);
}

function getDisplayGameMode(i18n, gameMode) {
    let key = 'regular';
    if (gameMode == 'gachi') key = 'GACHI_SHORT';
    if (gameMode == 'league') key = 'LEAGUE_SHORT';
    if (gameMode == 'regular') key = 'REGULAR_SHORT';
    return i18n.__(key);
}
