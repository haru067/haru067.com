const functions = require('firebase-functions');
const moment = require('moment');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();
const privateFunctions = require('./private');
const md5 = require('./util').md5;
const template = require('./template');

exports.test = functions.https.onRequest((request, response) => {
    return updateSchedules().then(() => response.send('hello'));
});

exports.splatoonSchedules = functions.https.onRequest((request, response) => {
    getSchedules().then((values) => {
        const html = template.renderMain(values);
        response.send(html);
    });
});

exports.splatoonSchedulesApi = functions.https.onRequest((request, response) => {
    getSchedules().then((values) => { response.send(values);});
});

function getSchedules() {
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

function updateSchedules() { 
    const json = privateFunctions.test();
    //return privateFunctions.schedules().then(json => { 

    let updates = {};
    for (let b of json.gachi) { 
        let key = md5(b);
        updates[`/splatoon/schedules/gachi/${key}`] = b;
    }
    for (let b of json.league) { 
        let key = md5(b);
        updates[`/splatoon/schedules/league/${key}`] = b;
    }
    for (let b of json.regular) { 
        let key = md5(b);
        updates[`/splatoon/schedules/regular/${key}`] = b;
    }
    return db.ref().update(updates);
    //});
}


