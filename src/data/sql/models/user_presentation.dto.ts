import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class UserPresentationDto extends BaseDto<UserPresentationDto> {
    get tableName(): string {
        return Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME;
    }
    public user(): any {
        return this.belongsTo(Schema.USER_TABLE_SCHEMA.TABLE_NAME, Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID);
    }
    public presentation(): any {
        return this.belongsTo(Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME, Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID);
    }
}

export default UserPresentationDto;
Database.bookshelf()["model"](Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME, UserPresentationDto);
