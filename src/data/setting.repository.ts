/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, SettingModel } from "./../models";
import { SETTING_TABLE_SCHEMA } from "./sql/schema";
import { SettingDto } from "./sql/models";
import { injectable, inject } from "inversify";

@injectable()
export class SettingRepository extends BaseRepository<SettingDto, SettingModel> {
    constructor( @inject("Logger") log?: Log) {
        super(SettingDto, SettingModel, log);
    }

    /**
    * search Setting
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<SettingModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.where(`${Schema.SETTING_TABLE_SCHEMA.TABLE_NAME}.${Schema.SETTING_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.SETTING_TABLE_SCHEMA.TABLE_NAME}.${Schema.SETTING_TABLE_SCHEMA.FIELDS.KEYWORD}`, "ILIKE", `%${keyword}%`);
                    });
                }
                let orderBy = searchParams.orderBy || `${Schema.SETTING_TABLE_SCHEMA.TABLE_NAME}.${Schema.SETTING_TABLE_SCHEMA.FIELDS.CREATED_DATE}`;
                let orderType = searchParams.orderType || "DESC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default SettingRepository;
