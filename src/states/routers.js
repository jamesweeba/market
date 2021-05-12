const express=require('express');
const services=require('./services');




const router=express.Router();

router.post("/",services.createState);

router.get("/:id",services.getAState);

router.put("/:id",services.update);

router.get("/",services.getStates);



module.exports=router;