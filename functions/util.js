const crypto = require('crypto');

exports.md5 = (schdule) => {
    const key = schdule.rule.key + schdule.game_mode.key + schdule.start_time;
    const hash = crypto.createHash('md5').update(key).digest('hex');
    return hash;
};

exports.withTimeLogging = (name, promise) => {
    let startTime = Date.now();
    return promise.then(result => {
        console.log(`${name} took ${Date.now() - startTime}ms`);
        return result;
    });
};