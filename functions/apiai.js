const fetch = require('isomorphic-fetch')
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");
const privateFunctions = require('./private');

exports.main = (request, response, getSchedulePromise) => {
    const apikey = privateFunctions.getDocomoApiKey();
    let error = validate(apikey, request, response);
    if (error) {
        return error;
    }
    const result = request.body.result;
    let message = result.resolvedQuery;
    let type = result.action;
    let fetchMessagePromise = fetchConversation(apikey, message);
    if (type == 'splatoon_schedule') {
        let param = result.parameters;
        rule = param ? param.rule : undefined;
        rule = rule ? rule : 'regular';
        fetchMessagePromise = fetchSplatoonSchedule(rule, getSchedulePromise);
    }
    return fetchMessagePromise.then(message => sendMessage(response, message));
};

function validate(apikey, request, response) {
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

function fetchConversation(apikey, message) {
    // console.log('Called default conversation');
    const headers = {"Content-Type": "application/json; charset=utf-8"};
    const type = [undefined, 20, 30];
    const body = {
        utt: message,
        t: type[Math.floor(Math.random()*type.length)],
    };
    return fetch(`https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=${apikey}`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body)
    }).then(res => res.json()).then(json => json.utt);
}

function fetchSplatoonSchedule(rule, getSchedulePromise) {
    console.log('Called splatoon schedule');
    return getSchedulePromise(rule).then(schedules => {
        console.log(schedules[0]);
        let stageA = schedules[0].stage_a.name;
        let stageB = schedules[0].stage_b.name;
        let startTime = schedules[0].start_time;
        let endTime = schedules[0].end_time;

        let time = moment.unix(startTime).format('H:mm') + ' - ' + moment.unix(endTime).format('H:mm');
        let text = `${rule}は${time}まで、${stageA}と${stageB}やな`;
        return text;
    });
}

function sendMessage(response, message) {
    let responseJson = {
        "speech": message,
        "displayText": message,
        "data": { "slack": { "text": message } },
        "source": "haru067"
    }
    console.log(responseJson);
    return response.send(responseJson);
}