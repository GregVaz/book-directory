import { default as express } from 'express';
import { default as hbs } from'hbs';
import * as path from 'path';
import { default as logger } from 'morgan';
import { default as cookieParser } from 'cookie-parser';
import { default as bodyParser } from 'body-parser';
import * as http from 'http';
import { approotdir } from './approotdir.mjs';
const __dirname = approotdir;
import {
normalizePort, onError, onListening, handle404, basicErrorHandler
} from './appsupport.mjs';
import { router as indexRouter } from './routes/index.mjs';
import { router as booksRouter } from './routes/books.mjs';
import { default as rfs } from 'rotating-file-stream';
import { default as DBG } from 'debug';

const debug = DBG('books:debug');
const dbgerror = DBG('books:error');

import { useModel as useNotesModel } from './models/books-store.mjs';
useNotesModel()
  .then(store => { debug(`Using BooksStore ${store}`); })
  .catch(error => { onError({ code: 'EBOOKSSTORE', error}); });

export const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);


// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

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