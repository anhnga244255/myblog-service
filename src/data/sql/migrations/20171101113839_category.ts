import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as UUID from "uuid";
import * as Schema from "../schema";
import { PLATFORM } from "../../../libs/constants";


/**
 * Create category table and its default data
 *
 * @param knex
 * @param Promise
 * @returns {Promise<R>|Created|Promise<TResult>|PromiseLike<TResult>|Promise.<TResult>|Promise<R2|R1>}
 */
const category = (knex, Promise) => {
    // create setting table;
    let SCHEMA = Schema.CATEGORY_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.string(SCHEMA.FIELDS.NAME, 36);
            });
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return category(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.CATEGORY_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
    ]);
};
