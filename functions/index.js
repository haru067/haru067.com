const functions = require('firebase-functions');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();
const privateFunctions = require('./private');
const md5 = require('./util').md5;
const template = require('./template');

exports.splatoonSchedules = functions.https.onRequest((request, response) => {
    fetchSchedule().then((values) => {
        const html = template.renderMain(values);
        response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        response.send(html);
    });
});

function fetchSchedule() {
    return confirmUpdate().then((isOld) => {
        if (isOld) {
            return updateScheduleDb().then((e) => getSchedulesFromDb());
        }
        return getSchedulesFromDb();
    });
}

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
    console.log('Schedule updating');
    return privateFunctions.schedules().then(json => {
        let updates = {};
        let lastStartTime = 0;
        for (let b of json.gachi) {
            let key = md5(b);
            updates[`/splatoon/schedules/gachi/${key}`] = b;
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }
        for (let b of json.league) {
            let key = md5(b);
            updates[`/splatoon/schedules/league/${key}`] = b;
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }
        for (let b of json.regular) {
            let key = md5(b);
            updates[`/splatoon/schedules/regular/${key}`] = b;
            lastStartTime = Math.max(lastStartTime, b.start_time);
        }
        updates[`/splatoon/schedules/metadata/last_start_time`] = lastStartTime;
        updates[`/splatoon/schedules/metadata/last_updated`] = moment().unix();
        return db.ref().update(updates);
    });
}

// Return true if it requires update
function confirmUpdate() {
    const ref = db.ref("/splatoon/schedules/metadata");
    return ref.once('value').then((snapshot) => {
        const diff = moment().unix() - snapshot.val().lastUpdated;
        if (diff > 2 * 60 * 60 /* 2hours */) {
            return true;
        }
        return false;
    }).catch((e) => {
        return false;
    });
    const sampleSchedules = schedules[0];
    if (!sampleSchedules || sampleSchedules.length == 0) {
        return false;
    }
    return false;
}

