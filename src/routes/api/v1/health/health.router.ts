/**
 * Created by phuongho on 15/08/17.
 */

import { HealthHandler } from "./health.handler";
import * as express from "express";

const router = express.Router();

router.route("/")
    .get(HealthHandler.check);

export default router;
