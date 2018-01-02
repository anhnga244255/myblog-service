import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { USER_CODE_TABLE_SCHEMA } from "./../data/sql/schema";
import { UserModel } from "./user.model";

export class UserCodeModel extends BaseModel {
    @Json("userId")
    @Bookshelf(USER_CODE_TABLE_SCHEMA.FIELDS.USER_ID)
    public userId: string = undefined;

    @Json("name")
    @Bookshelf(USER_CODE_TABLE_SCHEMA.FIELDS.NAME)
    public name: string = undefined;

    @Json("code")
    @Bookshelf(USER_CODE_TABLE_SCHEMA.FIELDS.CODE)
    public code: string = undefined;

    @Json("isUsed")
    @Bookshelf(USER_CODE_TABLE_SCHEMA.FIELDS.IS_USED)
    public isUsed: boolean = undefined;

    @Json({ name: "user", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "user", clazz: UserModel })
    public user: UserModel = undefined;
}
