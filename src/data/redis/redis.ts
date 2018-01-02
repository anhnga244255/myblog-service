import * as Bluebird from "bluebird";
import {ClientOpts, Multi, RedisClient} from "redis";
import * as _ from "lodash";
import {config as Configuration, logger as Logger, Utils} from "../../libs";
const waitOn = require("wait-on");
const RedisLib = require("redis");
Bluebird.promisifyAll(RedisLib.Multi.prototype);
Bluebird.promisifyAll(RedisLib.RedisClient.prototype);

declare module "redis" {
    export interface Multi extends NodeJS.EventEmitter {
        constructor();
        execAsync(...args: any[]): Bluebird<any>;
    }
    export interface RedisClient extends NodeJS.EventEmitter {
        decrAsync(...args: any[]): Bluebird<any>;
        delAsync(...args: any[]): Bluebird<any>;
        execAsync(...args: any[]): Bluebird<any>;
        getAsync(...args: any[]): Bluebird<any>;
        incrAsync(...args: any[]): Bluebird<any>;
        expireAsync(...args: any[]): Bluebird<any>;
        saddAsync(...args: any[]): Bluebird<any>;
        scardAsync(...args: any[]): Bluebird<any>;
        sdiffAsync(...args: any[]): Bluebird<any>;
        sdiffstoreAsync(...args: any[]): Bluebird<any>;
        setAsync(...args: any[]): Bluebird<any>;
        sinterAsync(...args: any[]): Bluebird<any>;
        sismemberAsync(...args: any[]): Bluebird<any>;
        smembersAsync(...args: any[]): Bluebird<any>;
        smoveAsync(...args: any[]): Bluebird<any>;
        spopAsync(...args: any[]): Bluebird<any>;
        srandmemeberAsync(...args: any[]): Bluebird<any>;
        sremAsync(...args: any[]): Bluebird<any>;
        sscanAsync(...args: any[]): Bluebird<any>;
        sunionAsync(...args: any[]): Bluebird<any>;
        sunionstoreAsync(...args: any[]): Bluebird<any>;
    }
}

interface RedisOpts extends ClientOpts {
    prefix: string;
}


export class RedisConnection {
    private opts: RedisOpts;
    private client: RedisClient;

    constructor(opts?: any) {
        opts = opts || {};
        let defaultOpts: RedisOpts = {
            host: "localhost",
            port: 6379,
            db: "1",
            prefix: process.env.NODE_ENV + ":template:service:v1:",
        };

        this.opts = _.defaultsDeep(opts, defaultOpts) as RedisOpts;
    }

    public initWithWaiting(): Bluebird<boolean> {
        if (process.env.NODE_ENV === "test") {
            return Bluebird.resolve(true);
        }
        Logger.info("Wait for redis connection");

        let isComplete = false;
        return Utils.PromiseLoop(
            () => {
                return isComplete === true;
            },
            () => {
                return new Bluebird((resolve, reject) => {
                    waitOn({
                        resources: [`tcp:${this.opts.host}:${this.opts.port}`]
                    }, (err) => {
                        if (err != null) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }).then(() => {
                    this.client = Bluebird.promisifyAll(RedisLib.createClient(this.opts)) as RedisClient;
                    Logger.info("Redis connection is OK");
                    isComplete = true;
                }).catch((err) => {
                    Logger.info("Connect to redis failed, try again");
                    Logger.error(err.message);
                    isComplete = false;
                });
            })
            .then((object) => {
                return isComplete;
            });
    }

    /**
     *
     * @returns {RedisClient}
     */
    public getClient(): RedisClient {
        return this.client;
    }
}

export const Redis = new RedisConnection(Configuration.database != null ? Configuration.database.redis : null);
export default Redis;
