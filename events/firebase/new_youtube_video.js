const { findKoreanUnnie } = require("../../utils/search");
const { db, getChannelInfoFromDB } = require("../../firebase");
const Queue = require("firebase-queue");
const moment = require("moment");
const videoCache = {};
const videoDBRes = "videos";
const discordChannel = process.env.YOUTUBE_DISCORD_CHANNEL;
const constants = require("../../utils/constants");
const numeral = require("numeral");

const handle = async ({ bot }) => {
  const queue = new Queue(
    db.ref(videoDBRes + 2),
    { sanitize: false, suppressStack: true },
    async (video, progress, resolve, reject) => {
      if (
        isVideoYoung(video) &&
        !(video.videoId in videoCache) &&
        isKoreanUnnie(video)
      ) {
        videoCache[video.videoId] = 1; // add to cache
        const channelInfo = await getChannelInfoFromDB(video.channelId);
        let verb = "uploaded";
        if (video.liveBroadcastContent === "live") {
          verb = "is live";
        }
        if (video.liveBroadcastContent === "upcoming") {
          verb = "is about to go live";
        }
        const channel = await bot.channels.get(discordChannel);
        let options = constants.GET_DEFAULT_MESSAGE_OPTIONS();
        options.setAuthor(
          `${channelInfo.title} is now at ${numeral(
            channelInfo.subscriberCount
          ).format("0a")} subscribers and ${numeral(
            channelInfo.viewCount
          ).format("0a")} total views.`,
          channelInfo.smallImage,
          channelInfo.url
        );
        options.setURL(video.videoUrl);
        await channel.send(
          `**@everyone ${video.channelTitle}** ${verb} **${video.title}** at ${
            video.videoUrl
          }`
        );
        await channel.send(options);
      }
      db.ref(videoDBRes + "/processed/" + video.videoId).set(1);
      return db
        .ref(videoDBRes + 2)
        .child(video._id)
        .remove()
        .then(resolve)
        .catch(reject);
    }
  );
  const isVideoYoung = video => {
    return moment(video.publishedAt, "YYYY-MM-DDThh:mm:ss.sZ").isBetween(
      moment().subtract(1, "hour"),
      moment()
    );
  };
  const isKoreanUnnie = video => {
    return findKoreanUnnie(
      `${video.channelTitle} ${video.description} ${video.title} ${
        video.channelTitle
      }`
    );
  };

  process.on("SIGINT", async function() {
    await queue.shutdown();
    process.exit(0);
  });
  process.on("SIGTERM", async function() {
    await queue.shutdown();
    process.exit(0);
  });
};

module.exports = {
  needsBot: true,
  handle
};
