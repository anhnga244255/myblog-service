/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as _ from "lodash";
import * as Twilio from "twilio";

export interface SMSOption {
    accountSid: string;
    area?: string;
    authToken: string;
    force?: boolean;
    sandbox?: boolean;
    sendEmail?: boolean;
    sender: string;
}

interface Log {
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}

export interface Exception {
    code: number;
    status: number;
    message: string;
    more_info: string;
}

export interface Response {
    sid: string;
    account_sid: string;
    friendly_name: string;
    phone_number: string;
    date_created: string;
    date_updated: string;
    uri: string;
}

export interface Carrier {
    error_code: number;
    type: string;
    name: string;
    mobile_network_code: string;
    mobile_country_code: string;
}

export interface LookupResponse {
    url: string;
    carrier: Carrier;
    national_format: string;
    phone_number: string;
    country_code: string;
}

export interface ErrorHandle {
    (error: Exception): any;
}

export interface SuccessHandle {
    (response: Response | LookupResponse): any;
}

declare module "twilio" {
    export interface RestClient extends Client {
        lookups: Twilio.LookupsClient;
    }
}

export class SMS {
    private opts: SMSOption;
    private sendClient: Twilio.RestClient;
    private lookupsClient: Twilio.LookupsClient;
    private errorHandle: ErrorHandle;
    private successHandle: SuccessHandle;

    constructor(opts: any = {}, success?: SuccessHandle, error?: ErrorHandle, private logger?: Log) {
        let defaultOpts: SMSOption = {
            accountSid: "AC_ventuso",
            authToken: "ventuso",
            sender: "ventuso",
        };

        this.opts = _.defaultsDeep(opts, defaultOpts) as SMSOption;
        this.sendClient = Twilio(this.opts.accountSid, this.opts.authToken);
        this.lookupsClient = this.sendClient.lookups;

        this.logger = logger || {
            error: (message: string, meta?: any): void => { },
            warn: (message: string, meta?: any): void => { },
            info: (message: string, meta?: any): void => { },
            debug: (message: string, meta?: any): void => { },
        };
        this.successHandle = success != null ? success : (response: Response | LookupResponse): any => {
            return response;
        };
        this.errorHandle = error != null ? error : (error: Exception): any => {
            return error;
        };
    }

    /**
     *
     * @param phoneNumber
     * @param message
     * @returns {Promise<T>|Bluebird<R>|Bluebird<R|U>}
     */
    public send(area: string, phoneNumber: string, message: string): Promise<Response> {
        try {

            return new Promise<Response>((resolve, reject) => {
                this.sendClient.messages.create({
                    to: area + phoneNumber,
                    from: this.opts.sender,
                    body: message,
                }, (err: Exception, message: Response) => {
                    if (err != null) {
                        return reject(this.errorHandle(err));
                    }
                    return resolve(message);
                });

            });
        } catch (error) {
            this.logger.error(error.message, error);
        }
    }

    /**
     *
     * @param phoneNumber
     * @returns {undefined}
     */
    public verifyPhoneNumber(area: string, phoneNumber: string): Promise<LookupResponse> {
        try {
            if (area === "") {
                area = this.opts.area;
            }
            if (this.opts.sandbox === true) {
                area = this.opts.area;
            }
            return new Promise<LookupResponse>((resolve, reject) => {
                this.lookupsClient.phoneNumbers(area + phoneNumber).get((err: Exception, phoneNumber: LookupResponse) => {
                    if (err != null) {
                        return reject(this.errorHandle(err));
                    }
                    return resolve(phoneNumber);
                });
            });

        } catch (error) {
            this.logger.error(error.message, error);
        }
    }
}

export default SMS;
