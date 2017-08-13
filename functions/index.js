const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();

exports.splatoonSchedules = functions.https.onRequest((request, response) => {
    const gachi = getSchedulePromise('gachi');
    const league = getSchedulePromise('league');
    const regular = getSchedulePromise('regular');
    Promise.all([gachi, league, regular]).then((values) => {
        console.log(values); // todo
        response.send(values);
    });
});

function getSchedulePromise(game_type) {
    const ref = db.ref("/splatoon/schedules/" + game_type);
    return ref.limitToFirst(1).once('value').then(snapshot => {
        return snapshot.val();
    });
}