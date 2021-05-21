import { BooksStore as books, UserStore as users } from '../models/books-store.mjs';
import dotenv from 'dotenv';
import { default as Bolt } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { addBookModal, registerModal } from './slack-modals.mjs';

dotenv.config();

const slackSigninSecret = process.env.SLACK_SIGIN_SECRET;
const slackToken = process.env.SLACK_OAUTH_TOKEN;

// Create a Bolt Receiver
const receiver = new Bolt.ExpressReceiver({ signingSecret: slackSigninSecret });
// Web Client
const slackClient = new WebClient(slackToken);

// Bolt App Server
const slackApp = new Bolt.App({
  token: slackToken,
  receiver
});

// Slack event interactions
slackApp.event('app_mention', async ({event, client}) => {
  await client.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! `});
});

slackApp.command('/addbook', async ({ ack, body, client }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: addBookModal
    });
  }
  catch (error) {
    console.error(error);
  }
});

slackApp.view('view_book', async ({ ack, body, view, client }) => {
  await ack();

  const newBook = view['state']['values'];
  const user = body['user']['id'];
  const userName = body['user']['username'];
  let msg = '';

  const userInfo = await slackClient.users.info({
    user
  });
  const userEmail = userInfo['user']['profile']['email'];

  const findUser = await users.verify(userEmail);

  if (findUser) {
    try {
      let book = await books.create(
        newBook['input_book_name']['input_name']['value'],
        newBook['input_book_author']['input_author']['value'],
        newBook['input_book_publication']['input_publication']['selected_date'],
        newBook['input_book_abstract']['input_abstract']['value'],
        newBook['input_book_cover']['input_cover']['value'],
        findUser.email );
      if (book) {
        msg = `<@${userName}> Your book was created :book:`;
      } else {
        msg = `<@${userName}> There was an error with your book, try it later`;
      }
    } catch (err) { 
      msg = `<@${userName}> There has been a problem, try it later`;
    }
  } else {
    msg = `<@${userName}> You do not have an account, if you want to registered use the command /register`;
  }

  sendMessage(client, user, msg);
});

slackApp.command('/register', async ({ ack, body, client }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: registerModal
    });
  }
  catch (error) {
    console.error(error);
  }
});

slackApp.view('view_register', async ({ ack, body, view, client }) => {
  await ack();

  const newUser = view['state']['values'];
  const slackUserId = body['user']['id'];
  const userName = body['user']['username'];
  const userEmail = newUser['input_user_email']['input_email']['value'];
  const userPassword = newUser['input_user_password']['input_password']['value'];
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  let msg = '';  

  if (!emailPattern.test(userEmail)) {
    msg = `<@${userName}> The email you try to register is invalid`;
    sendMessage(client, slackUserId, msg);
    return;
  }

  if (userPassword.length < 6) {
    msg = `<@${userName}> Your password is too short, the minimum is 6 characters`;
    sendMessage(client, slackUserId, msg);
    return;
  }

  const findUser = await users.verify(userEmail);

  if (findUser) {
    msg = `<@${userName}> This email has already taken`;
  } else {
    try {
      const User = await users.create(
        newUser['input_user_email']['input_email']['value'],
        newUser['input_user_password']['input_password']['value'],
        newUser['input_user_username']['input_username']['value']);
      if (User) {
        msg = `<@${userName}> You have been registered :rocket:`;
      } else {
        msg = `<@${userName}> There was an error with your registration, try it later`;
      }
    } catch (err) { 
      msg = `<@${userName}> There has been a problem, try it later`;
    }
  } 

  sendMessage(client, slackUserId, msg);
});

const sendMessage = async (client, slackUserId, msg) => {
  try {
    await client.chat.postMessage({
      channel: slackUserId,
      text: msg
    });
  }
  catch (error) {
    console.error(error);
  }
};

export default slackApp;
