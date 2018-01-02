import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { SETTING_TABLE_SCHEMA } from "./../data/sql/schema";

export class SettingModel extends BaseModel {
    @Json("keyword")
    @Bookshelf(SETTING_TABLE_SCHEMA.FIELDS.KEYWORD)
    public keyword: string = undefined;

    @Json("value")
    @Bookshelf(SETTING_TABLE_SCHEMA.FIELDS.VALUE)
    public value: string = undefined;

    @Json("desc")
    @Bookshelf(SETTING_TABLE_SCHEMA.FIELDS.DESC)
    public desc: string = undefined;
}
