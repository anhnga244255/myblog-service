/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, UserPackageModel } from "./../models";
import { USER_PACKAGE_TABLE_SCHEMA } from "./sql/schema";
import { UserPackageDto } from "./sql/models";
import { injectable, inject } from "inversify";

@injectable()
export class UserPackageRepository extends BaseRepository<UserPackageDto, UserPackageModel> {
    constructor( @inject("Logger") log?: Log) {
        super(UserPackageDto, UserPackageModel, log);
    }

    /**
    * search UserPackage
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<UserPackageModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.leftJoin(`${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME}`, `${Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.PACKAGE_ID}`, `${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.PACKAGE_TABLE_SCHEMA.FIELDS.ID}`);
                q.where(`${Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.PACKAGE_TABLE_SCHEMA.FIELDS.NAME}`, "ILIKE", `%${keyword}%`);
                    });
                }
                if (searchParams.userId) {
                    q.where(`${Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.USER_ID}`, searchParams.userId);
                }
                let orderBy = searchParams.orderBy || `${Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.CREATED_DATE}`;
                let orderType = searchParams.orderType || "DESC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

    /**
    *
    * @param userId
    */
    public getInfoByUserId(userId: string): Promise<{ numberFile: number, numberAccount: number }> {
        let ret: any = null;
        let numberFile: number = 0;
        let numberAccount: number = 0;

        return this.findByQuery(q => {
            q.where(Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.IS_DELETED, false);
            q.where(Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.USER_ID, userId);
        })
            .then(objects => {
                if (objects) {
                    objects.forEach(item => {
                        numberFile += item.numberFile;
                        numberAccount += item.numberAccount;
                    });
                    ret = {};
                    ret.numberFile = numberFile;
                    ret.numberAccount = numberAccount;
                }
                return ret;
            });
    }

}
export default UserPackageRepository;
