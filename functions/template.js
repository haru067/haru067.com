const riot = require('riot');
const stageTag = require('./templates/stage.tag');
const scheduleTag = require('./templates/schedule.tag');
const roundTag = require('./templates/round.tag');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");

exports.renderMain = (schedules) => { 
    const rounds = convertToRounds(schedules);
    let body = '';
    for (let round of rounds) body += getRoundHtml(round);
    return `
<!doctype html>
<html>
<head>
<title>haru067.com</title>
<style type="text/css">
body {
  text-align: center;
}

.schedule-container {
  display: flex;
  justify-content: center;
}

.schedule {
  margin: 0rem 2rem;
}

.stage-container {
  display: flex;
  justify-content: center;
}

.stage {
  margin: 1rem;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
}

h2 {
  margin-left: 1rem;
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

        let date = moment.unix(startTime).format('M月D日 H:mm') + ' - ' + moment.unix(endTime).format('H:mm');
        let round = { date: date, regular: regular, gachi: gachi, league: league };
        rounds.push(round);
    }
    return rounds;
}

function getRoundHtml(round) { 
    return riot.render(roundTag, { round: round });
}