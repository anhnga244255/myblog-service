/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";
import { UserCodeHandler } from "./user_code.handler";
import { isAuthenticated, hasPrivilege, hasCache } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/:id")
    .get(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), UserCodeHandler.detail)
    .put(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), UserCodeHandler.edit)
    .delete(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), UserCodeHandler.delete);

router.route("/")
    .get(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), UserCodeHandler.list)
    .post(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), UserCodeHandler.create);

export default router;
