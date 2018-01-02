/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../../../../data/sql/schema";
import * as express from "express";
import { BaseDto } from "../../../../data/sql/models";
import { HttpStatus } from "../../../../libs";
import { Redis } from "../../../../data/redis/redis";

export class HealthHandler {
    public static check(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let checkDatabase = () => {
            return BaseDto.knex().raw("SELECT * FROM health").then(result => {
                return result.rows;
            });
        };
        let checkRedis = () => {
            return Redis.getClient().setAsync("health", 1);
        };
        return Promise.all([checkDatabase(), checkRedis()])
            .then(result => {
                res.status(HttpStatus.OK);
                res.send("OK");
            })
            .catch(err => {
                next(err);
            });
    }
}

export default HealthHandler;

