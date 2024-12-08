import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../utils/database";
import Post from "./Post";

export default class User extends Model {
  public id!: number;
  public email?: string;
  public password?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public posts?: Post[]; // Medya ilişkisinin eklenmesi

  public static associations: {
    media: Association<User, Post>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        isEmail: {
          msg: "Geçerli bir e-posta adresi girin",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });
