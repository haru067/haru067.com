const i18n = require('i18n');
const Twitter = require('twitter');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const template = require('./template');
const apiai = require('./apiai');
const repo = require('./repository');
const privateFunctions = require('./private');

function validateMemo067(request, response) {
    let accessKey = request.body.accessKey;
    let username = request.body.username;
    let text = request.body.text;

    if (!username || !text) {
        console.warn('Empty username or text');
        return response.status(400).send('Bad request');
    }
    if (accessKey != privateFunctions.getIftttAccessKey()) {
        console.warn('Invalid access key');
        return response.status(400).send('Bad request');
    }
    return null;
}

exports.ping = functions.https.onRequest((request, response) => {
    response.send('pong');
});

// cron
exports.updateCron = functions.pubsub.topic('four-hourly-tick').onPublish((event) => {
    return repo.updateScheduleDb(db).catch(e => { console.log(e); });
});

exports.apiai = functions.https.onRequest((request, response) => {
    let error = apiai.validate(request, response);
    if (error) return error;

    i18n.configure({
        locales: ['en', 'jp'],
        directory: __dirname + '/locales',
        defaultLocale: 'en'
      });
    i18n.setLocale(request.body.lang);

    let type = apiai.getType(request);
    let fetchMessage = apiai.fetchDefaultMessage(request);
    if (type == 'splatoon_schedule') {
        let gameMode = apiai.getGameMode(request);
        fetchMessage = repo.getCurrentSchedulePromise(db, gameMode).then(schedule => apiai.getScheduleMessage(i18n, request, schedule));
    } else if (type == 'splatoon_search') {
        let rule = apiai.getRule(request);
        fetchMessage = repo.queryNextSchedule(db, rule).then(schedule => apiai.getNextScheduleMessage(i18n, request, schedule));
    } else if (type == 'list_memo067') {
        fetchMessage = repo.listMemo067(db).then(list => apiai.getMemo067ListMessage(request, list));
    } else if (type == 'delete_memo067') {
        let receivedMessage = request.body.result.resolvedQuery;
        fetchMessage = repo.deleteMemo067(db, receivedMessage).then(deleted => apiai.getMemo067DeleteMessage(request, deleted));
    }

    return fetchMessage.then(message => apiai.sendMessage(response, message));
});

exports.splatoonSchedules = functions.https.onRequest((request, response) => {
    return repo.getAllSchedules(db).then(schedules => {
        const html = template.renderMain(schedules);
        response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        return response.send(html);
    });
});

exports.memo067 = functions.https.onRequest((request, response) => {
    let error = validateMemo067(request, response);
    if (error) return error;

    let accesskey = request.body.accessKey;
    let username = request.body.username;
    let text = request.body.text;
    if (text.endsWith(' #memo067')) {
        text = text.substr(0, (text.length) - (' #memo067'.length)); // remove hash tag
    } else {
        return response.send('this is not memo067');
    }
    return repo.storeNote(db, username, text).then(result => response.send('ok'));
});