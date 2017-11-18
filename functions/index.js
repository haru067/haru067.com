const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const template = require('./template');
const apiai = require('./apiai');
const repo = require('./repository');

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

    let type = apiai.getType(request);
    let fetchMessage = apiai.fetchDefaultMessage(request);
    if (type == 'splatoon_schedule') {
        let gameMode = apiai.getGameMode(request);
        fetchMessage = repo.getCurrentSchedulePromise(db, gameMode).then(schedule => apiai.getScheduleMessage(request, schedule));
    } else if (type == 'splatoon_search') {
        let rule = apiai.getRule(request);
        fetchMessage = repo.queryNextSchedule(db, rule).then(schedule => apiai.getNextScheduleMessage(request, schedule));
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