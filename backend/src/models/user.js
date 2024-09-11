import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

export default User;
