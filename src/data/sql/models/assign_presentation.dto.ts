import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class AssignPresentationDto extends BaseDto<AssignPresentationDto> {
    get tableName(): string {
        return Schema.ASSIGN_PRESENTATION_TABLE_SCHEMA.TABLE_NAME;
    }
    public presentation(): any {
        return this.belongsTo(Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME, Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID);
    }
}

export default AssignPresentationDto;
Database.bookshelf()["model"](Schema.ASSIGN_PRESENTATION_TABLE_SCHEMA.TABLE_NAME, AssignPresentationDto);
