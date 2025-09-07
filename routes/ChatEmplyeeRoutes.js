

import express from "express";
import { MarkReadChat, RecevedMessage, SendMessage } from "../controller/ChatEmplyeeControll.js";



    const router = express.Router();
    
    router.patch("/read/:id", MarkReadChat);
    router.post("/send", SendMessage);
    router.get("/receved", RecevedMessage);

    export default router;
    