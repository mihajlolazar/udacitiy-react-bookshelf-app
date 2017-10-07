import React, { Component } from 'react'

class Modal extends Component {
  state = {
    className: 'book-modal',
    modalText: ''
  };

  componentWillReceiveProps(props){
    if( props.text !== this.state.modalText ){
      this.setState({
        className: 'book-modal is-visible',
        modalText: props.text
      });

      this.timeoutId = setTimeout(() => {
        clearTimeout(this.timeoutId);
        this.setState({
          className: 'book-modal'
        })
      },3000);
    }
  }

  render() {
    return (
        <div id="book-modal" className={this.state.className}>
          <span className="book-modal-text">{this.props.text}</span>
        </div>
    );
  }
}

export default Modal