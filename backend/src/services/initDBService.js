import sequelize from "../models/index.js";
import User from "../models/user.js";
import Path from "../models/path.js";
import Location from "../models/location.js";
import PathLocation from "../models/pathLocation.js";

/**
 * Initializes the database service, ensuring that a connection is established,
 * the models are defined, relationships are established, and the database
 * tables created.
 * @argument {void}
 * @throws {Error} - An error if the database service cannot be initialized.
 * @returns {Promise<void>}
 */
const initDBService = async () => {
  // Define table relationships
  User.hasMany(Path, { foreignKey: "user_id" });
  Path.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Location, { foreignKey: "user_id" });
  Location.belongsTo(User, { foreignKey: "user_id" });

  Path.belongsToMany(Location, {
    through: PathLocation,
    foreignKey: "path_id",
  });
  Location.belongsToMany(Path, {
    through: PathLocation,
    foreignKey: "location_id",
  });

  // Synchronize the models with the database
  try {
    await sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    throw new Error(
      "Unable to synchronize the models with the database:",
      error
    );
  }
};

export default initDBService;
