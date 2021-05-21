export const addBookModal = {
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
};

export const registerModal = {
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
};
