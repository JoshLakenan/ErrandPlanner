import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import Path from "./path.js";
import Location from "./location.js";

const PathLocation = sequelize.define(
  "PathLocation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    path_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Path,
        key: "id",
      },
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Location,
        key: "id",
      },
      allowNull: false,
    },
    position: {
      type: DataTypes.ENUM("origin", "destination", "waypoint"),
      allowNull: false,
    },
  },
  {
    tableName: "paths_locations",
    timestamps: false,
  }
);

export default PathLocation;
