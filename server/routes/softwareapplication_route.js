import {Router} from "express"

const  router=Router();



import SoftwareApplicationController from "../controller/SoftwareApplication_Controller.js"



router.post("/create-softwareApplication",SoftwareApplicationController.createSoftwareApplication);
router.get("/get-softwareApplication",SoftwareApplicationController.getAllSoftwareApplication);
router.delete("/delete-softwareApplication/:id",SoftwareApplicationController.deleteSoftwareApplication);

export default router;