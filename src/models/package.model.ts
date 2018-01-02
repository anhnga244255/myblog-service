import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { PACKAGE_TABLE_SCHEMA } from "./../data/sql/schema";
import { PRIORITY } from "./../libs/scheduler";

export class PackageModel extends BaseModel {
    @Json("name")
    @Bookshelf(PACKAGE_TABLE_SCHEMA.FIELDS.NAME)
    public name: string = undefined;

    @Json("desc")
    @Bookshelf(PACKAGE_TABLE_SCHEMA.FIELDS.DESCRIPTION)
    public desc: string = undefined;

    @Json("numberAccount")
    @Bookshelf(PACKAGE_TABLE_SCHEMA.FIELDS.NUMBER_ACCOUNT)
    public numberAccount: number = undefined;

    @Json("numberFile")
    @Bookshelf(PACKAGE_TABLE_SCHEMA.FIELDS.NUMBER_FILE)
    public numberFile: number = undefined;

    @Json("price")
    @Bookshelf(PACKAGE_TABLE_SCHEMA.FIELDS.PRICE)
    public price: number = undefined;

    @Json("priority")
    @Bookshelf(PACKAGE_TABLE_SCHEMA.FIELDS.PRIORITY)
    public priority: number = undefined;
}
