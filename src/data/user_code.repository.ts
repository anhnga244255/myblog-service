import { Log } from "./../libs/logger";
import { USER_CODE_TABLE_SCHEMA } from "./sql/schema";
import { CollectionWrap } from "./../models/collections";
import { BaseRepository } from "./base.repository";
import { UserCodeDto } from "./sql/models";
import { UserCodeModel } from "../models";
import * as Schema from "../data/sql/schema";
import * as Promise from "bluebird";
import { injectable, inject } from "inversify";

@injectable()
export class UserCodeRepository extends BaseRepository<UserCodeDto, UserCodeModel> {
    constructor( @inject("Logger") log?: Log) {
        super(UserCodeDto, UserCodeModel, log);
    }

    /**
    * search UserCode
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<UserCodeModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.where(`${Schema.USER_CODE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_CODE_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.USER_CODE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_CODE_TABLE_SCHEMA.FIELDS.NAME}`, "ILIKE", `%${keyword}%`);
                    });
                }
                if (searchParams.userId) {
                    q.where(`${Schema.USER_CODE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_CODE_TABLE_SCHEMA.FIELDS.USER_ID}`, searchParams.userId);
                }
                if (searchParams.isUsed) {
                    q.where(`${Schema.USER_CODE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_CODE_TABLE_SCHEMA.FIELDS.IS_USED}`, searchParams.isUsed);
                }
                let orderBy = searchParams.orderBy || `${Schema.USER_CODE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_CODE_TABLE_SCHEMA.FIELDS.CREATED_DATE}`;
                let orderType = searchParams.orderType || "DESC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

    /**
     *
     * @param code
     * @param related
     * @param filters
     */
    public findByCode(code: string, related = [], filters = []): Promise<UserCodeModel> {
        let conditions: any = {};
        conditions[Schema.USER_CODE_TABLE_SCHEMA.FIELDS.CODE] = code;
        conditions[Schema.USER_CODE_TABLE_SCHEMA.FIELDS.IS_DELETED] = false;
        conditions[Schema.USER_CODE_TABLE_SCHEMA.FIELDS.IS_USED] = false;

        return this.findOneByAtribute({ conditions: conditions });
    }

}
export default UserCodeRepository;
