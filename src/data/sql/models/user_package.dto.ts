import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class UserPackageDto extends BaseDto<UserPackageDto> {
    get tableName(): string {
        return Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME;
    }
    public user(): any {
        return this.belongsTo(Schema.USER_TABLE_SCHEMA.TABLE_NAME, Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.USER_ID);
    }
    public package(): any {
        return this.belongsTo(Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME, Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.PACKAGE_ID);
    }
}

export default UserPackageDto;
Database.bookshelf()["model"](Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME, UserPackageDto);
