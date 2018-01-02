import { isAuthenticated } from "./../../../../middlewares/index";
import * as express from "express";
import { CategoryHandler } from "./category.handler";
const router = express.Router();

router.route("/")
    .get(CategoryHandler.list)
    .post(CategoryHandler.create);

router.route("/:id")
    .delete(CategoryHandler.delete)
    .put(CategoryHandler.update);

export default router;

