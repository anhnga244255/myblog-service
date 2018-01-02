import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as UUID from "uuid";
import * as Schema from "../schema";
import { PLATFORM } from "../../../libs/constants";

const user = (knex, Promise) => {
    let SCHEMA = Schema.USER_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.table(SCHEMA.TABLE_NAME, (table) => {
                table.string(SCHEMA.FIELDS.PARENT_ID, 36).nullable().index()
                    .references(Schema.USER_TABLE_SCHEMA.FIELDS.ID)
                    .inTable(Schema.USER_TABLE_SCHEMA.TABLE_NAME)
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
                table.string(SCHEMA.FIELDS.COMPANY, 255).nullable();
                table.string(SCHEMA.FIELDS.ADDRESS, 255).nullable();
                table.string(SCHEMA.FIELDS.COUNTRY, 255).nullable();
                table.string(SCHEMA.FIELDS.STATE, 255).nullable();
                table.string(SCHEMA.FIELDS.PROVINCE, 255).nullable();
            });
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return user(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.table(`${Schema.USER_TABLE_SCHEMA.TABLE_NAME}`, function (table) {
            table.dropColumn(`${Schema.USER_TABLE_SCHEMA.FIELDS.PARENT_ID}`);
            table.dropColumn(`${Schema.USER_TABLE_SCHEMA.FIELDS.COMPANY}`);
            table.dropColumn(`${Schema.USER_TABLE_SCHEMA.FIELDS.ADDRESS}`);
            table.dropColumn(`${Schema.USER_TABLE_SCHEMA.FIELDS.COUNTRY}`);
            table.dropColumn(`${Schema.USER_TABLE_SCHEMA.FIELDS.STATE}`);
            table.dropColumn(`${Schema.USER_TABLE_SCHEMA.FIELDS.PROVINCE}`);
        }),
    ]);
};
