import { BaseDto } from "./base.dto";
import { Database } from "../connection";
import * as Schema from "../schema";

export class TagDto extends BaseDto<TagDto> {
    get tableName(): string {
        return Schema.TAG_TABLE_SCHEMA.TABLE_NAME;
    }

    public user(): any {
        return this.belongsTo(Schema.USER_TABLE_SCHEMA.TABLE_NAME, Schema.TAG_TABLE_SCHEMA.FIELDS.USER_ID);
    }
}

export default TagDto;
Database.bookshelf()["model"](Schema.TAG_TABLE_SCHEMA.TABLE_NAME, TagDto);
