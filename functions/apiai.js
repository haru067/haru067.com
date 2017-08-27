const fetch = require('isomorphic-fetch')
const privateFunctions = require('./private');

exports.main = (request, response) => {
    const apikey = privateFunctions.getDocomoApiKey();
    let error = validate(apikey, request, response);
    if (error) {
        return error;
    }
    let message = request.body.result.resolvedQuery;
    return sendMessage(apikey, response, message)
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

function sendMessage(apikey, response, message) { 
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
    })
        .then(res => res.json())
        .then(json => {
            let sendMessage = json.utt;
            let responseJson = {
                "speech": sendMessage,
                "displayText": sendMessage,
                "data": { "slack": { "text": sendMessage } },
                "source": "haru067"
            }
            return response.send(responseJson);
        });
}