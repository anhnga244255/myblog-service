import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, PresentationModel, UserCodeModel, UserPackageModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus } from "../libs";
import { PresentationRepository, UserCodeRepository, UserPackageRepository } from "../data";
import { injectable, inject } from "inversify";
/**
 * Created by phuongho on 05/10/17.
 */
@injectable()
export class PresentationService extends BaseService<PresentationModel, PresentationRepository> {
    constructor(private userCode: UserCodeRepository,
        private userPackage: UserPackageRepository,
        repo: PresentationRepository,
        @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<PresentationModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param Presentation
     * @param related
     * @param filters
     */
    public create(obj: PresentationModel, related = [], filters = []): Promise<PresentationModel> {
        let ret: any;
        let userCode: UserCodeModel;
        let userPackage: any;
        let conditions: any = {};
        conditions[Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.TITLE] = obj.title;
        conditions[Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID] = obj.userId;
        conditions[Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.IS_DELETED] = false;

        return this.repo.findOneByAtribute({ conditions: conditions })
            .then((object) => {
                if (object != null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.DUPLICATE_RESOURCE.CODE,
                        ErrorCode.RESOURCE.DUPLICATE_RESOURCE.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST,
                    ));
                }
                return this.userPackage.getInfoByUserId(obj.userId);
            })
            .then(object => {
                if (object == null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.CONTRACT_NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.CONTRACT_NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST,
                    ));
                } else {
                    userPackage = object;
                }
                return this.repo.countByQuery(q => {
                    q.where(Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID, obj.userId);
                });
            })
            .then(totalFile => {
                if (userPackage) {
                    if (totalFile >= userPackage.numberFile) {
                        return Promise.reject(new ExceptionModel(
                            ErrorCode.RESOURCE.MAXIMUM_CREATE_PRENSENTAION.CODE,
                            ErrorCode.RESOURCE.MAXIMUM_CREATE_PRENSENTAION.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST,
                        ));
                    }
                }
                return this.userCode.findByCode(obj.userCode);
            })
            .then((object) => {
                if (object == null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.USER_CODE_NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.USER_CODE_NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST,
                    ));
                }
                userCode = object;
                return this.insert(obj);
            })
            .then(object => {
                ret = object;
                let userCodeModel = new UserCodeModel();
                userCodeModel.id = userCode.id;
                userCodeModel.isUsed = true;
                return this.userCode.update(userCodeModel);
            })
            .then(object => {
                return ret;
            });
    }
}

export default PresentationService;
