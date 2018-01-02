import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { PRIORITY } from "./../libs/scheduler";
import { PackageModel } from "./package.model";
import { USER_PACKAGE_TABLE_SCHEMA } from "./../data/sql/schema";
import { UserModel } from "./user.model";

export class UserPackageModel extends BaseModel {
    @Json("userId")
    @Bookshelf(USER_PACKAGE_TABLE_SCHEMA.FIELDS.USER_ID)
    public userId: string = undefined;

    @Json("packageId")
    @Bookshelf(USER_PACKAGE_TABLE_SCHEMA.FIELDS.PACKAGE_ID)
    public packageId: string = undefined;

    @Json("numberAccount")
    @Bookshelf(USER_PACKAGE_TABLE_SCHEMA.FIELDS.NUMBER_ACCOUNT)
    public numberAccount: number = undefined;

    @Json("numberFile")
    @Bookshelf(USER_PACKAGE_TABLE_SCHEMA.FIELDS.NUMBER_FILE)
    public numberFile: number = undefined;

    @Json("price")
    @Bookshelf(USER_PACKAGE_TABLE_SCHEMA.FIELDS.PRICE)
    public price: number = undefined;

    @Json({ name: "user", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "user", clazz: UserModel })
    public user: UserModel = undefined;

    @Json({ name: "package", clazz: PackageModel, omitEmpty: true })
    @Bookshelf({ relation: "package", clazz: PackageModel })
    public package: PackageModel = undefined;
}
