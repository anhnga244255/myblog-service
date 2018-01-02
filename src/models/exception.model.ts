/**
 * Created by phuongho on 15/08/17.
 */
import * as trace from "stack-trace";
import { Json, Bookshelf } from "../libs/mapper";
import {ErrorCode, HttpStatus} from "../libs";

export class ExceptionModel implements Error {
    @Json("name")
    public name: string = undefined;

    @Json("stack")
    public stack: any = undefined;

    @Json("message")
    public message: string = undefined;

    @Json("code")
    public code: number = undefined;

    @Json("httpStatus")
    public httpStatus: number = undefined;


    public static fromError(code: number, error: Error, stack?: boolean, httpStatus?: number): ExceptionModel {
        let exception = new ExceptionModel(code, error.message);
        exception.name = "ExceptionModel";
        exception.message = error.message;
        if (stack && error != null) {
            exception.stack = trace.parse(error);
        }
        if (httpStatus != null) {
            exception.httpStatus = httpStatus;
        } else {
            exception.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return exception;
    }

    constructor(code: number, message: string, stack?: boolean, httpStatus?: number) {
        this.name = "ExceptionModel";
        this.code = code;
        this.message = message;
        if (stack) {
            this.stack = trace.parse(<any>new Error());
        }
        if (httpStatus != null) {
            this.httpStatus = httpStatus;
        } else {
            this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    public toString() {
        return `${this.name}: ${this.message}`;
    }
}

export default ExceptionModel;
