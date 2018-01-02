/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, PresentationModel } from "./../models";
import { PRESENTATION_TABLE_SCHEMA } from "./sql/schema";
import { PresentationDto } from "./sql/models";
import { ROLE } from "./../libs/constants";
import { injectable, inject } from "inversify";

@injectable()
export class PresentationRepository extends BaseRepository<PresentationDto, PresentationModel> {
    constructor( @inject("Logger") log?: Log) {
        super(PresentationDto, PresentationModel, log);
    }

    /**
    * search Presentation
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<PresentationModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                if (searchParams.roleId === ROLE.PRESENTER) {
                    q.leftJoin(`${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME}`, `${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID}`, `${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.ID}`);
                    q.where(`${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                    q.where(`${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID}`, searchParams.userId);
                } else {
                    if (searchParams.userId) {
                        q.where(`${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID}`, searchParams.userId);
                    }
                }
                q.where(`${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.TITLE}`, "ILIKE", `%${keyword}%`);
                    });
                }
                let orderBy = searchParams.orderBy || `${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.PRIORITY}`;
                let orderType = searchParams.orderType || "ASC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default PresentationRepository;
