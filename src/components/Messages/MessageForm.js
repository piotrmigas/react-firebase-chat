import { Component } from "react";
import { v4 } from "uuid";
import { storage, db, timestamp } from "../../firebase";
import { Segment, Label, Input } from "semantic-ui-react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import FileModal from "./FileModal";

class MessageForm extends Component {
  state = {
    storageRef: storage.ref(),
    typingRef: db.ref("typing"),
    message: "",
    room: this.props.currentRoom,
    user: this.props.currentUser,
    modal: false,
    emojiPicker: false,
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.sendMessage();
    }

    const { message, typingRef, room, user } = this.state;

    if (message) {
      typingRef.child(room.id).child(user.uid).set(user.displayName);
    } else {
      typingRef.child(room.id).child(user.uid).remove();
    }
  };

  handleTogglePicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  };

  handleAddEmoji = (emoji) => {
    this.setState({ message: this.state.message + emoji.native, emojiPicker: false });
    setTimeout(() => this.messageInputRef.focus(), 0);
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  sendMessage = async () => {
    const { getMessagesRef } = this.props;
    const { message, room, user, typingRef } = this.state;

    if (message) {
      const ref = getMessagesRef().child(room.id);

      await ref.push().set(this.createMessage());

      this.setState({ message: "" });
      typingRef
        .child(room.id)
        .child(user.uid)
        .remove()
        .catch((err) => {
          console.error(err);
        });
    }
  };

  getPath = () => {
    if (this.props.isPrivateRoom) {
      return `private/${this.state.room.id}`;
    } else {
      return "public";
    }
  };

  uploadFile = async (file) => {
    const pathToUpload = this.state.room.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${v4()}.jpg`;
    const fileRef = this.state.storageRef.child(filePath);
    await fileRef.put(file);
    const downloadUrl = await fileRef.getDownloadURL();

    this.sendFileMessage(downloadUrl, ref, pathToUpload);
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const { message, modal, emojiPicker } = this.state;

    return (
      <Segment style={{ position: "fixed", bottom: "16px", marginLeft: "264px", left: 0, right: "355px" }}>
        {emojiPicker && (
          <Picker onSelect={this.handleAddEmoji} showPreview={false} showSkinTones={false} emojiSize={20} perLine={8} />
        )}
        <Input
          fluid
          name="message"
          onChange={(e) => this.setState({ message: e.target.value })}
          onKeyDown={this.handleKeyDown}
          value={message}
          ref={(node) => (this.messageInputRef = node)}
          labelPosition="right"
          placeholder="Write your message..."
        >
          <Label icon={emojiPicker ? "close" : "add"} onClick={this.handleTogglePicker} />
          <input autoComplete="off" />
          <Label color="blue" icon="cloud upload" content="Upload" onClick={() => this.setState({ modal: true })} />
        </Input>
        <FileModal modal={modal} closeModal={() => this.setState({ modal: false })} uploadFile={this.uploadFile} />
      </Segment>
    );
  }
}

export default MessageForm;
