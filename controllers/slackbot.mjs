import dotenv from 'dotenv';
dotenv.config();
import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';

const slackSigninSecret = process.env.SLACK_SIGIN_SECRET;
const slackToken = process.env.SLACK_OAUTH_TOKEN;

const slackEvents = createEventAdapter(slackSigninSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on('app_mention', async (event) => {
  try {
    await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! `});
  } catch (error) {
    console.log(error.data);
  }
});

slackEvents.on('error', console.error);

export default slackEvents;
