import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class UserCodeDto extends BaseDto<UserCodeDto> {
    get tableName(): string {
        return Schema.USER_CODE_TABLE_SCHEMA.TABLE_NAME;
    }
    public user(): any {
        return this.belongsTo(Schema.USER_TABLE_SCHEMA.TABLE_NAME, Schema.USER_CODE_TABLE_SCHEMA.FIELDS.USER_ID);
    }
}

export default UserCodeDto;
Database.bookshelf()["model"](Schema.USER_CODE_TABLE_SCHEMA.TABLE_NAME, UserCodeDto);
