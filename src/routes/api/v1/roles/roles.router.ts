/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";
import { RoleHandler } from "./roles.handler";
import { isAuthenticated, hasPrivilege, hasCache } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/:id")
    .get(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), RoleHandler.detail)
    .put(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), RoleHandler.edit)
    .delete(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), RoleHandler.delete);

router.route("/")
    .get(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), RoleHandler.list)
    .post(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), RoleHandler.create);

export default router;
