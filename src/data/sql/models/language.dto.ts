import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

// create by Nga
export class LanguageDto extends BaseDto<LanguageDto> {
    get tableName(): string {
        return Schema.LANGUAGE_TABLE_SCHEMA.TABLE_NAME;
    }
}

export default LanguageDto;
Database.bookshelf()["model"](Schema.LANGUAGE_TABLE_SCHEMA.TABLE_NAME, LanguageDto);
