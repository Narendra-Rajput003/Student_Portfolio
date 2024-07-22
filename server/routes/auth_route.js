import {Router} from "express"

const  router=Router();






import UserController from "../controller/User_Controller.js"


router.post("/signUp",UserController.register)

export default router;