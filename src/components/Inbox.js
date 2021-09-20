import React, { Component } from 'react';
import api from '../api'
import '../Inbox.css';
import Message from './Message';
import ActionButton from './ActionButton';
import TillMessage from './TillMessage';


class Inbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: null,
      indexActiveMessage: 0,
      tillMessages: null,
      inxexActiveTillMessage:0,
      displayLoanMessage: true,
      errorMessage:null,
    
    }
  }

  // This function aids user to switch between views of loan messages and till messages
  switchMessageTypeView(){
   // The assumption is that if displayLoanMessage is not true the the till messages are being displayed instead
   this.state.displayLoanMessage? this.setState({displayLoanMessage:false}) : this.setState({displayLoanMessage:true})
  }
  
  nextMessage = (e) => {
    e.preventDefault()
    // Added this check  to fix crash that was happening when the messages state is null
    if(this.state.messages !== null) {
      this.setState({
        indexActiveMessage: (this.state.indexActiveMessage + 1) % this.state.messages.length,
        inxexActiveTillMessage:(this.state.indexActiveMessage + 1) % this.state.messages.length
      })
    }
   
  }

  previousMessage = (e) => {
    e.preventDefault()
    // Added this check  to fix crash that was happening when the messages state is null
    if(this.state.messages !== null) {
      const numberOfMessages = this.state.messages.length
      this.setState({
        //To make modulo operator works properly in case of negative number i.e. so that -1 % 3 = 2. 
        indexActiveMessage: ((((this.state.indexActiveMessage - 1) % numberOfMessages) + numberOfMessages) % numberOfMessages) 
      })
    }
   
  }
 
   async componentDidMount() {
    await Promise.all([
      api.fetchInboxMessages().then(res => {this.setState({messages: res.data})}).catch(err => {this.setState({errorMessage: err})}),
      api.fetchInboxTillMessages().then(res => {this.setState({tillMessages: res.data})}).catch(err => {this.setState({errorMessage: err})})
    ]); 
  }

  render() {

    let btn_class = this.state.displayLoanMessage ? "show-till-msg-button" : "show-loan-msg-button"
    let view_btn_text = this.state.displayLoanMessage ? "View Till Messages" : "View Loan Messages"
    let preview_text = this.state.displayLoanMessage ? "Loan Messages" : "Till Messages"
  
    return (
      <div className="Inbox">
        <div className="inbox-row">        
          <span className="title">Inbox</span>
          <div className="inbox-buttons">
          <button className={btn_class}  onClick={this.switchMessageTypeView.bind(this)}>{view_btn_text}</button>
            <button className="previous"onClick={this.previousMessage}>
              <img src="assets/left_arrow.svg" alt="left-arrow"></img>
            </button>
            <button className="next" onClick={this.nextMessage}>
              <img src="assets/right_arrow.svg" alt="right-arrow"></img>
            </button>
          </div>
        </div>
        <div>
          <span className="title">{preview_text}</span>
         
        </div>

        {/* Conditional rendering based on what the user would like to use */}

        {this.state.displayLoanMessage ? <Message 
        messages={this.state.messages}
        errorMessage = {this.state.errorMessage}
        indexActiveMessage={this.state.indexActiveMessage}/> : <TillMessage
        tillMessages={this.state.tillMessages}
        errorMessage = {this.state.errorMessage}
        indexActiveMessage={this.state.indexActiveMessage}/> }

        <ActionButton
        // Pass the correct props depending on whether user wants to see loan messages or till messages
          messages={this.state.displayLoanMessage ? this.state.messages : this.state.tillMessages}
          indexActiveMessage={this.state.indexActiveMessage}
        />
      
      </div>
    );
  }
}

export default Inbox;
