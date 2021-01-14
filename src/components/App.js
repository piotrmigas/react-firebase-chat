import "./App.css";
import { Grid } from "semantic-ui-react";
import SidePanel from "./SidePanel";
import { useSelector } from "react-redux";
import Messages from "./Messages";
import MetaPanel from "./MetaPanel";

function App() {
  const { currentUser, currentRoom, isPrivateRoom, userPosts } = useSelector(({ user, room }) => ({
    currentUser: user.currentUser,
    currentRoom: room.currentRoom,
    isPrivateRoom: room.isPrivateRoom,
    userPosts: room.userPosts,
  }));

  return (
    <Grid columns="equal" className="app">
      <SidePanel key={currentUser?.uid} currentUser={currentUser} />
      <Grid.Column style={{ marginLeft: 250 }}>
        <Messages
          key={currentRoom?.id}
          currentRoom={currentRoom}
          currentUser={currentUser}
          isPrivateRoom={isPrivateRoom}
        />
      </Grid.Column>
      <Grid.Column width="4">
        <MetaPanel
          key={currentRoom?.name}
          currentRoom={currentRoom}
          userPosts={userPosts}
          isPrivateRoom={isPrivateRoom}
        />
      </Grid.Column>
    </Grid>
  );
}

export default App;
