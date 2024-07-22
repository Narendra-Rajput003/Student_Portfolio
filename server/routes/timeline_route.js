import {Router} from "express"

const route=Router();



import TimeLineController  from "../controller/Timeline_Controller.js"


route.post("/create-timeline",TimeLineController.createTimeLine)
route.delete("/delete-timeline/:id",TimeLineController.deleteTimeLine)
route.get("/get-timeline",TimeLineController.getAllTimeLine)