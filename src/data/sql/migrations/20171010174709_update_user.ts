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
                table.string(SCHEMA.FIELDS.LANGUAGE, 255).nullable();
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
            table.dropColumn(`${Schema.USER_TABLE_SCHEMA.FIELDS.LANGUAGE}`);
        }),
    ]);
};
