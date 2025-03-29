import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import router from "./routes";
import { config } from "dotenv";
config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// startCronJob();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(router);
app.get("/", async (req, res) => {
  res.json({ message: "Payment Integration Backend" });
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`)
);
