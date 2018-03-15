import * as express from 'express';

import {ApiMap, apiObject, ApiResponse, HTTPMethod, HTTPStatus} from '../api/base';
import {getNumber, getString, postNumber, postString} from './controller';

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
    // Actually caused by https://github.com/Microsoft/TypeScript/issues/21760 - there's a monkey patch for this
    handler: ApiMap[Path][Method]['fn']): {
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
 * Initialize routing.
 * @param app Express application
 */
export function initRoutes(app: express.Express) {
    hostApi(app, {
        '/api': {
            GET: makeApiCall(getString),
            POST: makeApiCall(postString)
        },
        '/other': {
            GET: makeApiCall(getNumber),
            PUT: makeApiCall(postNumber)
        }
    });
}
