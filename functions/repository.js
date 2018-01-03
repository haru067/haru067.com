const ika = require('./ika');
const util = require('./util');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");

exports.getAllSchedules = (db) => {
    const gachi = getSchedulePromise(db, 'gachi');
    const league = getSchedulePromise(db, 'league');
    const regular = getSchedulePromise(db, 'regular');
    return Promise.all([gachi, league, regular]).then(values => {
        return { gachi: values[0], league: values[1], regular: values[2] };
    });
};

exports.getCurrentSchedulePromise = (db, game_type) => {
    return getSchedulePromise(db, game_type, 1).then(schedules => schedules[0]);
};

function getSchedulePromise(db, game_type, count = 6) {
    const ref = db.collection("splatoon/schedule/" + game_type);
    const twoHoursAgo = moment().subtract(2, 'hours').unix();
    return ref.orderBy('start_time').startAt(twoHoursAgo).limit(count).get().then(snapshot => {
        let schedules = [];
        snapshot.forEach(item => { schedules.push(item.data()) });
        return schedules;
    });
}

exports.updateScheduleDb = (db) => {
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

exports.queryNextSchedule = (db, rule_key, stage = null) => {
    const ref = db.collection("splatoon/schedule/gachi");
    const twoHoursAgo = moment().subtract(2, 'hours').unix();
    return ref.where('rule.key', '==', rule_key).orderBy('start_time').startAt(twoHoursAgo).limit(1).get().then(snapshot => {
        return data = snapshot.docs[0] && snapshot.docs[0].data();
    });
}

function tweet(twitter, text) {
    return twitter.post('statuses/update', {status: text})
        .then(tweet => { console.log(tweet);})
        .catch(error => { console.log(error);});
}

exports.storeNote = (db, username, text) => {
    const ref = db.collection("memo").doc('haur067'); // we use hard-coded username so far because this is only for private use.
    return ref.get().then(doc => {
        // Pull
        return doc.exists ?  doc.data() : {list: []};
    }).then(data => {
        // Push
        data.list.push(text);
        console.log(data);
        return ref.set(data);
    }).catch(err => {
        console.log(err);
    });
}

exports.tweetMemo067 = (db, twitter, txt) => {
    const ref = db.collection("memo").doc('haur067'); // we use hard-coded username so far because this is only for private use.
    return ref.get().then(doc => {
        return doc.exists ?  doc.data().list : null;
    }).then(list => {
        let message = list ? list.reduce((a, b) => `${a}、${b}`) : 'なにもないよ'
        message = '今のmemo067はね、' + message;
        return tweet(twitter, message);
    })
}
