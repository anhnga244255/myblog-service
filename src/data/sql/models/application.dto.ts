import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class ApplicationDto extends BaseDto<ApplicationDto> {
    get tableName(): string {
        return Schema.APPLICATION_TABLE_SCHEMA.TABLE_NAME;
    }
}

export default ApplicationDto;
Database.bookshelf()["model"](Schema.APPLICATION_TABLE_SCHEMA.TABLE_NAME, ApplicationDto);
