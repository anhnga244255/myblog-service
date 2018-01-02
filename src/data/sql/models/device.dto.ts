import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class DeviceDto extends BaseDto<DeviceDto> {
    get tableName() {
        return Schema.DEVICE_TABLE_SCHEMA.TABLE_NAME;
    }

    public user(): any {
        return this.belongsTo(Schema.USER_TABLE_SCHEMA.TABLE_NAME, Schema.DEVICE_TABLE_SCHEMA.FIELDS.USER_ID);
    }
}

export default DeviceDto;
// this fucking line of code just for bypass typescript compiler
Database.bookshelf()["model"](Schema.DEVICE_TABLE_SCHEMA.TABLE_NAME, DeviceDto);
