# Book-directory

## Book directory challenge to practice knowledge with Node technology

Node version: 12.x.x

#### Install dependencies: `npm install`

#### Initialize sequelize cli configuration `npx sequelize init`

- Register your database information for each environment

#### Write your own .env to initialize each variable

- SEQUELIZE_DBNAME => Database name
- SEQUELIZE_DBUSER => Database username
- SEQUELIZE_DBPASSWD => Database password
- SECRET => Secret word
- SEQUELIZE_CONNECT => path for sequelize-mysql.yaml

##### Environment for google mail mailer

- EMAIL_USER => email account
- EMAIL_PASS => password email account
- EMAIL_CLIENT_ID => client id for your api
- EMAIL_CLIENT_SECRET => client secret token for you api
- EMAIL_REFRESH_TOKEN => refresh token through your credentials

#### Start the project: `npm start`

#### Start the project with debug information and development refresh (nodemon): `npm run sequelize-start`

## Requierements:

#### Easy mode

- An app to save my book collection.
- Inside the app, I can:
  - Add/ update a book
    - Every entry must have:
      - Title
      - Author
      - Publication date
      - Abstract
      - Book cover (you can add a default book cover in case the user doesn’t add it)
  - Delete a book.

#### Medium mode

- Sign in/ login
- Add books and show JUST my books. (Please, I’m not interested in reading the romantic literature that my partners read)
- Send email notifications for every book you add.
- Send email notifications for every book you delete.
- Create a pdf summary of my books:
  - The pdf must include:
    - The user name.
    - The current date
    - A list of my books with the title and the author.

#### Hard mode

- Create and slack bot (You need to create a workspace)
- Add books using the bot:
  - Add the bot to the workspace
  - Save the users of the workspace in the app
  - Create the comment to trigger a modal to fill in the book information.
  - Receive a slack notification if the book was added or not.
