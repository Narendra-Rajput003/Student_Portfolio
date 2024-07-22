import {Router} from "express"

const  router=Router();



import messageController from "../controller/message_Controller.js"


router.post("/send-message",messageController.sendMessage)
router.get("/get-message",messageController.getMessage)
router.delete("/delete-message/:id",messageController.getMessage)


export default router;