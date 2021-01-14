import { Component } from "react";
import { db, timestamp } from "../../firebase";
import { setCurrentRoom, setPrivateRoom } from "../../redux/actions";
import { Menu, Icon, Modal, Form, Input, Button, Label } from "semantic-ui-react";
import { connect } from "react-redux";

class Rooms extends Component {
  state = {
    activeRoom: "",
    user: this.props.currentUser,
    room: null,
    rooms: [],
    roomName: "",
    roomDetails: "",
    roomsRef: db.ref("rooms"),
    messagesRef: db.ref("messages"),
    typingRef: db.ref("typing"),
    notifications: [],
    modal: false,
    firstLoad: true,
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedRooms = [];
    this.state.roomsRef.on("child_added", (snap) => {
      loadedRooms.push(snap.val());
      this.setState({ rooms: loadedRooms }, () => this.setFirstRoom());
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = (roomId) => {
    this.state.messagesRef.child(roomId).on("value", (snap) => {
      if (this.state.room) {
        this.handleNotifications(roomId, this.state.room.id, this.state.notifications, snap);
      }
    });
  };

  handleNotifications = (roomId, currentRoomId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex((notification) => notification.id === roomId);

    if (index !== -1) {
      if (roomId !== currentRoomId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: roomId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }

    this.setState({ notifications });
  };

  removeListeners = () => {
    this.state.roomsRef.off();
    this.state.rooms.forEach((room) => {
      this.state.messagesRef.child(room.id).off();
    });
  };

  setFirstRoom = () => {
    const firstRoom = this.state.rooms[0];
    if (this.state.firstLoad && this.state.rooms.length > 0) {
      this.props.setCurrentRoom(firstRoom);
      this.setActiveRoom(firstRoom);
      this.setState({ room: firstRoom });
    }
    this.setState({ firstLoad: false });
  };

  addRoom = () => {
    const { roomsRef, roomName, roomDetails, user } = this.state;
    const key = roomsRef.push().key;

    const newRoom = {
      id: key,
      name: roomName,
      details: roomDetails,
      createdBy: {
        name: user?.displayName,
        avatar: user?.photoURL,
        timestamp,
      },
    };

    roomsRef
      .child(key)
      .update(newRoom)
      .then(() => {
        this.setState({ roomName: "", roomDetails: "" });
        this.setState({ modal: false });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addRoom();
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changeRoom = (room) => {
    this.setActiveRoom(room);
    this.state.typingRef.child(this.state.room.id).child(this.state.user.uid).remove();
    this.clearNotifications();
    this.props.setCurrentRoom(room);
    this.props.setPrivateRoom(false);
    this.setState({ room });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex((notification) => notification.id === this.state.room.id);

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  setActiveRoom = (room) => {
    this.setState({ activeRoom: room.id });
  };

  getNotificationCount = (room) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === room.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  displayRooms = (rooms) =>
    rooms.length > 0 &&
    rooms.map((room) => (
      <Menu.Item
        key={room.id}
        onClick={() => this.changeRoom(room)}
        name={room.name}
        style={{ opacity: 0.7 }}
        active={room.id === this.state.activeRoom}
      >
        # {room.name}
        {this.getNotificationCount(room) && <Label color="red">{this.getNotificationCount(room)}</Label>}
      </Menu.Item>
    ));

  isFormValid = ({ roomName, roomDetails }) => roomName && roomDetails;

  render() {
    const { rooms, modal } = this.state;

    return (
      <>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> ROOMS
            </span>{" "}
            ({rooms.length}) <Icon name="add" onClick={() => this.setState({ modal: true })} />
          </Menu.Item>
          {this.displayRooms(rooms)}
        </Menu.Menu>
        <Modal basic open={modal} onClose={() => this.setState({ modal: false })}>
          <Modal.Header>Add a Room</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input fluid label="Name of Room" name="roomName" onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <Input fluid label="About the Room" name="roomDetails" onChange={this.handleChange} />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={() => this.setState({ modal: false })}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default connect(null, { setCurrentRoom, setPrivateRoom })(Rooms);
