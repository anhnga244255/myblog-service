/**
 * Created by Anh Nga on 13/10/2017.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, ArticlesModel } from "./../models";
import { ARTICLES_TABLE_SCHEMA } from "./sql/schema";
import { ArticlesDto } from "./sql/models";
import { injectable, inject } from "inversify";

@injectable()
export class ArticlesRepository extends BaseRepository<ArticlesDto, ArticlesModel> {
    constructor( @inject("Logger") log?: Log) {
        super(ArticlesDto, ArticlesModel, log);
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
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<ArticlesModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.where(`${Schema.ARTICLES_TABLE_SCHEMA.TABLE_NAME}.${Schema.ARTICLES_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.ARTICLES_TABLE_SCHEMA.TABLE_NAME}.${Schema.ARTICLES_TABLE_SCHEMA.FIELDS.TITLE}`, "ILIKE", `%${keyword}%`);
                    });
                }
                let orderBy = searchParams.orderBy || `${Schema.ARTICLES_TABLE_SCHEMA.TABLE_NAME}.${Schema.ARTICLES_TABLE_SCHEMA.FIELDS.ID}`;
                let orderType = searchParams.orderType || "DESC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default ArticlesRepository;
