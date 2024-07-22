import {Router} from "express"

const  router=Router();


import SkillController from "../controller/Skills_Controller.js"


router.post("/create-skill",SkillController.createSkills)
router.get("/get-skills",SkillController.getAllSkills)
router.delete("/delete-skill/:id",SkillController.deleteSkill)
router.put("/update-skill/:id",SkillController.updateSkill)



export default router;