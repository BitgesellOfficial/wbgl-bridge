import http from "http";
import app from "./app";
import { port } from "./utils/config";
import { Db, Chores } from "./modules/index";

const server = http.createServer(app);
server.listen(parseInt(port), () => {
  console.log(`listening on *:${port}`);
});

process.on("uncaughtException", async (error) => {
  console.log("UNCAUGHT EXCEPTION:", error);
  await Db.close();
  process.exit(1);
});

const init = async() => {
  await Db.init();
  await Chores.init();
}

init()
  .catch(err => {process.exit(1)})