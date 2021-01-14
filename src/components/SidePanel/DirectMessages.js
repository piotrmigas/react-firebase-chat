import { Component } from "react";
import { connect } from "react-redux";
import { setCurrentRoom, setPrivateRoom } from "../../redux/actions";
import { Menu, Icon } from "semantic-ui-react";
import { db } from "../../firebase";

class DirectMessages extends Component {
  state = {
    activeRoom: "",
    user: this.props.currentUser,
    users: [],
    usersRef: db.ref("users"),
    connectedRef: db.ref(".info/connected"),
    presenceRef: db.ref("presence"),
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.usersRef.off();
    this.state.presenceRef.off();
    this.state.connectedRef.off();
  };

  addListeners = (currentUserUid) => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    this.state.presenceRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  isUserOnline = (user) => user.status === "online";

  changeRoom = (user) => {
    const roomId = this.getRoomId(user.uid);
    const roomData = {
      id: roomId,
      name: user.name,
    };
    this.props.setCurrentRoom(roomData);
    this.props.setPrivateRoom(true);
    this.setActiveRoom(user.uid);
  };

  getRoomId = (userId) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
  };

  setActiveRoom = (userId) => {
    this.setState({ activeRoom: userId });
  };

  render() {
    const { users, activeRoom } = this.state;

    return (
      <Menu.Menu style={{ marginTop: "20px" }}>
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {users.map((user) => (
          <Menu.Item
            key={user.uid}
            active={user.uid === activeRoom}
            onClick={() => this.changeRoom(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon name="circle" color={this.isUserOnline(user) ? "green" : "red"} />@ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentRoom, setPrivateRoom })(DirectMessages);
