import { getOnePathWithLocations } from "./pathLocationService.js";
import { updatePath } from "./pathService.js";
import { BadRequestError, ExternalServiceError } from "../../utils/errors.js";
import axios from "axios";

class OptimizedPath {
  static async init(userId, pathId) {
    // Get the path with locations
    const path = await getOnePathWithLocations(userId, pathId);

    const optiPath = new OptimizedPath(path);

    optiPath.parseLocations();

    optiPath.validateLocations();

    optiPath.prepareApiRequest();

    await optiPath.fetchGoogleRouteData();

    return optiPath;
  }

  static GOOGLE_ROUTES_REQ_BODY = {
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false,
    },
    languageCode: "en-US",
    units: "IMPERIAL",
  };

  static GOOGLE_ROUTES_REQ_HEADERS = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
  };

  static GOOGLE_ROUTES_API_URL =
    "https://routes.googleapis.com/directions/v2:computeRoutes";

  constructor(path) {
    this.user_id = path.user_id;
    this.id = path.id;
    this.name = path.name;
    this.locations = path.locations;
    this.origin = null;
    this.destination = null;
    this.waypoints = [];
    this.uniqueLocationIds = new Set();
    this.reqBody = { ...OptimizedPath.GOOGLE_ROUTES_REQ_BODY };
    this.reqHeaders = { ...OptimizedPath.GOOGLE_ROUTES_REQ_HEADERS };
  }

  /*
   * Initializes the origin, destination, waypoints, and uniqueIds properties
   * ensures that the path has at leas
   * @argument {void}
   * @returns {void}
   */
  parseLocations() {
    // Categorize locations and add unique location IDs to a Set
    this.locations.forEach((location) => {
      if (location.position === "origin") {
        this.origin = location;
      } else if (location.position === "destination") {
        this.destination = location;
      } else {
        this.waypoints.push(location);
      }

      this.uniqueLocationIds.add(location.id);
    });

    // Convert the uniqueLocations Set to an Array
    this.uniqueLocationIds = Array.from(this.uniqueLocationIds);
  }

  /**
   * Validates that the path has an origin, destination, and at least two unique
   * locations.
   * @argument {void}
   * @throws {BadRequestError} - An error if the path locations are invalid.
   * @returns {void}
   */
  validateLocations() {
    const validationErrors = [];

    if (!this.origin) {
      validationErrors.push("Path must have an origin location");
    }

    if (!this.destination) {
      validationErrors.push("Path must have a destination location");
    }

    if (this.uniqueLocationIds.length < 2) {
      validationErrors.push("Path must have at least two unique locations");
    }

    if (validationErrors.length > 0) {
      throw new BadRequestError(validationErrors.join("\n"));
    }
  }

  /**
   * Prepares the reqBody and reqHeaders properties for sending a request to the
   * Google Maps Routes API.
   * @argument {void}
   * @returns {void}
   */
  async prepareApiRequest() {
    // Format and add origin and destination request body
    this.reqBody.origin = { placeId: this.origin.google_place_id };
    this.reqBody.destination = { placeId: this.destination.google_place_id };

    if (this.waypoints.length > 0) {
      // Format and add intermediate waypoints to the request body
      this.reqBody.intermediates = this.waypoints.map(({ google_place_id }) => {
        return { placeId: google_place_id };
      });
    }

    if (this.waypoints.length > 1) {
      // Optimize the order of the waypoints
      this.reqBody.optimizeWaypointOrder = true;

      // Update request headers to include the optimized_intermediate_waypoint_index field
      this.reqHeaders["X-Goog-FieldMask"] +=
        ",routes.optimized_intermediate_waypoint_index";
    }
  }

  /**
   * Sends a request to the Google Maps Routes API to optimize the path order.
   * @argument {void}
   * @returns {void}
   */
  async fetchGoogleRouteData() {
    try {
      const response = await axios.post(
        OptimizedPath.GOOGLE_ROUTES_API_URL,
        this.reqBody,
        { headers: this.reqHeaders }
      );

      this.apiResponse = response.data;
    } catch (error) {
      console.error("Error sending google routes API request:", error);
      throw new ExternalServiceError("Error connecting to external service");
    }
  }
}

export default OptimizedPath.init;
