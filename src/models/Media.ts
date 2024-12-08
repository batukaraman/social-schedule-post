import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/database";
import Post from "./Post";

export default class Media extends Model {
  public id!: number;
  public url!: string;
  public postId!: number;
}

Media.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Media",
    tableName: "media",
    timestamps: true,
  }
);
