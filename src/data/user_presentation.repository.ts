/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, UserPresentationModel } from "./../models";
import { USER_PRESENTATION_TABLE_SCHEMA } from "./sql/schema";
import { UserPresentationDto } from "./sql/models";
import { injectable, inject } from "inversify";

@injectable()
export class UserPresentationRepository extends BaseRepository<UserPresentationDto, UserPresentationModel> {
    constructor( @inject("Logger") log?: Log) {
        super(UserPresentationDto, UserPresentationModel, log);
    }

    /**
    * search UserPresentation
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<UserPresentationModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.leftJoin(`${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}`, `${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID}`, `${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.ID}`);
                q.where(`${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.TITLE}`, "ILIKE", `%${keyword}%`);
                    });
                }
                if (searchParams.userId) {
                    q.where(`${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID}`, searchParams.userId);
                }
                let orderBy = searchParams.orderBy || `${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.PRIORITY}`;
                let orderType = searchParams.orderType || "ASC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default UserPresentationRepository;
