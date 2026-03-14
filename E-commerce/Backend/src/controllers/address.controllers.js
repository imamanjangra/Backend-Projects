import { Address } from "../model/address.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createAddress = asyncHandler(async (req , res) => {
    try {
        const {state , city , pincode , street , addressLine , landmark , addressType} = req.body;
    
        if(!state || !city || !pincode  || !addressLine || !landmark || !addressType) {
            return res.status(400).json({message : "All fileds are required "});
        }
    
        const address = await Address.create({
            state,
            city,
            pincode,
            street,
            addressLine,
            landmark,
            addressType,
            userID : req.user._id
        })
    
        return res.status(200).json({message : "Address created succfully " , address})
    } catch (error) {
        return res.status(500).json({message : "Somthing went wrong " , error : error.message , stack : error.stack})
    }
})

export const updateAddress = asyncHandler(async (req , res) => {
  try {
     const {state , city , pincode , street , addressLine , landmark , addressType} = req.body;
  
      if(!state && !city && !pincode  && !addressLine && !landmark && !addressType && !street) {
              return res.status(400).json({message : "Enter a data to update"});
          }
  
      const address = await Address.findByIdAndUpdate(
          req.params.id,
          {
              $set : {
                  state,
                  city,
                  pincode,
                  street,
                  addressLine,
                  landmark,
                  addressType
              }
          },
          {
              new : true
          }
      )
      return res.status(200).json({message : "address update succfully" , address});
  
  } catch (error) {
    return res.status(500).json({message : "Somthing went wrong" , error : error.message , stack : error.stack})
  }
})

export const deleteAddress = asyncHandler(async (req , res) => {
   try {
     const address = await Address.findById(req.params.id);
 
     if(!address){
         return res.status(200).json({message : "Address is not entred !"});
     }
 
     if(req.user._id.toString() !== address.userID.toString()){
         return res.status(400).json({message : " authorized user not found "});
     }
 
     address.deleteOne();
 
     return res.status(200).json({message : "address deleted succfully "})
   } catch (error) {
    return res.status(500).json({message : "somthing went wrong  "})
   }        

})

export const getAddress = asyncHandler(async (req , res) => {
    const address = await Address.find({userID : req.user._id})
    return res.status(200).json({message : "user address" , address})
})
