import { BaseRepository, Log } from "./base.repository";
import { UserDto } from "./sql/models";
import { UserModel, CollectionWrap } from "../models";
import * as Schema from "../data/sql/schema";
import * as Promise from "bluebird";
import { DELETE_STATUS, ROLE } from "../libs/constants";
import { injectable, inject } from "inversify";

@injectable()
export class UserRepository extends BaseRepository<UserDto, UserModel> {
    constructor( @inject("Logger") log?: Log) {
        super(UserDto, UserModel, log);
    }

    /**
     *
     * @param email
     * @param related
     * @param filters
     * @returns {Promise<any[]>}
     */
    public findByEmail(email: string, related = [], filters = []): Promise<UserModel> {
        return this.findOneByQuery(q => {
            q.where(Schema.USER_TABLE_SCHEMA.FIELDS.EMAIL, email);
            q.where(Schema.USER_TABLE_SCHEMA.FIELDS.IS_DELETED, DELETE_STATUS.NO);
        }, related, filters);
    }

    /**
     * search User
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     * @returns {Promise<any[]>}
     */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<UserModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.where(`${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.tags) {
                    let tags = searchParams.tags.split(",");
                    q.leftJoin(`${Schema.USER_TAG_TABLE_SCHEMA.TABLE_NAME}`, `${Schema.USER_TAG_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TAG_TABLE_SCHEMA.FIELDS.USER_ID}`, `${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.ID}`);
                    q.whereIn(Schema.USER_TAG_TABLE_SCHEMA.FIELDS.TAG_ID, tags);
                }
                if (searchParams.parentId) {
                    q.where(`${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.PARENT_ID}`, searchParams.parentId);
                }
                if (searchParams.currentUserId) {
                    q.where(`${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.ID}`, "!=", searchParams.currentUserId);
                }
                if (searchParams.roleId) {
                    q.where(Schema.USER_TABLE_SCHEMA.FIELDS.ROLE_ID, searchParams.roleId);
                }
                if (searchParams.country) {
                    q.where(Schema.USER_TABLE_SCHEMA.FIELDS.COUNTRY, "ILIKE", searchParams.country);
                }
                if (searchParams.state) {
                    q.where(Schema.USER_TABLE_SCHEMA.FIELDS.STATE, "ILIKE", searchParams.state);
                }
                if (searchParams.province) {
                    q.where(Schema.USER_TABLE_SCHEMA.FIELDS.PROVINCE, "ILIKE", searchParams.province);
                }

                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.FIRST_NAME}`, "ILIKE", `%${keyword}%`);
                        q1.where(`${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.LAST_NAME}`, "ILIKE", `%${keyword}%`);
                        q1.orWhere(`${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.EMAIL}`, "ILIKE", `%${keyword}%`);
                    });
                }
                let orderBy = searchParams.orderBy || `${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.FIRST_NAME}`;
                let orderType = searchParams.orderType || "ASC";
                q.orderByRaw(`lower(${orderBy}) ${orderType}`);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default UserRepository;
