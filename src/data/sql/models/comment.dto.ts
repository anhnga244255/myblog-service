import { COMMENT_TABLE_SCHEMA } from "./../schema";
import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

// create by Nga
export class CommentDto extends BaseDto<CommentDto> {
    get tableName(): string {
        return Schema.COMMENT_TABLE_SCHEMA.TABLE_NAME;
    }

    public article(): any{
        return this.belongsTo(Schema.ARTICLES_TABLE_SCHEMA.TABLE_NAME,Schema.COMMENT_TABLE_SCHEMA.FIELDS.ARTICLES_ID);
    }
}

export default CommentDto;
Database.bookshelf()["model"](Schema.COMMENT_TABLE_SCHEMA.TABLE_NAME, CommentDto);
