import { PACKAGE_TABLE_SCHEMA } from "./../schema";
import { PRIORITY } from "./../../../libs/scheduler";
import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as UUID from "uuid";
import * as Schema from "../schema";
import { PLATFORM } from "../../../libs/constants";

const packages = (knex, Promise) => {
    let SCHEMA = Schema.PACKAGE_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.table(SCHEMA.TABLE_NAME, (table) => {
                table.integer(SCHEMA.FIELDS.PRIORITY, 11).notNullable().default(0);
            });
        });
};

export const up = (knex, Promise) => {
    return Promise.resolve()
        .then(() => {
            return packages(knex, Promise);
        });
};

export const down = (knex, Promise) => {
    return Promise.all([
        knex.schema.table(`${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME}`, function (table) {
            table.dropColumn(`${Schema.PACKAGE_TABLE_SCHEMA.FIELDS.PRIORITY}`);
        }),
    ]);
};
