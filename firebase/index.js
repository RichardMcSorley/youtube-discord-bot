const firebase = require("./firebase");
const db = firebase.database;
module.exports.db = db;
const videoInfoDBResource = "playlist/info";
const youtubeSubscriptionDBResource = "videos";

module.exports.getChannelInfoFromDB = async channelId => {
  const eventref = db.ref(
    youtubeSubscriptionDBResource + "/channel/" + channelId
  );
  const snapshot = await eventref.once("value");
  const value = snapshot.val();
  return value;
};

module.exports.sendVideoInfoToDB = async videoInfo => {
  const dbRef = await db.ref(`${videoInfoDBResource}`);
  return await dbRef.once("value", async function() {
    return await dbRef.child(videoInfo.videoId).set(videoInfo);
  });
};

module.exports.getVideoInfoFromDB = async videoInfo => {
  const dbRef = await db.ref(`${videoInfoDBResource}`);
  return await dbRef.once("value", async function() {
    return await dbRef.child(videoInfo.videoId).set(videoInfo);
  });
};
