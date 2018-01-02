import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class PresentationReportDto extends BaseDto<PresentationReportDto> {
    get tableName(): string {
        return Schema.PRESENTATION_REPORT_TABLE_SCHEMA.TABLE_NAME;
    }
    public user(): any {
        return this.belongsTo(Schema.USER_TABLE_SCHEMA.TABLE_NAME, Schema.PRESENTATION_REPORT_TABLE_SCHEMA.FIELDS.USER_ID);
    }
    public presentation(): any {
        return this.belongsTo(Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME, Schema.PRESENTATION_REPORT_TABLE_SCHEMA.FIELDS.PRESENTATION_ID);
    }
}

export default PresentationReportDto;
Database.bookshelf()["model"](Schema.PRESENTATION_REPORT_TABLE_SCHEMA.TABLE_NAME, PresentationReportDto);
