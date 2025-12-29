import { Router } from "express";
import { checkout, getAll, getById, remove, updateStatus } from "../controllers/borrow.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/checkout", authenticate, checkout);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getById);
router.put("/:id/status", authenticate, updateStatus);
router.delete("/:id", authenticate, remove);
export default router;
//# sourceMappingURL=borrow.route.js.map
