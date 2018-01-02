import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { ROLE_TABLE_SCHEMA } from "./../data/sql/schema";

export class RoleModel extends BaseModel {
    @Json("name")
    @Bookshelf(ROLE_TABLE_SCHEMA.FIELDS.NAME)
    public name: string = undefined;

    @Json("desc")
    @Bookshelf(ROLE_TABLE_SCHEMA.FIELDS.DESCRIPTION)
    public desc: string = undefined;
}
