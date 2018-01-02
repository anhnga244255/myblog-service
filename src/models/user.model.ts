import * as Schema from "../data/sql/schema";
import * as express from "express";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { RoleModel } from "./role.model";
import { USER_TABLE_SCHEMA } from "./../data/sql/schema";
import { UserDto, RoleDto } from "../data/sql/models";
import { UserPackageModel } from "./user_package.model";
import { UserTagModel } from "./user_tag.model";

export class UserModel extends BaseModel {
    @Json("firstName")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.FIRST_NAME)
    public firstName: string = undefined;

    @Json("lastName")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.LAST_NAME)
    public lastName: string = undefined;

    @Json("email")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.EMAIL)
    public email: string = undefined;

    @Json("phone")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.PHONE_NUMBER)
    public phone: string = undefined;

    @Json("password")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.PASSWORD)
    public password: string = undefined;

    @Json("avatarUrl")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.AVATAR_URL)
    public avatarUrl: string = undefined;

    @Json("roleId")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.ROLE_ID)
    public roleId: string = undefined;

    @Json("parentId")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.PARENT_ID)
    public parentId: string = undefined;

    @Json("country")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.COUNTRY)
    public country: string = undefined;

    @Json("state")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.STATE)
    public state: string = undefined;

    @Json("province")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.PROVINCE)
    public province: string = undefined;

    @Json("language")
    @Bookshelf(USER_TABLE_SCHEMA.FIELDS.LANGUAGE)
    public language: string = undefined;

    @Json({ name: "role", clazz: RoleModel, omitEmpty: true })
    @Bookshelf({ relation: "role", clazz: RoleModel })
    public role: RoleModel = undefined;

    @Json({ name: "account", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "account", clazz: UserModel })
    public account: UserModel = undefined;

    @Json({ name: "userTag", clazz: UserTagModel, omitEmpty: true })
    @Bookshelf({ relation: "userTag", clazz: UserTagModel })
    public userTag: UserTagModel = undefined;

    @Json("tags")
    public tags: string[] = undefined;
}
