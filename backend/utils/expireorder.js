import cron from "node-cron"
import Order from "../models/order.model.js"
import Inventory from "../models/inventory.model.js"

const startexpirationjob = ()=>{
    cron.schedule("*/10 * * * *",async ()=>{
try {
    const twohourago = new Date(Date.now()-2*60*60*1000);
    const expiredOrders = await Order.find({
        status:"Pending",
        createdAt:{$lt:twohourago}
    });

    if(expiredOrders.length==0)return ;

    for(const Orders of expiredOrders){
       
        for (const item of Orders.items){
        await Inventory.findByIdAndUpdate(item.inventoryItem,{
            $inc:{stockQuantity:item.quantity}
        })
        }

        Orders.status="Cancelled";

        await Orders.save();
console.log(`[CLEANUP] Order ${Orders.reservationCode} has been cancelled and stock restored.`)
    }

} catch (error) {
    console.error("Expiration Job Error:", error.message);
}
    })
}

export default startexpirationjob;