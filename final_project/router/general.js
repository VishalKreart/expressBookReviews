const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//registering new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password)
  {
    if(!doesUserExist(username)){
       users.push({"username":username,"password":password});
       return res.status(200).json({message:"user successfully added"}); 
    }
    return res.status(404).json({message : "username already exist"});
  }
  return res.status(404).json({message : "username/password missing"});
});

const doesUserExist = (username)=>{
    let usersWithSameName = users.filter((user)=>{
        return user.username === username;
    })
    if(usersWithSameName.lenght>0){
        return true;
    }else{
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify({books},null,4));
});

//task 10 
public_users.get('/books',(req,res)=>{
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnCode = req.params.isbn;
  res.send(books[isbnCode]);
 });
  
// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    // console.log(isbn);
        if (req.params.isbn <= 10) {
        resolve(res.send(books[isbn]));
    }
        else {
            reject(res.send('ISBN not found'));
        }
    });
    get_books_isbn.
        then(function(){
            console.log("Promise for Task 11 is resolved");
   }).
        catch(function () { 
                console.log('ISBN not found');
  });

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
// TASK 12 - Get book details based on author
public_users.get('/books/author/:author',function (req, res) {

    const get_books_author = new Promise((resolve, reject) => {

        const authorName = req.params.author;
        let booksByAuthorName = getBooksByAuthor(authorName);
    if (booksByAuthorName.length >0) {
        resolve(res.send(JSON.stringify({booksByAuthorName}, null, 4)));
    } else {
        reject(res.send("The mentioned author does not exist "))    
    }
    
        
    });

    get_books_author.then(function(){
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned author does not exist');
  });

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

// TASK 13 - Get book details based on Title
public_users.get('/books/title/:title',function (req, res) {

    const get_books_title = new Promise((resolve, reject) => {

        const titleName = req.params.title;
        let booksByTitle = getBooksByTitle(titleName);
    if (booksByTitle.length >0) {
        resolve(res.send(JSON.stringify({booksByTitle}, null, 4)));
    } else {
        reject(res.send("The mentioned title does not exist "))    
    }
    
        
    });

    get_books_title.then(function(){
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned title does not exist');
  });

  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbnCode = req.params.isbn;
  return res.send(books[isbnCode].reviews)
});

module.exports.general = public_users;
