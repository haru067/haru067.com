/*
 * 1. Get required stage IDs from Cloud Firestore
 * 2. Get existing stage images from Cloud Storage
 * 3. Find missing stage images by comparing #1 and #2
 * 4. Fetch original from CDN
 * 5. Resize
 * 6. Upload to Cloud Storage
 */

const admin = require("firebase-admin");
const serviceAccount = require("../../ignored/haru067-0a5ad89bc06f.json");
const { execSync } = require('child_process');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://haru067-a007c.appspot.com"
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

// Required stages
async function getStageMap() {
    let stageMap = [];
    const snapshot = await db.collection('splatoon/schedule/regular').orderBy('end_time', 'desc').limit(10).get();
    snapshot.forEach(doc => {
        const data = doc.data();
        for (let stage of [data.stage_a, data.stage_b]) {
            stageMap[stage.id] = stage;
        }
    });
    return stageMap;
}

// Current stages in storage
async function getCurrentImages() {
    const cmd = `gsutil ls gs://haru067-a007c.appspot.com/splatoon/stages/**.jpg | sed 's/.*\\///'`;
    const result = execSync(cmd).toString().split('\n').filter(t => t.length > 0);
    return result;
}

async function download(id, hash) {
    const endpoint = 'https://app.splatoon2.nintendo.net';
    const url = `${endpoint}${hash}`;
    const tmpFileName = `${id}.png`;
    const cmd = `curl ${url} > ${tmpFileName}`;
    console.log(cmd);
    const result = execSync(cmd).toString();
    return tmpFileName;
}

async function convert(id, fileName) {
    const tmpFileName = `${id}.jpg`;
    const cmd = `convert ${fileName} -resize 320x180 ${tmpFileName}`;
    console.log(cmd);
    execSync(cmd);

    // Clean up
    const rmCmd = `rm ${fileName}`;
    console.log(rmCmd);
    execSync(rmCmd);
    return tmpFileName;
}

async function upload(fileName) {
    const uploadCmd = `gsutil cp ${fileName} gs://haru067-a007c.appspot.com/splatoon/stages`;
    console.log(uploadCmd);
    execSync(uploadCmd);

    // Clean up
    const rmCmd = `rm ${fileName}`;
    console.log(rmCmd);
    const result = execSync(rmCmd).toString();
    return result;
}

async function uploadMissingStageImages() {
    const v = await Promise.all([getStageMap(), getCurrentImages()]);
    const stageMap = v[0];
    const currentImages = v[1];

    let result = [];
    for (const key in stageMap) {
        if (!currentImages.includes(`${key}.jpg`)) {
            let fileName = await download(key, stageMap[key].image);
            fileName = await convert(key, fileName);
            await upload(fileName);
            result.push(`Uploaded ${stageMap[key].name} as ${fileName}`);
        }
    }
    return result;
}

uploadMissingStageImages().then((list) => {
    list.map(v => console.log(v));
    console.log('Check it out: https://console.firebase.google.com/u/0/project/haru067-a007c/storage/haru067-a007c.appspot.com/files/splatoon/stages/');
});

