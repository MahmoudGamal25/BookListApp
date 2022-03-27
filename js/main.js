// fetch elements 
const bookForm=document.querySelector("#book-form");
const bookList=document.querySelector("#book-list");

// Book class => Represent a book 
class Book {    
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class => handle ui tasks
  class UI {
     static displayBooks(){
         const books=Store.getBooks();
         books.forEach(book=>UI.addBookToList(book))
     }
     //notification handling
     static notification(message,backgroundColor)
     {
         const div=document.createElement('div');
         const container=document.querySelector('.container');
         const form=document.querySelector('.container #book-form');   
         div.className=`alert alert-${backgroundColor}`;
         div.textContent=message;
         container.insertBefore(div,form);
         setTimeout(()=>{div.remove()},1500);
     }


     // add book to list
     static addBookToList(book){
         const tr=document.createElement('tr');
         tr.innerHTML=`
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a class='btn btn-danger btn-sm delete'>x</a></td> `;
        bookList.appendChild(tr);         
     }
     // clear inputs
     static clearInputs(){
         document.querySelector("#title").value='';
         document.querySelector("#author").value='';
         document.querySelector("#isbn").value='';
     }
     // delete book
     static deleteBook(e)
     {
        if(e.target.classList.contains('delete'))e.target.parentElement.parentElement.remove();
     }
  }

//store class =>handles storage
class Store{
   static getBooks(){
    let books;
    if(localStorage.getItem('books')===null)
    {
        books=[];
    }else{
        books=JSON.parse(localStorage.getItem('books'));
    }
    return books;
   }
   static addBook(book){
    const books=Store.getBooks();
    books.push(book);
    localStorage.setItem('books',JSON.stringify(books));
   }
   static deleteBook(isbn){
    const books=Store.getBooks();
    books.forEach((book,index)=>{
       if(book.isbn===isbn)
       books.splice(index,1);
    });
    localStorage.setItem('books',JSON.stringify(books));
   }
}

//event Display Books
document.addEventListener('DOMContentLoaded',UI.displayBooks);

//Event Add Book 
bookForm.addEventListener('submit',e=>{
    e.preventDefault();
    // fetch inputs
    const title=document.querySelector("#book-form #title");
    const author=document.querySelector("#book-form #author");
    const isbn=document.querySelector("#book-form #isbn");

    // validate inputs
    if(title.value === '' || isbn.value === '' || author.value === '')UI.notification("Please Fill Data","danger");
    else{ 
        const book = new Book(title.value,author.value,isbn.value);
       //add book to list
        UI.addBookToList(book);
        // add book to localstorage
        Store.addBook(book);
       // show notification 
       UI.notification("Added Book Successfully","success");
       // clear all inputs after add book
        UI.clearInputs();
    }
})



//event Delete a Book
bookList.addEventListener('click',e=>{
  // delete book from ui
    UI.deleteBook(e);
  // delete book from localstorage
  Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);
  UI.notification("Deleted Book successfully","success");
}
);