import db from "@chitapp/utils/db";
import logger from "@chitapp/utils/logger";
import { createServer } from "@chitapp/utils/server";
import "dotenv/config";

db.open().then(() =>
  createServer()
    .then((server) => {
      const port = process.env.PORT || 8080;
      server.listen(port, () => {
        logger.info(`Listening on ${port}`);
      });
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
    })
);
