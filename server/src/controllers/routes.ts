import * as express from 'express';

import { ApiMap, ApiResponse, HTTPMethod, HTTPStatus } from '../api/base';
import { getApi, getNumber, postApi, postNumber } from './api';

const apiPrefix = '/api';

/**
 * Initialize the routes in the given map
 * @param app Express application
 * @param api Api to iterate
 */
function hostApi(app: express.Express, api: ApiMap): void {
    const methods = {
        GET: app.get.bind(app),
        POST: app.post.bind(app),
        PUT: app.put.bind(app)
    };
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

/**
 * Wrap an api handler so the type checker is happy
 * @param handler Api call handler
 */

function makeApiCall<Path extends keyof ApiMap, Method extends keyof ApiMap[Path]>(
    handler: ApiMap[Path][Method]['fn']): {
        fn: ApiMap[Path][Method]['fn'];
        method: Method;
        path: Path;
    } {

    // We can just ignore path and method here, since they're not needed :)
    // tslint:disable:no-any
    return { fn: handler } as any;
}

/**
 * Create a simple response.
 * @param status Response status code
 * @param message Response body
 */
// tslint:disable-next-line:promise-function-async
export function makeResponse<Res>(status: HTTPStatus, message: Res): ApiResponse<Res> {
    return new Promise(resolve => {
        resolve({ status, message });
    });
}

/**
 * Initialize routing.
 * @param app Express application
 */
export function initRoutes(app: express.Express) {
    hostApi(app, {
        '/api': {
            GET: makeApiCall(() => makeResponse(HTTPStatus.OK, getApi())),
            POST: makeApiCall<'/api', 'POST'>(msg => makeResponse(HTTPStatus.OK, postApi(msg.message))),
        },
        '/other': {
            GET: makeApiCall(() => makeResponse(HTTPStatus.OK, getNumber())),
            PUT: makeApiCall<'/other', 'PUT'>(msg => makeResponse(HTTPStatus.OK, postNumber(msg.msg))),
        }
    });
}
