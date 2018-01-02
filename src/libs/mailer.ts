/**
 * Created by phuongho on 15/08/17.
 */
import * as MailGun from "mailgun-js";
import * as Mailgen from "mailgen";
import * as Promise from "bluebird";
import * as _ from "lodash";
import * as fs from "fs";
import * as htmlToText from "html-to-text";
import * as path from "path";
import { EMAIL_TEMPLATE } from "./constants";
import { UserModel } from "../models";
import { Utils } from "./utils";
let templatesDir = path.resolve(__dirname, "..", "resources/email_templates");

interface MailerConf {
    generator: {
        name: string;
        link: string;
        logo: string;
        contactEmail: string;
    };
    mailGun: {
        apiKey: string;
        domain: string;
        sender: string;
    };
}

interface Log {
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}

export class Mailer {
    private generator: Mailgen;
    private client: MailGun;
    private opts: MailerConf;

    constructor(opts: any, private logger?: Log) {
        this.logger = logger || {
            error: (message: string, meta?: any): void => { },
            warn: (message: string, meta?: any): void => { },
            info: (message: string, meta?: any): void => { },
            debug: (message: string, meta?: any): void => { },
        };

        let defaultConf = {
            generator: {
                name: "ventuso",
                link: "ventuso",
                logo: "ventuso",
                iOSAppUrl: "",
                androidAppUrl: "",
                privacyPolicyUrl: "",
                contactEmail: "support@ventuso.net"
            },
            mailGun: {
                apiKey: "ventuso",
                domain: "ventuso.net",
                sender: "support@ventuso.net"
            },
        };

        this.opts = _.defaultsDeep(opts, defaultConf) as MailerConf;

        this.generator = new Mailgen({
            theme: "default",
            product: {
                name: this.opts.generator.name,
                link: this.opts.generator.link,
                logo: this.opts.generator.logo,
            },
        });

        this.client = MailGun({ apiKey: this.opts.mailGun.apiKey, domain: this.opts.mailGun.domain });
    }

    /**
     * @param jsonContent
     * @returns {any}
     */
    public generateHtml(jsonContent) {
        if (jsonContent == null || jsonContent === "") {
            throw new Error("Invalid JSON");
        }
        return this.generator.generate(jsonContent);
    }

    /**
     * @param options
     * @returns {Bluebird}
     */
    public generateCustomHtml(options: any) {
        let defaultData = this.opts.generator;
        let opts = Utils.cleanNull(options.data);
        let data = _.merge(defaultData, opts);
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        return new Promise(function (resolve, reject) {
            fs.readFile(templatesDir + "/" + options.template + ".html", { encoding: "utf8" }, function (err, fileContent) {
                if (err) {
                    reject(err);
                }

                try {
                    // insert user-specific data into the email
                    let template = _.template(fileContent);
                    let htmlContent = template(data);
                    // generate a plain-text version of the same email
                    let textContent = htmlToText.fromString(htmlContent);

                    resolve({
                        html: htmlContent,
                        text: textContent
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * @param toEmail
     * @param title
     * @param jsonContent
     * @returns {any}
     */
    public send(toEmail: string, title: string, jsonContent: any): Promise<any> {
        if (jsonContent == null || jsonContent === "") {
            return Promise.reject(new Error("Invalid JSON"));
        }

        let message = {
            from: this.opts.mailGun.sender,
            to: toEmail,
            subject: title,
            html: this.generator.generate(jsonContent),
        };

        return new Promise((resolve, reject) => {
            this.client.messages().send(message, (err, body) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    }

    /**
     *
     * @param toEmail
     * @param title
     * @param jsonContent
     * @returns {any}
     */
    public sendCustomHtml(toEmail: string, title: string, options: any): Promise<any> {
        return this.generateCustomHtml(options)
            .then((res: any) => {
                let message = {
                    from: options.from ? options.from : this.opts.mailGun.sender,
                    to: toEmail,
                    subject: title,
                    html: res.html,
                };
                return new Promise((resolve, reject) => {
                    this.client.messages().send(message, (err, body) => {
                        if (err != null) {
                            reject(err);
                        } else {
                            resolve(body);
                        }
                    });
                });
            })
            .catch(error => {
                this.logger.error(`Send email to ${toEmail} with error:` + error.message, error);
            });
    }

    /**
     * @param toEmail
     * @param receiverName
     * @param resetLink
     * @returns {Promise<any>}
     */
    // public resetPassword(toEmail, receiverName, resetLink) {
    //     let message = {
    //         body: {
    //             name: receiverName,
    //             intro: "You have received this email because a password reset request for your account was received.",
    //             action: {
    //                 instructions: "Click the button below to reset your password:",
    //                 button: {
    //                     color: "red",
    //                     text: "Reset your password",
    //                     link: resetLink,
    //                 },
    //             },
    //             outro: "If you did not request a password reset, no further action is required on your part.",
    //         },
    //     };
    //
    //     return this.send(toEmail, "Message from iCondo", message);
    // }

    /**
     * @param toEmail
     * @param receiverName
     * @param password
     * @returns {Promise<any>}
     */
    // public sendNewPassword(toEmail, receiverName, password) {
    //     let message = {
    //         body: {
    //             name: receiverName,
    //             intro: "Your new password has been created.",
    //             action: {
    //                 instructions: "Please use this new password to login and change password as soon as possible.",
    //                 button: {
    //                     color: "blue",
    //                     text: password,
    //                 },
    //             },
    //             outro: "Need help, or have questions? Just reply to this email, we\"d love to help.",
    //         },
    //     };
    //
    //     return this.send(toEmail, "Message from iCondo", message);
    // }

    /**
     * @param email
     * @param mobilePhone
     * @param pinCode
     * @returns {Bluebird<U>}
     */
    // public sendPinForTester(email, mobilePhone, pinCode) {
    //     let message = {
    //         body: {
    //             name: "Verify Pin",
    //             intro: `Your pin of mobile phone:`,
    //             action: {
    //                 instructions: `Your pin of mobile phone ${mobilePhone}`,
    //                 button: {
    //                     color: "blue",
    //                     text: pinCode,
    //                 },
    //             },
    //             outro: "Need help, or have questions? Just reply to this email, we\"d love to help.",
    //         },
    //     };
    //
    //     return Promise.resolve()
    //         .then(() => {
    //             return this.send(email, "Message from iCondo", message);
    //         });
    //
    //
    // }

    /**
     * @param toEmail
     * @param intro
     * @returns {Promise<any>}
     */
    // public sendRequestQuote(toEmail, intro) {
    //     let message = {
    //         body: {
    //             name: "Request Quote",
    //             intro: "Send mail request quote",
    //             outro: "Need help, or have questions? Just reply to this email, we\"d love to help.",
    //         },
    //     };
    //
    //     return this.send(toEmail, "Message from iCondo", message);
    // }

    /**
     * send reset message
     * @param userModel
     * @param resetLink
     * @returns {Promise<any>}
     */
    public sendResetPassword(userModel: UserModel, resetLink): Promise<any> {
        return Promise.resolve()
            .then(() => {
                let obj = {
                    template: EMAIL_TEMPLATE.RESET_PASSWORD,
                    data: {
                        resetLink: resetLink,
                    }
                };
                return this.sendCustomHtml(userModel.email, `Reset you password`, obj);
            })
            .catch(error => {
                this.logger.error(`Send mail to ${userModel.email}`, error);
            });
    }

    /**
     * send new password
     * @param userModel
     * @param newPassword
     * @returns {Promise<any>}
     */
    public sendNewPassword(userModel: UserModel, newPassword): Promise<any> {
        return Promise.resolve()
            .then(() => {
                let obj = {
                    template: EMAIL_TEMPLATE.NEW_PASSWORD,
                    data: {
                        name: userModel.firstName,
                        newPassword: newPassword,
                    }
                };
                return this.sendCustomHtml(userModel.email, `NEW password`, obj);
            })
            .catch(error => {
                this.logger.error(`Send mail to ${userModel.email}`, error);
            });
    }
}

export default Mailer;
