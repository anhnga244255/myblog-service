import { PRESENTATION_TABLE_SCHEMA} from "./../schema";
import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as UUID from "uuid";
import * as Schema from "../schema";
import { PLATFORM } from "../../../libs/constants";

/**
 * Create presentation report table
 * @param knex
 * @param Promise
 * @return {Promise<any>}
 */

const presentationReport = (knex, Promise) => {
    let SCHEMA = Schema.PRESENTATION_REPORT_TABLE_SCHEMA;
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

                table.text(SCHEMA.FIELDS.PAGE_TIMING).notNullable();
                table.text(SCHEMA.FIELDS.NOTE).nullable();
                table.text(SCHEMA.FIELDS.AUDIO_URL).notNullable();
                table.double(SCHEMA.FIELDS.LATITUDE).notNullable().default(0);
                table.double(SCHEMA.FIELDS.LONGITUDE).notNullable().default(0);
                table.integer(SCHEMA.FIELDS.RATE).notNullable().default(0);
                table.dateTime(SCHEMA.FIELDS.START_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.END_DATE).defaultTo(knex.raw("current_timestamp"));
            });
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return presentationReport(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.PRESENTATION_REPORT_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
    ]);
};