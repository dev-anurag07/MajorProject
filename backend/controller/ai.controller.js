import Groq from "groq-sdk";
import dotenv from "dotenv";
import Pharmacy from "../models/pharmacy.model.js";
import Order from "../models/order.model.js";


dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_LLM_API,
});

export const getMyOrders = async (userId) => {
  const orders = await Order.find({
    user: userId
  })
    .populate("pharmacy", "name address phoneNumber")
    .sort("-createdAt");

  return orders;
};


export const searchNearbyMedicine = async (
  lat,
  lang,
  radius,
  medicine
) => {
  const distanceinmeters = radius
    ? parseFloat(radius) * 1000
    : 500000;

  const pharmacies = await Pharmacy.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            parseFloat(lang),
            parseFloat(lat)
          ]
        },
        distanceField: "distance_km",
        maxDistance: distanceinmeters,
        distanceMultiplier: 0.001,
        spherical: true
      }
    },

    {
      $lookup: {
        from: "inventories",
        localField: "_id",
        foreignField: "PharmacyId",
        as: "inventory_items"
      }
    },

    {
      $unwind: "$inventory_items"
    },

    {
      $match: {
        "inventory_items.medicineName": {
          $regex: new RegExp(medicine, "i")
        },
        "inventory_items.stockQuantity": {
          $gt: 0
        }
      }
    },

    {
      $project: {
        _id: 0,
        pharmacyId: "$_id",
        pharmacyName: "$name",
        address: "$address",
        distance_km: 1,
        medicineName: "$inventory_items.medicineName",
        price: "$inventory_items.price",
        inventoryId: "$inventory_items._id",
        stockQuantity: "$inventory_items.stockQuantity",
        isAvailable: "$inventory_items.isAvailable",
        image: "$inventory_items.image"
      }
    }
  ]);

  return pharmacies;
};



export const aiAssistant = async (req, res) => {
  try {
    const { message, lat, lang } = req.body;

    const tools = [
      {
        type: "function",
        function: {
          name: "searchMedicine",
          description: "Find a medicine near the user's location",
          parameters: {
            type: "object",
            properties: {
              medicine: {
                type: "string",
                description: "Name of the medicine",
              },
            },
            required: ["medicine"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getMyOrders",
          description: "Get the logged-in user's orders",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
    ];

    const messages = [
      {
        role: "user",
        content: message,
      },
    ];

    
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      tools,
    });

    const assistantMessage = response.choices[0].message;

    
    if (assistantMessage.tool_calls) {
      messages.push(assistantMessage);

      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;

        const args = JSON.parse(
          toolCall.function.arguments
        );

        let result;

        
        if (functionName === "searchMedicine") {
          result = await searchNearbyMedicine(
            lat,
            lang,
            5,
            args.medicine
          );
        }

       
        if (functionName === "getMyOrders") {
          result = await getMyOrders(req.user.id);
        }

        
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      
      const finalResponse =
        await groq.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages,
          tools,
        });

      return res.status(200).json({
        success: true,
        message: finalResponse.choices[0].message.content,
      });
    }

    
    return res.status(200).json({
      success: true,
      message: assistantMessage.content,
    });

  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI error",
    });
  }
};