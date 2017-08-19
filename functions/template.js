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
<html>
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
  margin: 1rem 0px;
}

round div.date {
  background-color: #222;
  padding: 0px 1rem;
}

round h1 {
  margin-top: 0px;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

round h2 {
  font-size: 1rem;
  margin: 0px;
}


schedule {
  border-radius: 16px;
  margin: 0rem 0.5rem;
  padding: 1rem;
  text-shadow: 1px 1px 4px #000000;
}

schedule div.title {
  text-align: left;
  margin-bottom: 0.5rem;
}

schedule h1 {
  font-size: 1.2rem;
  background-color: rgba(0,0,0,0.3);
  padding: 0px 8px;
  margin: 0px;
}

schedule.regular {
    background-color: #689F38;
}

schedule.gachi {
    background-color: #E91E63;
}

schedule.league {
    background-color: #FF5722;
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

        let date = moment.unix(startTime).format('M月D日');
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