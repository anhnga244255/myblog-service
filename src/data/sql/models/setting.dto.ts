import { BaseDto } from "./base.dto";
import { SETTING_TABLE_SCHEMA } from "./../schema";
import { Database } from "../connection";

export class SettingDto extends BaseDto<SettingDto> {
    get tableName(): string {
        return SETTING_TABLE_SCHEMA.TABLE_NAME;
    }
}

export default SettingDto;
Database.bookshelf()["model"](SETTING_TABLE_SCHEMA.TABLE_NAME, SettingDto);
