/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, TagModel } from "./../models";
import { TAG_TABLE_SCHEMA } from "./sql/schema";
import { TagDto } from "./sql/models";
import { injectable, inject } from "inversify";

@injectable()
export class TagRepository extends BaseRepository<TagDto, TagModel> {
    constructor( @inject("Logger") log?: Log) {
        super(TagDto, TagModel, log);
    }

    /**
    * search Tag
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<TagModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.where(`${Schema.TAG_TABLE_SCHEMA.TABLE_NAME}.${Schema.TAG_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.TAG_TABLE_SCHEMA.TABLE_NAME}.${Schema.TAG_TABLE_SCHEMA.FIELDS.NAME}`, "ILIKE", `%${keyword}%`);
                    });
                }
                if (searchParams.userId) {
                    q.where(`${Schema.TAG_TABLE_SCHEMA.TABLE_NAME}.${Schema.TAG_TABLE_SCHEMA.FIELDS.USER_ID}`, searchParams.userId);
                }
                let orderBy = searchParams.orderBy || `${Schema.TAG_TABLE_SCHEMA.TABLE_NAME}.${Schema.TAG_TABLE_SCHEMA.FIELDS.CREATED_DATE}`;
                let orderType = searchParams.orderType || "DESC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default TagRepository;
