import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from "./user.js";

const Location = sequelize.define(
  "Location",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    google_place_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    last_used: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "locations",
    timestamps: false,
    indexes: [
      {
        // Unique constraint for user/location combo
        unique: true,
        fields: ["user_id", "google_place_id"],
      },
    ],
  }
);

export default Location;
