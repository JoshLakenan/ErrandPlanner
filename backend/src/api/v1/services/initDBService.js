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
  // Test the connection
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    throw new Error("Unable to connect to the database:", error);
  }

  // Define One to Many relationship between User and Path
  User.hasMany(Path, { foreignKey: "user_id" });
  Path.belongsTo(User, { foreignKey: "user_id" });

  // Define One to Many relationship between User and Location
  User.hasMany(Location, { foreignKey: "user_id" });
  Location.belongsTo(User, { foreignKey: "user_id" });

  // Define Many to Many relationship between Path and Location
  Path.hasMany(PathLocation, { foreignKey: "path_id", onDelete: "CASCADE" });
  PathLocation.belongsTo(Path, { foreignKey: "path_id" });
  Location.hasMany(PathLocation, {
    foreignKey: "location_id",
    onDelete: "CASCADE",
  });
  PathLocation.belongsTo(Location, { foreignKey: "location_id" });

  // Synchronize the models with the database
  try {
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    throw new Error(
      "Unable to synchronize the models with the database:",
      error
    );
  }
};

export default initDBService;
