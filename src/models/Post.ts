import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../utils/database";
import Media from "./Media";
import User from "./User";

class Post extends Model {
  public id!: number;
  public caption!: string;
  public scheduleDate!: Date | null;
  public status!: "scheduled" | "published" | "draft";
  public userId!: number;

  public media?: Media[];

  public static associations: {
    media: Association<Post, Media>;
  };
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduleDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    status: {
      type: DataTypes.ENUM("scheduled", "published", "draft"),
      allowNull: false,
      defaultValue: "draft",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    timestamps: true,
  }
);

Post.hasMany(Media, { foreignKey: "postId", as: "media" });
Media.belongsTo(Post, { foreignKey: "postId", as: "post" });

export default Post;
