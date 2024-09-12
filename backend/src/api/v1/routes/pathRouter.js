import { Router } from "express";
import {
  createPathHandler,
  getAllPathsHandler,
  updatePathHandler,
  deletePathHandler,
  addLocationToPathHandler,
  getOnePathWithLocationsHandler,
  removeLocationFromPathHandler,
} from "../controllers/pathController.js";
import authCheck from "../../middleware/authCheck.js";

const pathRouter = Router();

// Verify JWT token and make userId available in in the request object
pathRouter.use(authCheck);

// Define routes for the path resource
pathRouter.post("/", createPathHandler);
pathRouter.get("/", getAllPathsHandler);
pathRouter.put("/:pathId", updatePathHandler);
pathRouter.delete("/:pathId", deletePathHandler);

// Define routes for interacting with locations in a path
pathRouter.post("/:pathId/locations", addLocationToPathHandler);
pathRouter.get("/:pathId/locations", getOnePathWithLocationsHandler);
pathRouter.patch("/:pathId/locations", removeLocationFromPathHandler);

export default pathRouter;
