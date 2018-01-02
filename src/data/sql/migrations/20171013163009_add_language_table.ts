import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as Schema from "../schema";
import { LANGUAGE_TABLE_SCHEMA } from "./../schema";



/**
 * Create tags table and its default data
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */

const language = (knex, Promise) => {
    let SCHEMA = LANGUAGE_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.string(SCHEMA.FIELDS.CODE, 36).notNullable();
                table.string(SCHEMA.FIELDS.NAME, 36).notNullable();
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.integer(SCHEMA.FIELDS.PRIORITY, 6);
            });
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return language(knex, Promise);
        });

};

export const down = (knex: Knex, promise: typeof Bluebird): Bluebird<any> => {
    return promise.resolve();
};
