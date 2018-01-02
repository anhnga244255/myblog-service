/**
 * Created by phuongho on 05/10/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, AssignPresentationModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus, Logger } from "../libs";
import { PresentationRepository, UserPresentationRepository, AssignPresentationRepository } from "./../data";
import { UserPresentationModel } from "./../models";
import { injectable, inject } from "inversify";

@injectable()
export class AssignPresentationService extends BaseService<AssignPresentationModel, AssignPresentationRepository> {
    constructor(private userPresent: UserPresentationRepository,
        private present: PresentationRepository,
        repo: AssignPresentationRepository,
        @inject("Logger") logger?: Log) {
        super(repo, logger);
    }

    /**
     * Invoke default repository
     * @param data
     * @param related
     * @param filters
     */
    public create<T>(data: AssignPresentationModel, related: string[] = [], filters: string[] = []): Promise<AssignPresentationModel> {
        return this.present.findById(data.presentationId)
            .then(object => {
                if (object === null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.NOT_FOUND,
                    ));
                }
                return this.repo.deleteByQuery(q => {
                    q.where(Schema.ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID, data.presentationId);
                });
            })
            .then(() => {
                return this.insert(data);
            })
            .tap(() => {
                return this.userPresent.deleteByQuery(q => {
                    q.where(Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID, data.presentationId);
                });
            })
            .tap((object) => {
                if (data.users) {
                    data.users.forEach(userId => {
                        let model = new UserPresentationModel();
                        model.userId = userId;
                        model.presentationId = data.presentationId;
                        this.userPresent.insert(model);
                    });
                }
            });
    }
    /**
     *
     * @param presentationId
     * @param related
     * @param filters
     */
    public detailByPresentaionId(presentationId: string, related: string[] = [], filters: string[] = []): Promise<AssignPresentationModel> {
        return this.repo.findOneByQuery(q => {
            q.where(Schema.ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID, presentationId);
        }, related, filters);
    }
}

export default AssignPresentationService;
