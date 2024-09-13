import { getOnePathWithLocations } from "./pathLocationService.js";
import { updatePath } from "./pathService.js";
import { BadRequestError } from "../../utils/errors.js";

class OptimizedPath {
  static async init(userId, pathId) {
    // Get the path with locations
    const path = await getOnePathWithLocations(userId, pathId);

    const optiPath = new OptimizedPath(path);

    optiPath.parseLocations();

    optiPath.validateLocations();

    return optiPath;
  }

  constructor(path) {
    this.user_id = path.user_id;
    this.id = path.id;
    this.name = path.name;
    this.locations = path.locations;
    this.origin = null;
    this.destination = null;
    this.waypoints = [];
    this.uniqueLocationIds = new Set();
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
}

export default OptimizedPath.init;
