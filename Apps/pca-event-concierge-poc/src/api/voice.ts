import { Router } from "express";

const router = Router();

router.post("/voice/session", (_req, res) => {
  res.status(501).json({
    error: "Voice is intentionally out of scope for this clean migration pass.",
    nextStep: "Add a provider-neutral voice session route when the ChatGPT App PoC requires voice capture.",
  });
});

export default router;
