import { Router } from "express";
import {
  createOrUpdateLocationHandler,
  getAllLocationsHandler,
  getOneLocationHandler,
  deleteLocationHandler,
} from "../controllers/locationController.js";
import authCheck from "../../middleware/authCheck.js";

const locationRouter = Router();

// Verify JWT token and make userId available in in the request object
locationRouter.use(authCheck);

// Define routes for the location resource
locationRouter.post("/", createOrUpdateLocationHandler);
locationRouter.get("/", getAllLocationsHandler);
locationRouter.get("/:locationId", getOneLocationHandler);
locationRouter.delete("/:locationId", deleteLocationHandler);

export default locationRouter;
