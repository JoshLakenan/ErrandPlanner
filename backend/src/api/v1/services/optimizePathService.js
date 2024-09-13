import { getOnePathWithLocations } from "./pathLocationService.js";
import { updatePath } from "./pathService.js";
import { BadRequestError, ExternalServiceError } from "../../utils/errors.js";
import { redisClient } from "./redisService.js";
import axios from "axios";

/**
 * Represents a service for calculating and optimizing paths.
 * @class
 */
class OptimizedPath {
  /**
   * Calculates the optimized path data for a given path, updates the path with
   * the optimized data, and returns the updated path.
   * @param {number} userId - The ID of the user.
   * @param {number} pathId - The ID of the path.
   * @param {object} axiosInstance - An Axios instance for making HTTP requests.
   * @param {object} redis - A Redis client for caching data.
   * @returns {object} - The updated path object with the optimized path data.
   */
  static async calculateOptimizedPath(
    userId,
    pathId,
    axiosInstance = axios,
    redis = redisClient
  ) {
    const path = await getOnePathWithLocations(userId, pathId);

    const optiPath = new OptimizedPath(path, axiosInstance);

    optiPath.parseLocations();

    optiPath.validateLocations();

    optiPath.generateRedisKey();

    // Check if the optimized path data is cached in Redis
    const cachedPath = await redis.get(optiPath.redisKey);

    if (cachedPath) {
      return JSON.parse(cachedPath);
    }

    optiPath.prepareApiRequest();

    await optiPath.fetchGoogleRouteData();

    optiPath.validateApiResponse();

    optiPath.parseApiResponse();

    optiPath.reArrangeWaypoints();

    optiPath.generateDirectionsUrl();

    // Update the path with optemized path data
    const updatedPath = await updatePath(userId, pathId, {
      directions_url: optiPath.directionsUrl,
      drive_time_seconds: optiPath.driveTimeSeconds,
      distance_meters: optiPath.distanceMeters,
      url_generated_at: optiPath.urlGeneratedAt,
    });

    // Cache the optimized path data in Redis for 60 seconds
    await redis.set(optiPath.redisKey, JSON.stringify(updatedPath), {
      EX: process.env.REDIS_KEY_TTL,
    });

    return updatedPath;
  }

  /**
   * Generates a Redis key for the optimized path based on the path ID and user ID.
   * @argument {void}
   * @returns {void}
   */
  generateRedisKey() {
    // Collect components of the path / user / location data
    let keyComponents = [
      String(this.pathId),
      String(this.userId),
      this.origin.google_place_id,
      this.destination.google_place_id,
    ];

    this.waypoints.forEach((waypoint) => {
      keyComponents.push(waypoint.google_place_id);
    });

    this.redisKey = keyComponents.join(":");
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

  static GOOGLE_DIRECTIONS_BASE_URL = "https://www.google.com/maps/dir/?api=1";

  constructor(path, axiosInstance = axios) {
    this.pathId = path.id;
    this.userId = path.user_id;
    this.axiosInstance = axiosInstance;
    this.locations = path.locations;
    this.origin = null;
    this.destination = null;
    this.redisKey = "";
    this.waypoints = [];
    this.optimizedWaypoints = [];
    this.uniqueLocationIds = new Set();
    this.urlComponents = [OptimizedPath.GOOGLE_DIRECTIONS_BASE_URL];
    this.directionsUrl = null;
    this.reqBody = { ...OptimizedPath.GOOGLE_ROUTES_REQ_BODY };
    this.reqHeaders = { ...OptimizedPath.GOOGLE_ROUTES_REQ_HEADERS };
    this.apiResponse = null;
    this.optimizedWaypointIndices = [];
    this.driveTimeSeconds = null;
    this.distanceMeters = null;
    this.urlGeneratedAt = null;
  }

  /**
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
  prepareApiRequest() {
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
      const response = await this.axiosInstance.post(
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

  /**
   * Validates the API response to ensure that it contains the necessary data.
   * @argument {void}
   * @returns {void}
   * @throws {ExternalServiceError} - An error if the API response is invalid.
   */
  validateApiResponse() {
    // Throw appropriate errors if the API response is invalid
    if (!this.apiResponse.routes || this.apiResponse.routes.length === 0) {
      throw new ExternalServiceError("Invalid External API response");
    }

    if (!this.apiResponse.routes[0].duration) {
      throw new ExternalServiceError("Invalid drive time in API response");
    }

    if (!this.apiResponse.routes[0].distanceMeters) {
      throw new ExternalServiceError("Invalid distance in API response");
    }

    // If we have more than one waypoint
    if (this.waypoints.length > 1) {
      // Ensure that the optimized waypoint indices are present in the API response
      const indices =
        this.apiResponse.routes[0].optimizedIntermediateWaypointIndex;

      if (!indices || indices.length !== this.waypoints.length) {
        throw new ExternalServiceError(
          "Invalid optimized waypoint indices in API response"
        );
      }
    }
  }

  /**
   * Extracts the drive time, distance, and optimized waypoint indices from the
   * API response.
   * @argument {void}
   * @returns {void}
   * @throws {ExternalServiceError} - An error if the API response is invalid.
   */
  parseApiResponse() {
    // Extract the drive time and distance from the API response
    this.driveTimeSeconds = this.apiResponse.routes[0].duration.slice(0, -1);
    this.distanceMeters = this.apiResponse.routes[0].distanceMeters;

    // Extract the optimized waypoint indices from the API response if they exist
    if (this.waypoints.length > 1) {
      this.optimizedWaypointIndices =
        this.apiResponse.routes[0].optimizedIntermediateWaypointIndex;
    }
  }

  /**
   * Sets the optimizedWaypoints property if there at least two waypoints,
   * by re-arranging the waypoints based on the optimized indices.
   * @argument {void}
   * @returns {void}
   */
  reArrangeWaypoints() {
    if (this.waypoints.length > 1) {
      // Re-arrange the waypoints based on the optimized indices
      this.optimizedWaypoints = this.optimizedWaypointIndices.map((index) => {
        return this.waypoints[index];
      });
    }
  }

  /**
   * Generates the final directions URL based on the origin, destination, and
   * optimized waypoints and sets the URL generated timestamp.
   * @argument {void}
   * @returns {void}
   */
  generateDirectionsUrl() {
    // Add the encoded origin and destination addresses to the URL
    this.urlComponents.push(
      `&origin=${encodeURIComponent(this.origin.address)}`
    );
    this.urlComponents.push(
      `&destination=${encodeURIComponent(this.destination.address)}`
    );

    // Add the origin and destination place IDs to the URL
    this.urlComponents.push(`&origin_place_id=${this.origin.google_place_id}`);
    this.urlComponents.push(
      `&destination_place_id=${this.destination.google_place_id}`
    );

    // When there is only one waypoint, add it's address and place ID to the URL
    if (this.waypoints.length === 1) {
      this.urlComponents.push(
        `&waypoints=${encodeURIComponent(this.waypoints[0].address)}`
      );

      this.urlComponents.push(
        `&waypoint_place_ids=${this.waypoints[0].google_place_id}`
      );
    } else if (this.waypoints.length > 1) {
      // Join encoded optemized waypoint addresses and add them to the URL
      const waypointAddressString = this.optimizedWaypoints
        .map((waypoint) => encodeURIComponent(waypoint.address))
        .join("|");

      this.urlComponents.push(`&waypoints=${waypointAddressString}`);

      // Join optimized waypoint place IDs and add them to the URL
      const waypointPlaceIdString = this.optimizedWaypoints
        .map((waypoint) => waypoint.google_place_id)
        .join("|");

      this.urlComponents.push(`&waypoint_place_ids=${waypointPlaceIdString}`);
    }

    // Join the URL components to create the final directions URL
    this.directionsUrl = this.urlComponents.join("");

    // Set the URL generated timestamp to the current date and time
    this.urlGeneratedAt = new Date().toISOString();
  }
}

export default OptimizedPath.calculateOptimizedPath;
