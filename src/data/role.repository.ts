/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, RoleModel } from "./../models";
import { ROLE } from "./../libs/constants";
import { RoleDto } from "./sql/models";
import { injectable, inject } from "inversify";

@injectable()
export class RoleRepository extends BaseRepository<RoleDto, RoleModel> {
    constructor( @inject("Logger") log?: Log) {
        super(RoleDto, RoleModel, log);
    }

    /**
    * search role
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<RoleModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.where(`${Schema.ROLE_TABLE_SCHEMA.TABLE_NAME}.${Schema.ROLE_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.ROLE_TABLE_SCHEMA.TABLE_NAME}.${Schema.ROLE_TABLE_SCHEMA.FIELDS.NAME}`, "ILIKE", `%${keyword}%`);
                    });
                }
                if (searchParams.roleId === ROLE.MANAGER) {
                    q.whereNotIn(`${Schema.ROLE_TABLE_SCHEMA.TABLE_NAME}.${Schema.ROLE_TABLE_SCHEMA.FIELDS.ID}`, [ROLE.SYSTEM_ADMIN, ROLE.MANAGER]);
                }
                if (searchParams.roleId === ROLE.COMPANY_ADMIN) {
                    q.whereNotIn(`${Schema.ROLE_TABLE_SCHEMA.TABLE_NAME}.${Schema.ROLE_TABLE_SCHEMA.FIELDS.ID}`, [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]);
                }
                let orderBy = searchParams.orderBy || `${Schema.ROLE_TABLE_SCHEMA.TABLE_NAME}.${Schema.ROLE_TABLE_SCHEMA.FIELDS.CREATED_DATE}`;
                let orderType = searchParams.orderType || "DESC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default RoleRepository;
