import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class PackageDto extends BaseDto<PackageDto> {
    get tableName(): string {
        return Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME;
    }
}

export default PackageDto;
Database.bookshelf()["model"](Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME, PackageDto);
