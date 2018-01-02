/**
 * Created by Anh Nga on 13/10/2017.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, LanguageModel } from "./../models";
import { LANGUAGE_TABLE_SCHEMA } from "./sql/schema";
import { LanguageDto } from "./sql/models";
import { injectable, inject } from "inversify";

@injectable()
export class LanguageRepository extends BaseRepository<LanguageDto, LanguageModel> {
    constructor( @inject("Logger") log?: Log) {
        super(LanguageDto, LanguageModel, log);
    }

    /**
    * search language
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<LanguageModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.where(`${Schema.LANGUAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.LANGUAGE_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.LANGUAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.LANGUAGE_TABLE_SCHEMA.FIELDS.NAME}`, "ILIKE", `%${keyword}%`);
                    });
                }
                let orderBy = searchParams.orderBy || `${Schema.LANGUAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.LANGUAGE_TABLE_SCHEMA.FIELDS.PRIORITY}`;
                let orderType = searchParams.orderType || "DESC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default LanguageRepository;
