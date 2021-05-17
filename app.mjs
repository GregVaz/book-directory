import { default as express } from 'express';
import { default as hbs } from'hbs';
import * as path from 'path';
import { default as logger } from 'morgan';
import { default as cookieParser } from 'cookie-parser';
import { default as bodyParser } from 'body-parser';
import * as http from 'http';
import { approotdir } from './approotdir.mjs';
import { normalizePort, onError, onListening, handle404, basicErrorHandler } from './appsupport.mjs';
import { router as indexRouter } from './routes/index.mjs';
import { router as booksRouter } from './routes/books.mjs';
import { router as usersRouter } from './routes/users.mjs';
import { default as rfs } from 'rotating-file-stream';
import { default as DBG } from 'debug';
<<<<<<< HEAD
=======
import { default as passport } from 'passport';
import { default as session } from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local'
>>>>>>> User authethication and registration
import dotenv from 'dotenv';
dotenv.config();

const __dirname = approotdir;
const debug = DBG('books:debug');
const dberror = DBG('books:error');
let dbUserConnect;
// Initialize the books model
import { useBookModel as booksModel, useUserModel as usersModel } from './models/books-store.mjs';
booksModel()
  .then(store => { debug(`Using BooksStore ${store}`); })
  .catch(error => { onError({ code: 'EBOOKSSTORE', error}); });
usersModel()
  .then(store => { debug(`Using UserStore ${store}`); dbUserConnect = store; })
  .catch(error => { onError({ code: 'EUSERSTORE', error}); });

export const app = express();

// Express configuration
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET));
app.use(express.static(path.join(__dirname, 'public')));

// Passport configuration
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async function(email, password, done) {
    dberror(email, password);
    const user = await dbUserConnect.read(email);
    if (user.password === password) return done(null, user);

    done(null, false);
}));

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(async function(email, done) {
  const user = await dbUserConnect.read(email);
  done(null, user);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// log rotation referes to a DevOps practice of keeping log file snapshots,
// where each snapshot covers a few hours of activity
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
  stream: process.env.REQUEST_LOG_FILE ?
  rfs.createStream(process.env.REQUEST_LOG_FILE, {
    size: '10M',
    // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    compress: 'gzip' // compress rotated files
  })
  : process.stdout
}));


// Routes
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);
app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

// Start server
export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);

server.listen(port);
server.on('request', (req, res) => {
  debug(`${new Date().toISOString()} request ${req.method}
  ${req.url}`);
});
server.on('error', onError);
server.on('listening', onListening);