import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import sequelize from "./utils/database";

const PORT = process.env.SERVER_PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Veritabanı bağlantısı başarılı ve tablolar oluşturuldu.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Veritabanı bağlantı hatası:", error);
  }
};

startServer();
