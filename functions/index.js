const functions = require('firebase-functions');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
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
    const ref = db.collection("splatoon/schedule/" + game_type);
    const startAt = moment().subtract(2, 'hours').unix();
    return ref.where('start_time', '>', startAt).orderBy('start_time').limit(6).get().then(snapshot => {
        let schedules = [];
        snapshot.forEach(item => { schedules.push(item.data()) });
        return schedules;
    });
}

function updateScheduleDb() {
    console.info('Schedule update is executed in background');
    let updateSchedule = ika.schedules().then(json => {
        const error = validateScheduleJson(json);
        if (error) throw error;

        let batch = db.batch();
        let lastStartTime = 0;
        for (let b of json.gachi) {
            let key = util.md5(b);
            batch.set(db.collection('splatoon/schedule/gachi').doc(key), b);
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }
        for (let b of json.league) {
            let key = util.md5(b);
            batch.set(db.collection('splatoon/schedule/league').doc(key), b);
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }
        for (let b of json.regular) {
            let key = util.md5(b);
            batch.set(db.collection('splatoon/schedule/regular').doc(key), b);
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }

        batch.update(db.doc('splatoon/schedule'), { last_start_time: lastStartTime });
        batch.update(db.doc('splatoon/schedule'), { last_updated: moment().unix() });
        return batch.commit();
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