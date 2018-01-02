import { PRESENTATION_TABLE_SCHEMA, USER_TABLE_SCHEMA } from "./../schema";
import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as UUID from "uuid";
import * as Schema from "../schema";
import { PLATFORM } from "../../../libs/constants";

/**
 * Create presentation table
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */

const presentation = (knex, Promise) => {
    let SCHEMA = Schema.PRESENTATION_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.string(SCHEMA.FIELDS.USER_ID, 36).notNullable().index()
                    .references(Schema.USER_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.USER_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.string(SCHEMA.FIELDS.TITLE, 255).notNullable();
                table.string(SCHEMA.FIELDS.LANGUAGE, 255).notNullable();
                table.text(SCHEMA.FIELDS.DESCRIPTION).nullable();
                table.text(SCHEMA.FIELDS.IMAGE_URL).nullable();
                table.text(SCHEMA.FIELDS.PAGE_TIMING).notNullable();
                table.float(SCHEMA.FIELDS.NUMBER_PAGE).notNullable().defaultTo(0.0);
            });
        });
};

const accountPresentation = (knex, Promise) => {
    let SCHEMA = Schema.USER_PRESENTATION_TABLE_SCHEMA;
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

                table.string(SCHEMA.FIELDS.PRESENTATION_ID, 36).notNullable().index()
                    .references(Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
            });
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return presentation(knex, Promise);
        })
        .then(() => {
            return accountPresentation(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME} CASCADE`)
    ]);
};