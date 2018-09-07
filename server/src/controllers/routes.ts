import * as express from 'express';

import {ApiMap, apiObject, HTTPStatus} from '../api/base';
import {addCustomer, getCustomers, searchCustomers} from './controller';

const apiPrefix = 'api';

// tslint:disable:no-any
function dropFirstParameter(fn: any): any {
    return (...args: any[]) => fn(...args.splice(1));
}

/**
 * Initialize the routes in the given map
 * @param app Express application
 * @param prefix api prefix
 * @param api Api to iterate
 */
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
                const body = req.body.message;
                const queryParameters = req.query;

                let handler: any;
                let checker: any;
                if (key === 'GET') {
                    // GETs don't have a body, so drop it from the list
                    handler = dropFirstParameter((api as any)[key]);
                    checker = dropFirstParameter(checkers[key]);
                } else {
                    handler = (api as any)[key];
                    checker = checkers[key];
                }

                const checkResult: string = checker(body, queryParameters);
                if (checkResult) {
                    res.status(HTTPStatus.BadRequest);
                    res.send(`Bad request: ${checkResult}`);
                } else {
                    handler(body, queryParameters)
                        .then((value: any) => {
                            res.status(200);
                            res.send(JSON.stringify({message: value}));
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
            customers: {
                GET: getCustomers,
                POST: addCustomer
            },
            search: {
                GET: searchCustomers
            }
        },
        apiObject);
}
