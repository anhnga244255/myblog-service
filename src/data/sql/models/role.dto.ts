import { BaseDto } from "./base.dto";
import { ROLE_TABLE_SCHEMA } from "../schema";
import { Database } from "../connection";

export class RoleDto extends BaseDto<RoleDto> {
    get tableName(): string {
        return ROLE_TABLE_SCHEMA.TABLE_NAME;
    }
}
export default RoleDto;
Database.bookshelf()["model"]("roles", RoleDto);
