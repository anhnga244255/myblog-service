import { BaseService, Log } from "./base.service";
import { Utils } from "../libs";
import { injectable , inject} from "inversify";

@injectable()
export class TemplateService extends BaseService<any, any> {
    constructor(@inject("Logger") log?: Log) {
        super(null, log);
    }
}

export default TemplateService;
