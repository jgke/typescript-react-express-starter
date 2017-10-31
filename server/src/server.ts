import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as expressValidator from 'express-validator';
import * as logger from 'morgan';

import { initRoutes } from './controllers/routes';

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
const DEFAULT_PORT = 3000;
app.set('port', process.env.PORT || DEFAULT_PORT);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cors());

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Initialize routing.
 */
initRoutes(app);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
