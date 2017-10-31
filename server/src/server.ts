/**
 * Module dependencies.
 */
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as expressValidator from 'express-validator';
import * as logger from 'morgan';

/**
 * Controllers (route handlers).
 */
import { ApiMap, ApiResponse, HTTPMethod, HTTPStatus } from './api/base';
import * as apiController from './controllers/api';

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

const apiPrefix = '/api';

const methods = {
  GET: app.get.bind(app),
  POST: app.post.bind(app),
  PUT: app.put.bind(app)
};

function hostApi(api: ApiMap): void {
  // tslint:disable:no-any
  Object.keys(api).forEach((path: keyof ApiMap) => {
    Object.keys(api[path]).forEach((method: HTTPMethod) => {
      methods[method](apiPrefix + path, (req: any, res: any) => {
        // Use 'any' since Typescript can't infer this correctly :(
        const handler = (api[path] as any)[method].fn;

        const response: ApiResponse<any> = handler(req.body);
        response
          .then(value => {
            res.status(value.status);
            res.send(JSON.stringify(value.message));
          })
          .catch(() => {
            res.status(HTTPStatus.InternalServerError);
            res.send('Internal server error');
          });
      });
    });
  });
  // tslint:enable:no-any
}

function makeApiCall<
  Path extends keyof ApiMap,
  Method extends keyof ApiMap[Path]>(
  handler: ApiMap[Path][Method]['fn']): {
    fn: ApiMap[Path][Method]['fn'];
    method: Method;
    path: Path;
  } {

  // tslint:disable:no-any
  return { fn: handler } as any;
}

// tslint:disable-next-line:promise-function-async
export function makeResponse<Res>(status: HTTPStatus, message: Res): ApiResponse<Res> {
  return new Promise(resolve => {
    resolve({ status, message });
  });
}

hostApi({
  '/api': {
    GET: makeApiCall(() => makeResponse(HTTPStatus.OK, apiController.getApi())),
    POST: makeApiCall<'/api', 'POST'>(msg => makeResponse(HTTPStatus.OK, apiController.postApi(msg.message))),
  },
  '/other': {
    GET: makeApiCall(() => makeResponse(HTTPStatus.OK, apiController.getNumber())),
    PUT: makeApiCall<'/other', 'PUT'>(msg => makeResponse(HTTPStatus.OK, apiController.postNumber(msg.msg))),
  }
});

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
