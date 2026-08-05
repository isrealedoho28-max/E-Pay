import express from "express"
import cloudinary from "../lib/cloudinary.js";
import HistoryModel from "../models/historyModel.js";
import protectRoutes from "../middleware/middleware.js";
const router = express.Router()

//create book
router.post('/', protectRoutes, async (req, res)=>{

  try {
   const id= req.user._id

    const {title, caption, rating, image}= req.body;

    if(!image || !title || !caption || !rating){
    return  res.status(400).json({message:"please provide all fields"})
    }

    //upload image to cloudinary
const imageUpload= await cloudinary.uploader.upload(image);
const imageString = imageUpload.secure_url;

const newBook = await BookModel.create({
  title:title,
  caption: caption,
  rating: rating,
  image: imageString,
  user: id
})

res.status(201).json(newBook)
  } catch (error) {
    console.log('error creating book.... internal server problem ')
    res.status(400).json({message:"error adding book to database....   internal sever error"})
  }
})




router.get('/', protectRoutes, async (req, res)=>{

  try {
    const page = req.query.page || 1;
    const limit= req.query.limit || 5;
    const skip = (page -1)* limit;

    const books= await BookModel.find().sort({createdAt: -1}).skip(skip).limit(limit)
    .populate("user", "username profileImage");

  const totalBooks= await BookModel.countDocuments()
   res.send({
    books,
    currentPage:page,
    totalBooks,
    totalPages: Math.ceil(totalBooks / limit),
   })

  } catch (error) {
    console.log(error.message, 'internal server error')
    res.status(400).json({message:"internal server error"})
  }
})


router.get('/user', protectRoutes, async (req, res)=>{
  try {
 const id= req.user._id;

 const books = (await BookModel.find({user:id})).sort({createdAt: -1});
 res.json(books)
    
  } catch (error) {
    console.log(error, 'internal server error')
    res.status(500).json({message:"server error"})
  }
})


router.delete('/:id', protectRoutes, async (req, res)=>{

  try {
    const id = req.params.id;
    
    const book = await BookModel.findById(id);
    if(!book){
      return res.status(404).json({message:"book not food"})
    }

    if(book.user.toString() !== req.user._id.toString()){
  return res.status(400).json({
    message:"unauthorized request"
  })
    }

    //delete image from cloudinary as well
   if(book.image && book.image.includes("cloudinary")){
    try {
      
      const publicId = book.image.split("/").pop().split(".")[0]
      await cloudinary.uploader.destroy(publicId);

    } catch (error) {
      console.log(error.message, 'error deleting image from cloudinary')
    }
   }


await book.deleteOne();
res.status(200).json({message:"Book Deleted"})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({message:"internal server error"})
  }
})


export default router