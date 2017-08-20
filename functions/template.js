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
<title>Splatoon2 ステージ情報</title>
<style type="text/css">
body {
  text-align: center;
  background-color: #000000;
  color: #ffffff;
}

.schedule-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.stage-container {
  display: flex;
  justify-content: center;
}

stage {
  margin: 0px;
}

stage.stage-b {
  margin-left: 1rem;
}

round {
  display: block;
  background-color: #222;
  margin: 1rem 0px;
  padding: 1rem 0px;
}

round h1 {
  margin: 0px;
  font-size: 1.5rem;
}

round h2 {
  font-size: 1rem;
  margin: 0px;
  padding: 0px;
}


schedule {
  border-radius: 16px;
  margin: 0rem 0.5rem;
  padding: 1rem;
  text-shadow: 1px 1px 4px #000000;
}

schedule div.title {
  text-align: center;
  margin-top: -32px;
  margin-bottom: 0.5rem;
  height: 44px;
  padding-left: 8px;
}

schedule.regular div.title {
  background: url(../img/ika-title-regular.png) no-repeat;
}

schedule.gachi div.title {
  background: url(../img/ika-title-gachi.png) no-repeat;
}

schedule.league div.title {
  background: url(../img/ika-title-league.png) no-repeat;
}

schedule h1 {
  line-height: 48px;
  text-align: left;
  font-size: 1.2rem;
  margin: 0px;
  padding: 0px;
}

schedule.regular {
    background: url(../img/ika-stage-regular.png) repeat #689F38;
}

schedule.gachi {
    background: url(../img/ika-stage-gachi.png) repeat #E91E63;
}

schedule.league {
    background: url(../img/ika-stage-league.png) repeat #FF5722;
}

stage div.name {
  border-radius: 0px 0px 16px 16px;
  margin-top: 0px;
  padding: 0.4rem 0px;
  background-color: rgba(0,0,0,0.6);
  width: 160px;
  font-size: 0.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

stage img {
  display: block;
  border-radius: 16px 16px 0px 0px;
}
</style>
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

        moment.lang('ja', {weekdaysShort: ["日","月","火","水","木","金","土"]});
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