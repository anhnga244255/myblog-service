/**
 * Created by phuongho on 15/08/17.
 */
import * as Bluebird from "bluebird";
import * as Bookshelf from "bookshelf";
import * as Knex from "knex";
import * as _ from "lodash";
import * as waitOn from "wait-on";
import { config, logger, Utils } from "../../libs";
import { MySqlConnectionConfig } from "knex";

declare module "bookshelf" {
    interface Bookshelf extends Bookshelf.Events<any> {
        model(name: String, model: Model<any>): Model<any>;
    }
    interface ModelBase<T extends Model<any>> extends IModelBase { }
    interface Model<T extends Model<any>> extends ModelBase<T> {
        // For pagination plugin
        fetchPage(options?: { limit; number, offset: number, withRelated: WithRelatedQuery });
        // For registry plugin
        belongsTo<R extends Model<any>>(target: { new (...args: any[]): R } | String, foreignKey?: string, foreignKeyTarget?: string): R;
        hasMany<R extends Model<any>>(target: { new (...args: any[]): R } | String, foreignKey?: string, foreignKeyTarget?: string): Collection<R>;
        hasOne<R extends Model<any>>(target: { new (...args: any[]): R } | String, foreignKey?: string, foreignKeyTarget?: string): R;
        belongsToMany<R extends Model<any>>(target: { new (...args: any[]): R } | String, table?: string, foreignKey?: string, otherKey?: string, foreignKeyTarget?: string, otherKeyTarget?: string): Collection<R>;
    }
}

interface Log {
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}

export class Connection {
    private sql: MySqlConnectionConfig;
    private instance: Bookshelf;

    constructor(opts?: any, private logger?: Log) {
        this.logger = logger || {
            error: (message: string, meta?: any): void => { },
            warn: (message: string, meta?: any): void => { },
            info: (message: string, meta?: any): void => { },
            debug: (message: string, meta?: any): void => { },
        };

        opts = opts || {};
        let defaultConf: MySqlConnectionConfig = {
            host: "127.0.0.1",
            port: 5432,
            user: "root",
            password: "",
            database: "test",
            charset: "utf8mb4",
            timezone: "UTC",
        };

        this.sql = _.defaultsDeep(opts, defaultConf) as MySqlConnectionConfig;
        if (process.env.DB_HOST != null) {
            this.sql.host = process.env.DB_HOST;
        }
        if (process.env.DB_PORT != null) {
            this.sql.port = Number.parseInt(process.env.DB_PORT, 10);
        }
        if (process.env.DB_USER != null) {
            this.sql.user = process.env.DB_USER;
        }
        if (process.env.DB_PASSWORD != null) {
            this.sql.password = process.env.DB_PASSWORD;
        }
        if (process.env.DB_NAME != null) {
            this.sql.database = process.env.DB_NAME;
        }

        let knex: Knex = Knex({
            client: "postgresql",
            connection: this.sql,
            debug: this.sql.debug ? this.sql.debug : false,
        });

        this.instance = Bookshelf(knex);
        this.instance.plugin("pagination");
        this.instance.plugin("registry");
    }

    public migration(): Bluebird<boolean> {
        this.logger.info("Wait for database connection");

        let isComplete = false;
        return Utils.PromiseLoop(
            () => {
                return isComplete === true;
            },
            () => {
                return new Bluebird((resolve, reject) => {
                    waitOn({
                        resources: [`tcp:${this.sql.host}:${this.sql.port}`]
                    }, (err) => {
                        if (err != null) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }).then(() => {
                    return Bluebird.delay(1000);
                }).then(() => {
                    this.logger.info("Perform database migration");
                    return this.instance.knex.migrate.latest({
                        directory: __dirname + "/migrations",
                    });
                }).then((info) => {
                    this.logger.info("All migrations were success");
                    isComplete = true;
                }).catch((err) => {
                    this.logger.info("All migrations were failed, try again");
                    this.logger.error(err.message);
                    isComplete = false;
                });
            })
            .then((object) => {
                return isComplete;
            });
    }

    public bookshelf(): Bookshelf {
        return this.instance;
    }
}

export const Database = new Connection(config.database ? config.database.postgres : {}, logger);
export default Database;
