const functions = require('firebase-functions');
const moment = require('moment');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();

exports.splatoonSchedules = functions.https.onRequest((request, response) => {
    getSchedules().then((values) => {
        let [gachiStageHtml, leagueStageHtml, regularStageHtml] = ['', '', ''];
        for (let b of values.gachi) gachiStageHtml += getBattleHtml(b);
        for (let b of values.league) leagueStageHtml += getBattleHtml(b);
        for (let b of values.regular) regularStageHtml += getBattleHtml(b);
        response.send(`
<!doctype html>
<html>

<head>
  <title>haru067.com</title>
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400" rel="stylesheet">
  <link href="./css/style.css" rel="stylesheet" />
</head>
<!-- えっちだね -->
<body>
    <h1>ガチマッチ</h1>
    ${gachiStageHtml}
    <h1>リーグマッチ</h1>
    ${leagueStageHtml}
    <h1>レギュラーマッチ</h1>
    ${regularStageHtml}
</body>
</html>
        `);
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
    return ref.limitToFirst(2).once('value').then(snapshot => {
        return snapshot.val();
    });
}

function getBattleHtml(battle) {
    return `
    <div>
    <h2>${battle.rule.name}</h2>
    <p>${battle.stage_a.name}と${battle.stage_b.name}</p>
    ${moment.unix(battle.start_time).format()} <br>
    ${moment.unix(battle.end_time).format()}
    </div>
    `;
}