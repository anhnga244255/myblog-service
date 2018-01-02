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
                table.text(SCHEMA.FIELDS.FILE_URL).notNullable();
            });
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return presentation(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.table(`${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}`, function (table) {
            table.dropColumn(`${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.FILE_URL}`);
        })
    ]);
};
