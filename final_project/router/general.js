const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnCode = req.params.isbn;
  res.send(books[isbnCode]);
 });
  
// Get book details based on author
function getBooksByAuthor(authorName) {
    let matchingBooks = [];

    for (let key in books) {
        if (books[key].author === authorName) {
            matchingBooks.push({
                id: key,
                title: books[key].title,
                author: books[key].author,
                reviews: books[key].reviews
            });
        }
    }
    return matchingBooks;
}


public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  let booksByAuthorName = getBooksByAuthor(authorName);
  return res.send(booksByAuthorName);
});

// Get all books based on title
function getBooksByTitle(titleName) {
    let matchingBooks = [];

    for (let key in books) {
        if (books[key].title === titleName) {
            matchingBooks.push({
                id: key,
                title: books[key].title,
                author: books[key].author,
                reviews: books[key].reviews
            });
        }
    }
    return matchingBooks;
}
public_users.get('/title/:title',function (req, res) {
  let titleName = req.params.title;
  let booksByTitleName = getBooksByTitle(titleName);
  return res.send(booksByTitleName);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbnCode = req.params.isbn;
  return res.send(books[isbnCode].reviews)
});

module.exports.general = public_users;
