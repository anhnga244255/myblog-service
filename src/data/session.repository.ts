/**
 * Created by phuongho on 15/08/17.
 */
import { BaseRepository, Log } from "./base.repository";
import { SessionDto } from "./sql/models";
import { SessionModel } from "../models";
import { injectable, inject } from "inversify";

@injectable()
export class SessionRepository extends BaseRepository<SessionDto, SessionModel> {
    constructor( @inject("Logger") log?: Log) {
        super(SessionDto, SessionModel, log);
    }
}
export default SessionRepository;

