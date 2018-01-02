import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class UserTagDto extends BaseDto<UserTagDto> {
    get tableName(): string {
        return Schema.USER_TAG_TABLE_SCHEMA.TABLE_NAME;
    }
    public user(): any {
        return this.belongsTo(Schema.USER_TABLE_SCHEMA.TABLE_NAME, Schema.USER_TAG_TABLE_SCHEMA.FIELDS.USER_ID);
    }
    public tag(): any {
        return this.belongsTo(Schema.TAG_TABLE_SCHEMA.TABLE_NAME, Schema.USER_TAG_TABLE_SCHEMA.FIELDS.TAG_ID);
    }
}

export default UserTagDto;
Database.bookshelf()["model"](Schema.USER_TAG_TABLE_SCHEMA.TABLE_NAME, UserTagDto);
