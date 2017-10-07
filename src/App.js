import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './component/Book'
import Modal from './component/Modal'
import { BrowserRouter,Route, Link } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: {},
    shelves: {},
    searchBooks: [],
    searchQuery: '',
    modalText: ''
  };

  fetchBooks = (modalText) => {
    BooksAPI.getAll().then((result) => {
      let shelves = {},
          books = {};

      result.forEach((book) => {
        if( !shelves[book.shelf] ){
          shelves[book.shelf] = [];
        }

        shelves[book.shelf].push(book);
        books[book.id] = book;
      });

      this.setState({
        books: books,
        shelves: shelves,
        modalText: modalText

      });
    })
  }

  moveBook = (book,shelf) => {
    BooksAPI.update(book,shelf).then(result => {
      this.fetchBooks('The Book "' + book.title + '" is moved to the Shelf "' + BooksApp.formatTitle(shelf) + '"');
    });
  }

  searchTimeout;
  searchBook = (e) => {
    const input = e.target;

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if( input.value ){
        BooksAPI.search(input.value).then(result => {
          this.setState({
            searchBooks: result,
            searchQuery: input.value,
            modalText: 'Total of ' + result.length + ' Books found'
          });
        });
      }
      else {
        this.setState({
          searchBooks: [],
          searchQuery: input.value
        });
      }
    },500);
  }

  componentDidMount(){
    this.fetchBooks();
  }

  static formatTitle(title){
    let splitedText = title.split(/(?=[A-Z])/).join(" ");
    return splitedText.charAt(0).toUpperCase() + splitedText.slice(1);
  }

  render() {
    const books = this.state.books;


    return (
      <BrowserRouter>
        <div className="app">
          <Modal text={this.state.modalText || ''}/>

          <Route path="/create" render={({ history }) => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search">Close</Link>
                <div className="search-books-input-wrapper">
                  {/*
                    NOTES: The search from BooksAPI is limited to a particular set of search terms.
                    You can find these search terms here:
                    https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                    However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                    you don't find a specific author or title. Every search is limited by search terms.
                  */}
                  <input type="text" placeholder="Search by title or author" defaultValue={this.state.searchQuery} onChange={(event) => this.searchBook(event)}/>
                </div>
              </div>
                {this.state.searchBooks.length && (
                  <div className="search-books-results">
                    <ol className="books-grid">
                      {
                      this.state.searchBooks.map( book => (
                          <Book key={book.id} book={book} shelf={books[book.id] ? books[book.id].shelf : ''} moveBook={this.moveBook}/>
                      ))
                    }
                    </ol>
                  </div>
                  )
                }
            </div>
          )} />
            <Route exact path="/" render={() => (
              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                {Object.keys(this.state.shelves).length && (
                  <div className="list-books-content">
                    <div>
                      {
                        Object.keys(this.state.shelves).map((key) => (
                          <div key={key} className="bookshelf">
                            <h2 className="bookshelf-title">{BooksApp.formatTitle(key)}</h2>

                            <div className="bookshelf-books">
                              <ol className="books-grid">
                                {
                                  this.state.shelves[key].map( book => (
                                  <Book key={book.id} book={book} shelf={books[book.id] ? books[book.id].shelf : ''} moveBook={this.moveBook}/>
                                  ))
                                }
                              </ol>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
                <div className="open-search">
                  <Link to="/create">Add a book</Link>
                </div>
              </div>
            )} />
        </div>
      </BrowserRouter>
    )
  }
}

export default BooksApp
