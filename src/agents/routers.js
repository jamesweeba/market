const expresss=require('express');
const router=expresss.Router();
const services=require('./services');


router.post("/",services.createAgent);
router.get("/",services.getAgents);
router.put("/:id",services.updateAgent);
router.get("/:id",services.getAgent);

router.get("/:id/orders",services.getAgentOrders);



module.exports=router;
