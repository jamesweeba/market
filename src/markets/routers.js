const router=require("express").Router();
const controller=require('./services');

router.post("/",controller.createMarket);
router.get("/",controller.getMarkets);
router.get('/:id',controller.getMarket);
router.put('/:id',controller.updateMarket);

module.exports=router;

