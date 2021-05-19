import { BooksStore as books, UserStore as users } from '../models/books-store.mjs';
import dotenv from 'dotenv';
dotenv.config();
import { default as Bolt } from '@slack/bolt';
import { WebClient } from '@slack/web-api';

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
      view: {
        "title": {
          "type": "plain_text",
          "text": "Add a book"
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit"
        },
        "blocks": [
          {
            "type": "input",
            "block_id": "input_book_name",
            "element": {
              "type": "plain_text_input",
              "action_id": "input_name",
              "placeholder": {
                "type": "plain_text",
                "text": "Book name"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Title"
            }
          },
          {
            "type": "input",
            "block_id": "input_book_author",
            "element": {
              "type": "plain_text_input",
              "action_id": "input_author",
              "placeholder": {
                "type": "plain_text",
                "text": "Author name"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Author",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "input_book_abstract",
            "element": {
              "type": "plain_text_input",
              "action_id": "input_abstract",
              "multiline": true
            },
            "label": {
              "type": "plain_text",
              "text": "Abstract"
            },
            "hint": {
              "type": "plain_text",
              "text": "Description of the book"
            }
          },
          {
            "type": "input",
            "block_id": "input_book_publication",
            "element": {
              "type": "datepicker",
              "initial_date": "1990-04-28",
              "placeholder": {
                "type": "plain_text",
                "text": "Select the publication date",
                "emoji": true
              },
              "action_id": "input_publication"
            },
            "label": {
              "type": "plain_text",
              "text": "Publication date",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "input_book_cover",
            "element": {
              "type": "plain_text_input",
              "action_id": "input_cover",
              "placeholder": {
                "type": "plain_text",
                "text": "https://url.image"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Cover URL",
              "emoji": true
            },
            "optional": true
          }
        ],
        "type": "modal",
        "callback_id": 'view_book'
      }
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
    user: user
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
      view: {
        "title": {
          "type": "plain_text",
          "text": "Register"
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit"
        },
        "blocks": [
          {
            "type": "input",
            "block_id": "input_user_email",
            "element": {
              "type": "plain_text_input",
              "action_id": "input_email",
              "placeholder": {
                "type": "plain_text",
                "text": "Email"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Email"
            }
          },
          {
            "type": "input",
            "block_id": "input_user_password",
            "element": {
              "type": "plain_text_input",
              "action_id": "input_password",
              "placeholder": {
                "type": "plain_text",
                "text": "Password"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Password"
            },
            "hint": {
              "type": "plain_text",
              "text": "Password with a minimum of 6 characters"
            }
          },
          {
            "type": "input",
            "block_id": "input_user_username",
            "element": {
              "type": "plain_text_input",
              "action_id": "input_username"
            },
            "label": {
              "type": "plain_text",
              "text": "Username"
            }
          }
        ],
        "type": "modal",
        "callback_id": "view_register"
      }
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