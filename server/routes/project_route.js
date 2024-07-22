import {Router} from "express"

const  router=Router();



import ProjectController from "../controller/Project_Controller.js"


router.post("/create-project",ProjectController.createProject)
router.get("/get-all-projects",ProjectController.getAllProjects)
router.delete("/delete-project/:id",ProjectController.deleteProject)
router.put("/update-project/:id",ProjectController.updateProject)
router.get("/get-project/:id",ProjectController.getProjectById)





export default router