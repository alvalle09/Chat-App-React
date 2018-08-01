import React from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'

/* const DUMMY_DATA = [
    { senderId: 'Phred',   text: 'Hi! You there?' },
    { senderId: 'janedoe', text: "Yes, How about you?" },
    { senderId: 'Phred',   text: "Good to hear from you" }
] */

class MessageList extends React.Component {

    componentWillUpdate() {   /// called before component will update
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight

    }

    componentDidUpdate() {  //lifecylcle method in react, called after component has been updated
        if (this.shouldScrollToBottom) {
            const node = ReactDOM.findDOMNode(this)
            node.scrollTop = node.scrollHeight
        }        
    }

    render() {
        if (!this.props.roomId) {
            return (
                <div className="message-list">
                    <div className="join-room">
                        &larr; Join a room!
                    </div>
                </div>
            )
        }
        return (
            <div className="message-list">
               {this.props.messages.map(( message , index) => {
                    return (
                        <Message key={message.id} username={message.senderId} text={message.text} />                        
                    )
               })}
            </div>
        )
    }
}

export default MessageList