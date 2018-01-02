import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class PresentationDto extends BaseDto<PresentationDto> {
    get tableName(): string {
        return Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME;
    }
    public user(): any {
        return this.belongsTo(Schema.USER_TABLE_SCHEMA.TABLE_NAME, Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID);
    }
    public assignPresentation(): any {
        return this.belongsTo(Schema.ASSIGN_PRESENTATION_TABLE_SCHEMA.TABLE_NAME, Schema.ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID);
    }
}

export default PresentationDto;
Database.bookshelf()["model"](Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME, PresentationDto);
