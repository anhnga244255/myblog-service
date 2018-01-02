import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

// create by Nga
export class CategoryDto extends BaseDto<CategoryDto> {
    get tableName(): string {
        return Schema.CATEGORY_TABLE_SCHEMA.TABLE_NAME;
    }
}

export default CategoryDto;
Database.bookshelf()["model"](Schema.CATEGORY_TABLE_SCHEMA.TABLE_NAME, CategoryDto);
