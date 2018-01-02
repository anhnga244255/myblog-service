/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";
import { UserHandler } from "./users.handler";
import { isAuthenticated, hasPrivilege, hasCache } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/logout")
    .post(isAuthenticated, UserHandler.logout);

router.route("/forgotpassword")
    .post(UserHandler.forgotPassword);

router.route("/forgotpassword/:token")
    .get(UserHandler.resetPassword);

router.route("/:id")
    .get(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN, ROLE.OPERATOR]), UserHandler.detail)
    .put(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN, ROLE.OPERATOR]), UserHandler.edit)
    .delete(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN, ROLE.OPERATOR]), UserHandler.delete);

router.route("/")
    .get(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN, ROLE.OPERATOR]), UserHandler.list)
    .post(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN, ROLE.OPERATOR]), UserHandler.create);

export default router;
