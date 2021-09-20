import React from 'react';
import moment from 'moment';
import '../Inbox.css';

function TillMessage({tillMessages,indexActiveMessage,errorMessage, }) {

  // separate component for till messages jusy incase in the future till messages need to appear differently e.g a diagram is added

        let  calculateTimeSince = (date) => {
        let then = moment(date)
        let now = moment()
        if (now.diff(then, 'minutes') < 60) return now.diff(then, 'minutes') + "m ago"
        if (now.diff(then, 'hours') < 24) return now.diff(then, 'hours') + "h ago"
        return now.diff(then, 'days') + "d ago"
      }

      if (!tillMessages) {
        return (
          <div className="Message">
           <h4>Error Loading Messages {errorMessage}</h4>
          </div>
        )
      }
  
      if (tillMessages.length === 0) {
        return (
          <div className="Message">
            <h4>No new messages.</h4>
          </div>
        )
      }
  
      const message = tillMessages[indexActiveMessage]
      const { type, amount, user, info: {dates: {timestamp}} } = message


    return (
        <div className="Message">
        <div className="inbox-row grey-text">
          <span>{indexActiveMessage + 1} of {tillMessages.length}</span>
          <span>{calculateTimeSince(timestamp)}</span>
        </div>
        <h2>{user} applied for a {type} with a total amount of KES {amount.toLocaleString()}</h2>
      </div>
    );
}

export default TillMessage;