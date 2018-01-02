import { isAuthenticated } from "./../../../../middlewares/index";
import * as express from "express";
import { ArticlesHandler } from "./articles.handler";
const router = express.Router();

router.route("/")
    .get(ArticlesHandler.list)
    .post(ArticlesHandler.create);

router.route("/:id")
    .delete(ArticlesHandler.delete)
    .put(ArticlesHandler.update);

export default router;

