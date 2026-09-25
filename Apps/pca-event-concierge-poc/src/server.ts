import cors from "cors";
import express from "express";
import pcaRouter from "./api/pca";
import voiceRouter from "./api/voice";

const app = express();
const port = Number(process.env.PORT ?? 8787);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/api", pcaRouter);
app.use("/api", voiceRouter);
app.get("/api/healthz", (_req, res) => res.json({ ok: true, service: "pca-event-concierge-poc" }));

app.listen(port, () => {
  console.log(`PCA Event Concierge API listening on http://localhost:${port}`);
});
