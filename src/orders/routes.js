const expresss=require('express');
const router=expresss.Router();
const services=require('./services');
const authorize=require('../authorize/authorize')




router.use(authorize.auhorize);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags:
 *       - Puppies
 *     description: Returns all puppies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of puppies
 *         schema:
 *           $ref: '#/definitions/Puppy'
 */
router.post("/",services.createOrder);
router.get("/:id",services.anOrder);
router.get("/",services.getOrders);
router.put('/:id',services.updateOrder);


 router.put('/:id/decline',services.declineOrder);
// router.put("/:id/decline",services.declineOrder);

// router.put("/:id",services.editOrder);
// router.delete("/:id",services.removeOrder);


module.exports=router;