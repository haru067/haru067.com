
const privateFunctions = require('./private');
const fetch = require('isomorphic-fetch')

exports.schedules = (withLogin = false) => {
    let promise;
    if (withLogin) {
        promise = fetchToken(privateFunctions.getClientId(), privateFunctions.getSessionToken())
            .then(tokens => fetchAccountToken(tokens.id_token, tokens.access_token))
            .then(accountToken => fetchWebServiceToken(accountToken, privateFunctions.getWebServiceId()))
            .then(webServiceToken => fetchIksmSession(webServiceToken))
            .then(iksmSession => { console.log(iksmSession); return iksmSession; })
    } else {
        promise = new Promise((resolve, reject) => resolve(privateFunctions.getIksmSession()));
    }
    return promise.then(iksmSession => fetchSchedules(iksmSession));
};

function fetchToken(client_id, session_token) {
    const body = {
        "client_id": client_id,
        "session_token": session_token,
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer-session-token"
    };
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8"
    };
    return fetch("https://accounts.nintendo.com/connect/1.0.0/api/token", {
        headers: headers,
        method: "POST",
        body: JSON.stringify(body)
    }).then(res => res.json());
}

function fetchAccountToken(id_token, access_token) {
    const body = {
        "parameter": {
            "naIdToken": id_token,
            "naCountry": "JP",
            "naBirthday": "2000-01-23",
            "language": "ja-JP"
        }
    };
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${access_token}`
    };
    return fetch('https://api-lp1.znc.srv.nintendo.net/v1/Account/GetToken', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body)
    }).then(res => res.json()).then(json => json.result.webApiServerCredential.accessToken);
}

function fetchWebServiceToken(credential_access_token, web_service_id) {
    const body = { parameter: { id: web_service_id } };
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${credential_access_token}`
    };
    return fetch('https://api-lp1.znc.srv.nintendo.net/v1/Game/GetWebServiceToken', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body)
    }).then(res => res.json()).then(json => json.result.accessToken);
}

function fetchIksmSession(game_access_token) {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-gamewebtoken": game_access_token
    };
    return fetch('https://app.splatoon2.nintendo.net/?lang=ja-JP', {
        headers: headers,
        method: 'GET',
        credentials: "include"
    }).then(res => res.headers['_headers']['set-cookie']);
}

function fetchSchedules(iksm_cookie) {
    const headers = {
        cookie: `iksm_session=${iksm_cookie}`,
    };
    return fetch('https://app.splatoon2.nintendo.net/api/schedules', {
        headers: headers,
        method: 'GET',
    }).then(res => res.json());
}