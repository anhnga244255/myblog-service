import { BaseDto } from "./base.dto";
import { SESSION_TABLE_SCHEMA , USER_TABLE_SCHEMA} from "./../schema";
import { Database } from "../connection";

export class SessionDto extends BaseDto<SessionDto> {
    get tableName(): string {
        return SESSION_TABLE_SCHEMA.TABLE_NAME;
    }

    public user(): any {
        return this.belongsTo(USER_TABLE_SCHEMA.TABLE_NAME, SESSION_TABLE_SCHEMA.FIELDS.USER_ID);
    }
}

export default SessionDto;
Database.bookshelf()["model"](SESSION_TABLE_SCHEMA.TABLE_NAME, SessionDto);
