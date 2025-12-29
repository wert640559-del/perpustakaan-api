import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import * as profileController from "../controllers/profile.controller";
const router = Router();
router.use(authenticate);
router.get('/', profileController.get);
router.post('/', upload.single('profile_picture_url'), profileController.create);
router.put('/', profileController.update);
router.put('/picture', upload.single('profile_picture_url'), profileController.uploadPicture);
router.delete('/', profileController.remove);
export default router;
//# sourceMappingURL=profile.route.js.map