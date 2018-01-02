import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class MediaDto extends BaseDto<MediaDto> {
    get tableName(): string {
        return Schema.MEDIA_TABLE_SCHEMA.TABLE_NAME;
    }
}

export default MediaDto;
Database.bookshelf()["model"](Schema.MEDIA_TABLE_SCHEMA.TABLE_NAME, MediaDto);
