import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { TAG_TABLE_SCHEMA } from "./../data/sql/schema";
import { UserModel } from "./user.model";

export class TagModel extends BaseModel {
    @Json("userId")
    @Bookshelf(TAG_TABLE_SCHEMA.FIELDS.USER_ID)
    public userId: string = undefined;

    @Json("name")
    @Bookshelf(TAG_TABLE_SCHEMA.FIELDS.NAME)
    public name: string = undefined;

    @Json("desc")
    @Bookshelf(TAG_TABLE_SCHEMA.FIELDS.DESCRIPTION)
    public desc: string = undefined;

    @Json({ name: "user", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "user", clazz: UserModel })
    public user: UserModel = undefined;
}
