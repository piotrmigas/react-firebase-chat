import { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";
import { connect } from "react-redux";
import { setUserPosts } from "../../redux/actions";
import { db } from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import Typing from "./Typing";

class Messages extends Component {
  state = {
    privateRoom: this.props.isPrivateRoom,
    privateMessagesRef: db.ref("privateMessages"),
    messagesRef: db.ref("messages"),
    messages: [],
    room: this.props.currentRoom,
    user: this.props.currentUser,
    usersRef: db.ref("users"),
    typingRef: db.ref("typing"),
    typingUsers: [],
    connectedRef: db.ref(".info/connected"),
    listeners: [],
  };

  componentDidMount() {
    const { room, user, listeners } = this.state;

    if (room && user) {
      this.removeListeners(listeners);
      this.addListeners(room.id);
    }
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
    this.state.connectedRef.off();
  }

  removeListeners = (listeners) => {
    listeners.forEach((listener) => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex((listener) => {
      return listener.id === id && listener.ref === ref && listener.event === event;
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  addListeners = (roomId) => {
    this.addMessageListener(roomId);
    this.addTypingListeners(roomId);
  };

  addTypingListeners = (roomId) => {
    let typingUsers = [];
    this.state.typingRef.child(roomId).on("child_added", (snap) => {
      if (snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val(),
        });
        this.setState({ typingUsers });
      }
    });
    this.addToListeners(roomId, this.state.typingRef, "child_added");

    this.state.typingRef.child(roomId).on("child_removed", (snap) => {
      const index = typingUsers.findIndex((user) => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter((user) => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });
    this.addToListeners(roomId, this.state.typingRef, "child_removed");

    this.state.connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(roomId)
          .child(this.state.user.uid)
          .onDisconnect()
          .remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    });
  };

  addMessageListener = (roomId) => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(roomId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
      });
      this.countUserPosts(loadedMessages);
    });

    this.addToListeners(roomId, ref, "child_added");
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateRoom } = this.state;
    return privateRoom ? privateMessagesRef : messagesRef;
  };

  countUserPosts = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  displayRoomName = (room) => {
    return room ? `${this.state.privateRoom ? "@" : "#"}${room.name}` : "";
  };

  render() {
    const { messagesRef, messages, room, user, privateRoom, typingUsers } = this.state;

    return (
      <>
        <MessagesHeader roomName={this.displayRoomName(room)} isPrivateRoom={privateRoom} />
        <Segment className="messages">
          <Comment.Group>
            {messages.length > 0 &&
              messages.map((message) => <Message key={message.timestamp} message={message} user={this.state.user} />)}
            {typingUsers.length > 0 &&
              typingUsers.map((user) => (
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.2em" }} key={user.id}>
                  <span className="user__typing">{user.name} is typing</span> <Typing />
                </div>
              ))}
            <div ref={(node) => (this.messagesEnd = node)} />
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentRoom={room}
          currentUser={user}
          isPrivateRoom={privateRoom}
          getMessagesRef={this.getMessagesRef}
        />
      </>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);
