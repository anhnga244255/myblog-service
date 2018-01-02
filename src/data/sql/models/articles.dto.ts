import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

// create by Nga
export class ArticlesDto extends BaseDto<ArticlesDto> {
    get tableName(): string {
        return Schema.ARTICLES_TABLE_SCHEMA.TABLE_NAME;
    }
    public category(): any{
        return this.belongsTo(Schema.CATEGORY_TABLE_SCHEMA.TABLE_NAME,Schema.ARTICLES_TABLE_SCHEMA.FIELDS.CATEGORY_ID)
    }
}

export default ArticlesDto;
Database.bookshelf()["model"](Schema.ARTICLES_TABLE_SCHEMA.TABLE_NAME, ArticlesDto);
