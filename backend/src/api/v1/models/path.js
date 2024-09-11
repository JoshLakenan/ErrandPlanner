import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from "./user.js";

const Path = sequelize.define(
  "Path",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    directions_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    drive_time_seconds: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    distance_meters: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    url_generated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "paths",
    timestamps: false,
  }
);

export default Path;
