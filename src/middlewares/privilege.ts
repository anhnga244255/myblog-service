/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";

export const privilege = (): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        next();
    };
};

export default privilege;
