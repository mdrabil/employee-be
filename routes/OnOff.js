import express from "express";
import { getisOnlineEmplyee, IsOfflineEmplyee, isOnlineEmplyee } from "../controller/IsOnlineEmployee.js";


const router = express.Router();

router.post("/login", isOnlineEmplyee);
router.post("/logout", IsOfflineEmplyee);
router.get("/", getisOnlineEmplyee);


export default router;
