import * as express from 'express';

import {ApiMap, apiObject, ApiResponse, HTTPMethod, HTTPStatus} from '../api/base';
import {getApi, getNumber, postApi, postNumber} from './api';

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
                const checker = (apiObject[path] as any)[method].fn;
                if (!checker(req.body)) {
                    res.status = HTTPStatus.Arg;
                    res.send('Invalid parameter');
                } else {
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
                }
            });
        });
    });
    // tslint:enable:no-any
}

/**
 * Wrap an api handler so the type checker is happy
 * @param handler Api call handler
 */

// Idea hates formatting this part well, so:
// @formatter:off
function makeApiCall<Path extends keyof ApiMap, Method extends keyof ApiMap[Path]>(
    /* Here, tsc thinks it can't get 'fn' from the api, but it's just because tsc doesn't
       believe in itself -- you can do it, tsc! I believe in you! */
    // @ts-ignore
    handler: ApiMap[Path][Method]['fn']): {
    // @ts-ignore
        fn: ApiMap[Path][Method]['fn'];
        method: Method;
        path: Path;
    } {
    // @formatter:on

    // We can just ignore path and method here, since they're not needed :)
    // tslint:disable:no-any
    return {fn: handler} as any;
}

/**
 * Create a simple response.
 * @param status Response status code
 * @param message Response body
 */
// tslint:disable-next-line:promise-function-async
export function makeResponse<Res>(status: HTTPStatus, message: Res): ApiResponse<Res> {
    return new Promise(resolve => {
        resolve({status, message});
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
            /* For some reason, TSC refuses to infer the type parameters here, which means
            that 'msg' is 'any' unless we manually specify them :(
            It's fine for the GET, as it doesn't take any parameters. */
            POST: makeApiCall<'/api', 'POST'>(msg => makeResponse(HTTPStatus.OK, postApi(msg.message))),
        },
        '/other': {
            GET: makeApiCall(() => makeResponse(HTTPStatus.OK, getNumber())),
            PUT: makeApiCall<'/other', 'PUT'>(msg => makeResponse(HTTPStatus.OK, postNumber(msg.msg))),
        }
    });
}
