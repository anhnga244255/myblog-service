import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as UUID from "uuid";
import * as Schema from "../schema";
import { PLATFORM } from "../../../libs/constants";

const presentation = (knex, Promise) => {
    let SCHEMA = Schema.PRESENTATION_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.table(SCHEMA.TABLE_NAME, (table) => {
                table.integer(SCHEMA.FIELDS.PRIORITY).notNullable().default(0);
                table.string(SCHEMA.FIELDS.USER_CODE, 255).nullable();
            });
        });
};

const userCode = (knex, Promise) => {
    let SCHEMA = Schema.USER_CODE_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.table(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.NAME, 255).nullable();
            });
        });
};

const assignPresentation = (knex, Promise) => {
    let SCHEMA = Schema.ASSIGN_PRESENTATION_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.createTable(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.ID, 36).notNullable().primary();
                table.boolean(SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
                table.dateTime(SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
                table.dateTime(SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));

                table.string(SCHEMA.FIELDS.PRESENTATION_ID, 36).notNullable().index()
                    .references(Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.string(SCHEMA.FIELDS.COUNTRY, 255).nullable();
                table.string(SCHEMA.FIELDS.STATE, 255).nullable();
                table.string(SCHEMA.FIELDS.PROVINCE, 255).nullable();
                table.text(SCHEMA.FIELDS.TAG).nullable();
                table.text(SCHEMA.FIELDS.USER).nullable();
            });
        });
};


export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return presentation(knex, Promise);
        })
        .then(() => {
            return userCode(knex, Promise);
        })
        .then(() => {
            return assignPresentation(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.table(`${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}`, function (table) {
            table.dropColumn(`${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.PRIORITY}`);
            table.dropColumn(`${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.USER_CODE}`);
        }),
        knex.schema.table(`${Schema.USER_CODE_TABLE_SCHEMA.TABLE_NAME}`, function (table) {
            table.dropColumn(`${Schema.USER_CODE_TABLE_SCHEMA.FIELDS.NAME}`);
        }),
        knex.schema.raw(`DROP TABLE IF EXISTS ${Schema.ASSIGN_PRESENTATION_TABLE_SCHEMA.TABLE_NAME} CASCADE`),
    ]);
};