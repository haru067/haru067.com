const riot = require('riot');
const stageTag = require('./templates/stage.tag');
const scheduleTag = require('./templates/schedule.tag');
const roundTag = require('./templates/round.tag');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");

exports.renderMain = (schedules) => { 
    const rounds = convertToRounds(schedules);
    let body = renderTitleHtml();
    for (let round of rounds) body += renderRoundHtml(round);
    return `
<!doctype html>
<html lang="ja">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Splatoon2 ステージ情報</title>
<link rel="stylesheet" href="../css/ika.css">
</head>
<body>
  ${body}
</body>
</html>
    `;
};

function convertToRounds(schedules) {
    let rounds = [];
    // TODO this is not good way
    for (let i = 0; i < schedules.regular.length; i++) { 
        let regular = schedules.regular[i];
        let gachi = schedules.gachi[i];
        let league = schedules.league[i];
        let startTime = regular.start_time;
        let endTime = regular.end_time;

        moment.updateLocale('ja', {weekdaysShort: ["日","月","火","水","木","金","土"]});
        let date = moment.unix(startTime).format('M月D日(ddd)');
        let time = moment.unix(startTime).format('H:mm') + ' - ' + moment.unix(endTime).format('H:mm');
        let round = { date: date, time: time, regular: regular, gachi: gachi, league: league };
        rounds.push(round);
    }
    return rounds;
}

function renderTitleHtml() {
    return `<h1>🦑 Splatoon2 ステージ情報 🦑</h1>`;
}

function renderRoundHtml(round) { 
    return riot.render(roundTag, { round: round });
}