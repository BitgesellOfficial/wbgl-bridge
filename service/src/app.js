import express from "express";
import cors from "cors";
import { port } from "./utils/config.js";
import {
  BalanceController,
  IndexController,
  SubmitController,
} from "./controllers/index.js";

const app = express();
app.set("port", port);
app.use(cors());
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.get("/", IndexController.healthCheck);
app.get("/state", IndexController.state);
app.get("/contracts", IndexController.contracts);

app.get("/balance/bgl", BalanceController.bgl);
app.get("/balance/eth", BalanceController.eth);
app.get("/balance/bsc", BalanceController.bsc);

app.post("/submit/bgl", SubmitController.bglToWbgl);
app.post("/submit/wbgl", SubmitController.wbglToBgl);

export default app;
