import * as express from 'express';

import {ApiMap, apiObject, ApiResponse, HTTPStatus} from '../api/base';
import {getNumber, getString, postNumber, postString} from './controller';

const apiPrefix = 'api';

/**
 * Initialize the routes in the given map
 * @param app Express application
 * @param prefix api prefix
 * @param api Api to iterate
 */
// tslint:disable:no-any
function hostApi(app: express.Express, prefix: string[], api: ApiMap, checkers: any): void {
    const methods: any = {
        GET: app.get.bind(app),
        POST: app.post.bind(app),
        PUT: app.put.bind(app)
    };
    Object.keys(api).forEach((key: any) => {
        if (typeof (api as any)[key] !== 'object') {
            const path = `/${prefix.join('/')}`;
            methods[key](path, (req: any, res: any) => {
                const handler = (api as any)[key];
                const checker = checkers[key];
                const response: ApiResponse<any> = handler(req.body);
                if (checker && !checker(req.body)) {
                    res.status(HTTPStatus.BadRequest);
                    res.send('Bad request');
                } else {
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
        } else {
            hostApi(app, prefix.concat([key]), (api as any)[key], checkers[key]);
        }
    });
}

// tslint:enable:no-any

/**
 * Initialize routing.
 * @param app Express application
 */
export function initRoutes(app: express.Express) {
    hostApi(
        app,
        [apiPrefix],
        {
            str: {
                GET: getString,
                POST: postString
            },
            num: {
                nested: {
                    GET: getNumber,
                    PUT: postNumber
                }
            }
        },
        apiObject);
}
