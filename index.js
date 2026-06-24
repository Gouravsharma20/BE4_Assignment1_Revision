const express = require("express")

const Books = require("./model/bookModel")
const { initializeDatabase } = require("./db/db.connection")

const app = express()

initializeDatabase()

app.use(express.json())

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));



app.get("/",(req,res)=>{
    res.send("Hello, From Books Express Server.")
})

app.get("/books", async (req, res) => {
    try {
        const books = await Books.find()
        console.log(books)
        return res.status(200).json(books)
    } catch(err) {
        return res.status(500).json({ error: "Failed to fetch books", errorDetails: err.message })
    }
})

async function addBook(newBook) {
    try {
        const newlyAddedBook = await Books.create(newBook)
        return newlyAddedBook
    } catch(err) {
        console.log("error adding book")
    }
}

app.post("/books",async(req,res)=>{
    try {
        const addedBook = await addBook(req.body)
        if (!addedBook) {
            return res.status(404).json({error:"Failed to add book"})
        } else {
            return res.status(200).json({message:"new book added successfully",newBookData:addedBook})
        }
    } catch(err){
        return res.status(500).json({error:"an unexpected error occured while adding new book",errorDetails:err.message})
    }

})

async function getBookDetails(details) {
    try {
        const bookDetails = await Books.find(details)
        if (!bookDetails) {
            console.log(`unable to get details by ${details}`)
        } else return bookDetails
    } catch(err) {
        console.log("an error occured while getting book data")
    }
}

// find book by title

app.get("/title/:bookTitle",async(req,res)=>{
    try {
        const title = req.params.bookTitle
        const foundDetails = await getBookDetails({title})
        if (foundDetails.length === 0) {
            return res.status(404).json({error:"book details with title not found"})
        } else {
            return res.status(200).json({message:"book details found successfully",details:foundDetails})
        }
    } catch(err) {
        return res.status(500).json({error:"unable to get book detail bu title",errorDetails:err.message})
    }
})

// find book by author

app.get("/author/:bookAuthor",async (req,res)=>{
    try {
        const author = req.params.bookAuthor
        const foundDetails = await getBookDetails({author})
        if (foundDetails.length === 0 ) {
            return res.status(404).json({error:"book details with author not found"})
        } else {
            return res.status(200).json({message:`book details of ${author} found successfully`,bookDetails:foundDetails})
        }
    } catch(err) {
        return res.status(500).json({error:"unable to find book details by author",errorDetails:err.message})
    }
})

// get all books by genre

app.get("/genre/:bookGenre",async (req,res)=>{
    try {
        const genre = req.params.bookGenre
        const foundGenre = await getBookDetails({genre})
        if (foundGenre.length === 0) {
            return res.status(404).json({error:`unable to find ${genre} details`})
        } else {
            return res.status(200).json({message:"genre found successfully",bookGenreData:foundGenre})
        }
    } catch(err) {
        return res.status(500).json({error:"an error occured while getting book genre",genreDetails:err.message})
    }
})

// get all books by year

app.get("/year/:bookYear",async(req,res)=>{
    const years = Number(req.params.bookYear)
    try {
        const foundBooks = await getBookDetails({publishedYear:years})
        if (foundBooks.length === 0 ) {
            return res.status(404).json({error:"book year not founds"})
        } else {
            return res.status(200).json({message:`books with ${years} found successfully`,bookDetails:foundBooks})
        }
    } catch(err) {
        return res.status(500).json({error:"an error occured while getting book year"})
    }
})

// update book rating by id

async function updateBookById({id,dataToUpdate}) {
    try {
        const updatedData = await Books.findByIdAndUpdate(id,dataToUpdate,{new:true})
        return updatedData
    } catch(err){
        console.log("an error occured while updating data")
    }
}

// update rating of books

app.post("/rating/:bookId",async(req,res)=>{
    try {
        const foundId = req.params.bookId
        const updateRating = await updateBookById({id:foundId,dataToUpdate:req.body})
        return res.status(200).json({message:"ratings updated successfully",updatedData:updateRating})
    } catch(err){
        return res.status(500).json({error:"unable to update ratings"})
    }
})

// update book by title

async function updateBookData(updateBookBy,dataToUpdate) {
    try {
        const updatedBook = await Books.findOneAndUpdate(updateBookBy,dataToUpdate,{new:true})
        return updatedBook
    } catch(err) {
        console.log(`an error occured while updating book data by ${updateBookBy}`)
    }
}

app.post("/updateBook/:title", async(req,res)=>{
    try {
        const bookTitle = req.params.title
        const bookData = await updateBookData({title:bookTitle},req.body)
        if (!bookData) {
            return res.status(404).json({error:"Book does not exist"})
        } else {
            return res.status(200).json({message:`book with title ${bookTitle} updated succeessfully`,updatedBook:bookData})
        }
    } catch(err){
        return res.status(500).json({error:`an unexpected occur came while uodating ${bookTitle}`,errorDetails:err.message})
    }
})

// delete book by id

async function deleteBookByID(ID) {
    try {
        const deleteBook = await Books.findByIdAndDelete(ID)
        return deleteBook
    } catch(err) {
        console.log("an error occured while deleting books")
    }
}

app.delete("/deleteBook/:bookId",async(req,res)=>{
    try {
        const id = req.params.bookId
        const deletedBook = await deleteBookByID(id)
        if (!deletedBook) {
            return res.status(404).json({error:"Book not found"})
        } else {
            return res.status(200).json({message:"book deleted successfuly",deletedBook:deletedBook})
        }
    } catch(err) {
        return res.status(500).json({error:"an error occured while deleting movie"})
    }
})




const PORT = 3263

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})

