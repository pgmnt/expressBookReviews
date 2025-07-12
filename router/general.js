const users = require('./auth_users.js').users
const books = require('./booksdb.js')
const express = require('express')

const public_users = express.Router()

const axios = require("axios");
const { json } = require("express");
let isValid = require("./auth_users.js").isValid;

//Get all books using Async callbacks
public_users.get("/server/asynbooks", async function (req,res) {
  try {
    let response = await axios.get("http://localhost:5000/");
    console.log(response.data);
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting book list"});
  }
});

 //Get book details by ISBN using Promises
 public_users.get("/server/asynbooks/isbn/:isbn", function (req,res) {
  let {isbn} = req.params;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});

//Get book details by author using promises
public_users.get("/server/asynbooks/author/:author", function (req,res) {
  let {author} = req.params;
  axios.get(`http://localhost:5000/author/${author}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});

//Get all books based on title using promises
public_users.get("/server/asynbooks/title/:title", function (req,res) {
  let {title} = req.params;
  axios.get(`http://localhost:5000/title/${title}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});


public_users.post('/register', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
  if (users.includes(username)) {
    return res.status(400).json({ message: 'User already exists' })
  } else {
    users.push({ username, password })
    return res.status(200).json({ message: 'User registered successfully' })
  }
})

public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(JSON.stringify(books))
  })
    .then((data) => {
      return res.status(200).json({ data })
    })
    .catch((error) => {
      return res.status(400).json({ message: error })
    })
})

public_users.get('/', async function (req, res) {
  try {
    const data = await new Promise((resolve, reject) => {
      resolve(JSON.stringify(books))
    })
    return res.status(200).json({ data })
  } catch (error) {
    return res.status(400).json({ message: error })
  }
})

public_users.get('/isbn/:isbn', function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn
    const book = books[isbn]
    if (!book) {
      reject('Book not found')
    } else {
      resolve(book)
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
})

public_users.get('/author/:author', function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author
    const booksByAuthor = Object.values(books).filter(
      (b) => b.author === author
    )
    if (booksByAuthor.length === 0) {
      reject('No books found for this author')
    } else {
      resolve(booksByAuthor)
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
})

public_users.get('/title/:title', function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title
    const booksByTitle = Object.values(books).filter((b) =>
      b.title.includes(title)
    )
    if (booksByTitle.length === 0) {
      reject('No books found with this title')
    } else {
      resolve(booksByTitle)
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
})

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if (!book || !book.reviews) {
    return res.status(404).json({ message: 'Reviews not found for this book' })
  }
  return res.status(200).json(book.reviews)
})

module.exports.general = public_users
