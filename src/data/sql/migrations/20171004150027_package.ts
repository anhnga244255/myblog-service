import { PACKAGE_TABLE_SCHEMA, USER_TABLE_SCHEMA } from "./../schema";
import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as UUID from "uuid";
import * as Schema from "../schema";
import { PLATFORM } from "../../../libs/constants";

/**
 * Create packages table
 * @param Promise
 * @return {Promise<any>}
 */

const packages = (knex, Promise) => {
    let SCHEMA = Schema.PACKAGE_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.string(SCHEMA.FIELDS.NAME, 255).notNullable();
                table.text(SCHEMA.FIELDS.DESCRIPTION).nullable();
                table.float(SCHEMA.FIELDS.NUMBER_ACCOUNT).defaultTo(0.0);
                table.float(SCHEMA.FIELDS.NUMBER_FILE).defaultTo(0.0);
            });
        });
};

const userPackage = (knex, Promise) => {
    let SCHEMA = Schema.USER_PACKAGE_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.string(SCHEMA.FIELDS.USER_ID, 36).notNullable().index()
                    .references(Schema.USER_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.USER_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.string(SCHEMA.FIELDS.PACKAGE_ID, 36).notNullable().index()
                    .references(Schema.PACKAGE_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
                table.float(SCHEMA.FIELDS.NUMBER_ACCOUNT).defaultTo(0.0);
                table.float(SCHEMA.FIELDS.NUMBER_FILE).defaultTo(0.0);
            });
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return packages(knex, Promise);
        })
        .then(() => {
            return userPackage(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME} CASCADE`)
    ]);
};