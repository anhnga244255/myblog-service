import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { PRIORITY } from "./../libs/scheduler";
import { PackageModel } from "./package.model";
import { TagModel } from "./tag.model";
import { USER_TAG_TABLE_SCHEMA } from "./../data/sql/schema";
import { UserModel } from "./user.model";

export class UserTagModel extends BaseModel {
    @Json("userId")
    @Bookshelf(USER_TAG_TABLE_SCHEMA.FIELDS.USER_ID)
    public userId: string = undefined;

    @Json("tagId")
    @Bookshelf(USER_TAG_TABLE_SCHEMA.FIELDS.TAG_ID)
    public tagId: string = undefined;

    @Json({ name: "user", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "user", clazz: UserModel })
    public user: UserModel = undefined;

    @Json({ name: "tag", clazz: TagModel, omitEmpty: true })
    @Bookshelf({ relation: "tag", clazz: TagModel })
    public tag: TagModel = undefined;
}
