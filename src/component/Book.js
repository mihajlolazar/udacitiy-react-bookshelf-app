import React, { Component } from 'react';

class Book extends Component {
  handleOnChange = (book,shelf) => {
    if( this.props.moveBook && shelf && (shelf !== 'none')){
      if( !book.shelf ){
        book.shelf = shelf;
      }

      this.props.moveBook(book,shelf)
    }
  };

  render(){
    const book    = this.props.book;
    const shelf   = this.props.shelf;
    const options = [
      { value: '',                  text: 'Move to...' },
      { value: 'currentlyReading',  text: 'Currently Reading' },
      { value: 'wantToRead',        text: 'Want to Read' },
      { value: 'read',              text: 'Read' },
      { value: 'none',              text: 'None' }
    ];

    if( book ){
      return (
          <li key={book.id}>
            <div className="book">
              <div className="book-top">
                <div className="book-cover">
                  <img className="book-img" src={book.imageLinks.thumbnail} title={book.title} alt={book.title}/>
                </div>
                <div className="book-shelf-changer">
                  <select onChange={(event) => this.handleOnChange(book,event.target.value)} defaultValue={shelf}>
                    {options.length && options.map( (option,index) => (
                        <option key={option.value + index} value={option.value} disabled={!option.value || (shelf === option.value)}>{option.text}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="book-title">{book.title}</div>
              {book.authors && book.authors.length && (
                <div className="book-authors">
                  {book.authors.map((author,index) => (
                      <span key={author} className="book-author">{!!index && ', '}{author}</span>
                  ))}
                </div>
              )}
            </div>
          </li>
      )
    }
    else {
      return null;
    }
  }
}

export default Book