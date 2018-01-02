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
                table.double(SCHEMA.FIELDS.PRICE).notNullable().default(0);
            });
        });
};

const userPackage = (knex, Promise) => {
    let SCHEMA = Schema.USER_PACKAGE_TABLE_SCHEMA;
    return Promise.resolve()
        .then(() => {
            return knex.schema.table(SCHEMA.TABLE_NAME, (table) => {
                table.double(SCHEMA.FIELDS.PRICE).notNullable().default(0);
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
        knex.schema.table(`${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME}`, function (table) {
            table.dropColumn(`${Schema.PACKAGE_TABLE_SCHEMA.FIELDS.PRICE}`);
        }),
        knex.schema.table(`${Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME}`, function (table) {
            table.dropColumn(`${Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.PRICE}`);
        }),
    ]);
};
