const express = require("express")

const app = express()

app.use(express.json())

const books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 3, title: '1984', author: 'George Orwell', year: 1949 }
];

const todos = [
  { id: 1, title: 'Water the plants', day: 'Saturday' },
  { id: 2, title: 'Go for a walk', day: 'Sunday' }
];

app.get("/todos",(req,res)=>{
    res.send(todos)
})

app.delete("/todos/:id",(req,res)=>{
    const toDoId = req.params.id
    const index = todos.findIndex((todo)=>todo.id == toDoId)

    if (index === -1) {
        res.send(404).json({message:"Todo does not exist"})
    } else {
        todos.splice(index,1)
        res.send(200).json({message:"Todos deleted successfully"})
    }


})







app.get("/",(req,res)=>{
    res.send("Hello, From Express Server.")
})

app.get("/books",(req,res)=>{
    res.send(books)
})

app.delete("/books/:id",(req,res)=>{
    const bookId = req.params.id
    const index = books.findIndex((book)=>book.id == bookId)
    if(index === -1) {
        res.status(404).json({error:"An Error occured while deleting books"})
    } else {
        books.splice(index,1)
        res.status(200).json({message:"Books deleted successfully !"})
    }
})

const PORT = 2228

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})

