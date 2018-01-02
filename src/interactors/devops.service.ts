import { platform } from "os";
import * as Bluebird from "bluebird";
import { injectable, inject } from "inversify";
import { BaseService, Log } from "./base.service";
import { ApplicationRepository } from "../data";
import { ApplicationModel, CollectionWrap } from "../models";
import { QueryBuilder } from "knex";
import * as Schema from "../data/sql/schema";

@injectable()
export class DevOpsService extends BaseService<ApplicationModel, ApplicationRepository> {
    constructor(repo: ApplicationRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }

    public listAppVersion(params: any, offset?: number, limit?: number, related = [], filters = []): Bluebird<CollectionWrap<ApplicationModel>> {
        let query = () => {
            return (q: QueryBuilder): void => {
                if (params.platform) {
                    q.where(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.PLATFORM, params.platform);
                }
                if (params.version) {
                    q.where(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.VERSION, params.version);
                }
                q.orderBy(`${Schema.APPLICATION_TABLE_SCHEMA.FIELDS.VERSION}`, "DESC");
            };
        };
        return this.repo.queryByPage(query(), offset, limit, ["isDeleted", "isEnable", "createdDate", "updatedDate"]);
    }

    public findAppVersion(platform: string, version: number): Bluebird<ApplicationModel> {
        return this.repo.findOneByQuery(q => {
            q.where(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.PLATFORM, platform);
            q.where(Schema.APPLICATION_TABLE_SCHEMA.FIELDS.VERSION, version);
        });
    }
}
