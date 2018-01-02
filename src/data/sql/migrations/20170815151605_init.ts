import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as UUID from "uuid";
import * as Schema from "../schema";
import { PLATFORM } from "../../../libs/constants";

/**
 * Create setting table and its default data
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */
const setting = (knex: Knex, Promise: typeof Bluebird) => {
    // create setting table;
    let SCHEMA = Schema.SETTING_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.boolean(SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.string(SCHEMA.FIELDS.KEYWORD, 100).notNullable().unique();
                table.string(SCHEMA.FIELDS.VALUE, 100).notNullable();
                table.string(SCHEMA.FIELDS.DESC, 255).notNullable();
            });
        });
};

/**
 * Create roles table and its default data
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */
const role = (knex: Knex, Promise: typeof Bluebird) => {
    // create role table;
    let SCHEMA = Schema.ROLE_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.string(SCHEMA.FIELDS.NAME, 255).notNullable();
                table.text(SCHEMA.FIELDS.DESCRIPTION).nullable();
            });
        })
        .then(() => {
            let systemAdmin = {};
            systemAdmin[SCHEMA.FIELDS.ID] = "system_admin";
            systemAdmin[SCHEMA.FIELDS.NAME] = "System Admin";
            systemAdmin[SCHEMA.FIELDS.DESCRIPTION] = "System Admin";

            let manager = {};
            manager[Schema.ROLE_TABLE_SCHEMA.FIELDS.ID] = "manager";
            manager[Schema.ROLE_TABLE_SCHEMA.FIELDS.NAME] = "Manager";
            manager[Schema.ROLE_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "Manager Admin";

            let companyAdmin = {};
            companyAdmin[Schema.ROLE_TABLE_SCHEMA.FIELDS.ID] = "company_admin";
            companyAdmin[Schema.ROLE_TABLE_SCHEMA.FIELDS.NAME] = "Company Admin";
            companyAdmin[Schema.ROLE_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "Company Admin";

            let operator = {};
            operator[Schema.ROLE_TABLE_SCHEMA.FIELDS.ID] = "operator";
            operator[Schema.ROLE_TABLE_SCHEMA.FIELDS.NAME] = "Operator";
            operator[Schema.ROLE_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "Operator";

            let presenter = {};
            presenter[Schema.ROLE_TABLE_SCHEMA.FIELDS.ID] = "presenter";
            presenter[Schema.ROLE_TABLE_SCHEMA.FIELDS.NAME] = "Presenter";
            presenter[Schema.ROLE_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "Presenter";

            return Promise.all([
                // Inserts seed entries
                knex(SCHEMA.TABLE_NAME).insert(systemAdmin),
                knex(SCHEMA.TABLE_NAME).insert(manager),
                knex(SCHEMA.TABLE_NAME).insert(companyAdmin),
                knex(SCHEMA.TABLE_NAME).insert(operator),
                knex(SCHEMA.TABLE_NAME).insert(presenter)
            ]);
        });
};

/**
 * Create users table and its default data
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */
const user = (knex, Promise) => {
    let SCHEMA = Schema.USER_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.string(SCHEMA.FIELDS.ROLE_ID, 36).notNullable().index()
                    .references(Schema.ROLE_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.ROLE_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.string(SCHEMA.FIELDS.EMAIL, 100).notNullable();
                table.string(SCHEMA.FIELDS.PASSWORD, 255).nullable();
                table.string(SCHEMA.FIELDS.FIRST_NAME, 255).notNullable();
                table.string(SCHEMA.FIELDS.LAST_NAME, 255).notNullable();
                table.string(SCHEMA.FIELDS.PHONE_NUMBER, 255).nullable();
                table.text(SCHEMA.FIELDS.AVATAR_URL).nullable();

            });
        })
        .then(() => {
            let systemAdmin = {};
            systemAdmin[SCHEMA.FIELDS.ID] = UUID();
            systemAdmin[SCHEMA.FIELDS.ROLE_ID] = "system_admin";
            systemAdmin[SCHEMA.FIELDS.EMAIL] = "admin@ventuso.net";
            systemAdmin[SCHEMA.FIELDS.PASSWORD] = "$2a$10$Wi0mafgo9CnGYd.gK90ZXe5cgEAM0GyzjDsjm63Fq5t0c8su8.6ni";
            systemAdmin[SCHEMA.FIELDS.FIRST_NAME] = "Admin";
            systemAdmin[SCHEMA.FIELDS.LAST_NAME] = "System";

            let manager = {};
            manager[SCHEMA.FIELDS.ID] = UUID();
            manager[SCHEMA.FIELDS.ROLE_ID] = "manager";
            manager[SCHEMA.FIELDS.EMAIL] = "manager@ventuso.net";
            manager[SCHEMA.FIELDS.PASSWORD] = "$2a$10$Wi0mafgo9CnGYd.gK90ZXe5cgEAM0GyzjDsjm63Fq5t0c8su8.6ni";
            manager[SCHEMA.FIELDS.FIRST_NAME] = "Admin";
            manager[SCHEMA.FIELDS.LAST_NAME] = "Manager";

            return Promise.all([
                // Inserts seed entries
                knex(SCHEMA.TABLE_NAME).insert(systemAdmin),
                knex(SCHEMA.TABLE_NAME).insert(manager)
            ]);
        });
};

/**
 * Create sessions table and its default data
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */
const sessions = (knex, Promise) => {
    // create sessions table;
    let SCHEMA = Schema.SESSION_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.text(SCHEMA.FIELDS.TOKEN).notNullable();
                table.dateTime(SCHEMA.FIELDS.EXPIRE).notNullable();
                table.string(SCHEMA.FIELDS.HASH, 36).notNullable();

                table.string(SCHEMA.FIELDS.USER_ID, 36).notNullable().index()
                    .references(Schema.USER_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.USER_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
            });
        });
};

/**
 * Create devices table and its default data
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */
const devices = (knex, Promise) => {
    // create setting table;
    let SCHEMA = Schema.DEVICE_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);

                table.string(SCHEMA.FIELDS.USER_ID, 36).notNullable().index()
                    .references(Schema.USER_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.USER_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.string(SCHEMA.FIELDS.DEVICE_ID, 255).notNullable();
                table.string(SCHEMA.FIELDS.REGISTRAR_ID, 255).notNullable().defaultTo("");
                table.string(SCHEMA.FIELDS.DEVICE_OS, 255).nullable();
                table.string(SCHEMA.FIELDS.DEVICE_MODEL, 255).nullable();
                table.string(SCHEMA.FIELDS.BUILD_VERSION, 255).nullable();
                table.string(SCHEMA.FIELDS.DEVICE_NAME, 255).nullable();
                table.string(SCHEMA.FIELDS.OS_VERSION, 255).nullable();
                table.string(SCHEMA.FIELDS.APP_VERSION, 255).nullable();
                table.integer(SCHEMA.FIELDS.IS_SANDBOX).notNullable().defaultTo(1);
            });
        });
};

/**
 * Create application table and its default data
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */
const applications = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(Schema.APPLICATION_TABLE_SCHEMA.TABLE_NAME, (table => {
                table.string(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.string(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.PLATFORM).notNullable().defaultTo(PLATFORM.IOS);
                table.integer(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.VERSION).notNullable().defaultTo(100);
                table.boolean(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.IS_LATEST).notNullable().defaultTo(1);
                table.boolean(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.FORCE_UPDATE).notNullable().defaultTo(0);
            }));
        })
        .then(() => {
            let ios = {};
            ios[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.ID] = UUID();
            ios[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.PLATFORM] = PLATFORM.IOS;
            ios[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.VERSION] = 1;
            ios[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.IS_LATEST] = true;
            ios[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.FORCE_UPDATE] = false;


            let android = {};
            android[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.ID] = UUID();
            android[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.PLATFORM] = PLATFORM.ANDROID;
            android[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.VERSION] = 1;
            android[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.IS_LATEST] = true;
            android[Schema.APPLICATION_TABLE_SCHEMA.FIELDS.FORCE_UPDATE] = false;

            return Promise.all([
                // Inserts seed entries
                knex(Schema.APPLICATION_TABLE_SCHEMA.TABLE_NAME).insert(ios),
                knex(Schema.APPLICATION_TABLE_SCHEMA.TABLE_NAME).insert(android)
            ]);
        });
};

/**
 * Create health table for health-check
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */
const health = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(Schema.HEALTH_TABLE_SCHEMA.TABLE_NAME, (table => {
                table.string(Schema.HEALTH_TABLE_SCHEMA.FIELDS.ID, 1).notNullable().primary();
            }));
        })
        .then(() => {
            return knex.raw(`INSERT INTO ${Schema.HEALTH_TABLE_SCHEMA.TABLE_NAME} VALUES ('1');`);
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return setting(knex, Promise);
        })
        .then(() => {
            return role(knex, Promise);
        })
        .then(() => {
            return user(knex, Promise);
        })
        .then(() => {
            return sessions(knex, Promise);
        })
        .then(() => {
            return devices(knex, Promise);
        })
        .then(() => {
            return applications(knex, Promise);
        })
        .then(() => {
            return health(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.SETTING_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.SESSION_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.USER_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.ROLE_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.DEVICE_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.APPLICATION_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.HEALTH_TABLE_SCHEMA.TABLE_NAME} CASCADE`)
    ]);
};
