import { Category } from "../model/category.model.js";


export const createCategory = async( req , res) => {
try {
        const {name , parent } = req.body;
    
        if(!name) {
            req.status(200).json({message : "Name not found"});
        }
    
        const createCategory = await Category.create({
            name,
            parent :  parent || null,
        })
    
        return res.status(200).json({message : "Category created succfully " , createCategory});
} catch (error) {
    return res.status(500).json({message : "somthing went wrong " , error : error.message , stack : error.stack})
}

}

export const getAllCategories = async(req , res) => {
    try {
        const category = await Category.find().populate("parent");
        if(!category){
            return res.status(400).json({message : "Category not found" });
        }

        return res.status(200).json({message : "All category fetch succcfully" , category })
    } catch (error) {
        return res.status(500).json({message : "Somthing went wrong " , error: error.message , stack : error.stack })
    }
}

