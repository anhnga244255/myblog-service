/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { CollectionWrap, PackageModel } from "./../models";
import { PACKAGE_TABLE_SCHEMA } from "./sql/schema";
import { PackageDto } from "./sql/models";
import { injectable, inject } from "inversify";

@injectable()
export class PackageRepository extends BaseRepository<PackageDto, PackageModel> {
    constructor( @inject("Logger") log?: Log) {
        super(PackageDto, PackageModel, log);
    }

    /**
    * search Package
    * @param searchParams
    * @param offset
    * @param limit
    * @param related
    * @param filters
    * @returns {Promise<any[]>}
    */
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Promise<CollectionWrap<PackageModel>> {
        let keyword = searchParams.key || null;
        limit = limit || null;
        offset = offset || null;

        let query = () => {
            return (q): void => {
                q.where(`${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.PACKAGE_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
                if (searchParams.key) {
                    q.where(q1 => {
                        q1.where(`${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.PACKAGE_TABLE_SCHEMA.FIELDS.NAME}`, "ILIKE", `%${keyword}%`);
                    });
                }
                let orderBy = searchParams.orderBy || `${Schema.PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.PACKAGE_TABLE_SCHEMA.FIELDS.PRIORITY}`;
                let orderType = searchParams.orderType || "ASC";
                q.orderBy(orderBy, orderType);
            };
        };
        return this.queryByPage(query(), offset, limit, related, filters);
    }

}
export default PackageRepository;
