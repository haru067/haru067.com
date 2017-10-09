const functions = require('firebase-functions');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();
const ika = require('./ika');
const util = require('./util');
const template = require('./template');
const apiai = require('./apiai');

// cron
exports.updateCron = functions.pubsub.topic('four-hourly-tick').onPublish((event) => {
    return updateScheduleDb().catch(e => { console.log(e); });
});

exports.apiai = functions.https.onRequest((require, response) => {
    return apiai.main(require, response, getSchedulePromise);
});

exports.splatoonSchedules = functions.https.onRequest((request, response) => {
    return getSchedulesFromDb().then(schedules => {
        const html = template.renderMain(schedules);
        response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        return response.send(html);
    });
});

function getSchedulesFromDb() {
    const gachi = getSchedulePromise('gachi');
    const league = getSchedulePromise('league');
    const regular = getSchedulePromise('regular');
    return Promise.all([gachi, league, regular]).then(values => {
        return { gachi: values[0], league: values[1], regular: values[2] };
    });
}

function getSchedulePromise(game_type) {
    const ref = db.ref("/splatoon/schedules/" + game_type);
    const startAt = moment().subtract(2, 'hours').unix();
    return ref.orderByChild('start_time').startAt(startAt).limitToFirst(6).once('value').then(snapshot => {
        let schedules = [];
        snapshot.forEach(item => { schedules.push(item.val()) });
        return schedules;
    });
}

function updateScheduleDb() {
    console.info('Schedule update is executed in background');
    let updateSchedule = ika.schedules().then(json => {
        const error = validateScheduleJson(json);
        if (error) throw error;

        let updates = {};
        let lastStartTime = 0;
        for (let b of json.gachi) {
            let key = util.md5(b);
            updates[`/splatoon/schedules/gachi/${key}`] = b;
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }
        for (let b of json.league) {
            let key = util.md5(b);
            updates[`/splatoon/schedules/league/${key}`] = b;
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }
        for (let b of json.regular) {
            let key = util.md5(b);
            updates[`/splatoon/schedules/regular/${key}`] = b;
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }
        updates[`/splatoon/schedules/metadata/last_start_time`] = lastStartTime;
        updates[`/splatoon/schedules/metadata/last_updated`] = moment().unix();
        return db.ref().update(updates);
    });
    return util.withTimeLogging('ScheduleUpdate', updateSchedule);
}

function validateScheduleJson(json) {
    if (!json) return 'undefine json';
    if (!json.gachi) return 'empty gachi data';
    if (!json.league) return 'empty league data';
    if (!json.regular) return 'empty regular data';
    return null;
}