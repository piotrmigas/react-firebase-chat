import { useState } from "react";
import { auth, db } from "../../firebase";
import { Grid, Header, Icon, Image } from "semantic-ui-react";

const UserPanel = ({ currentUser }) => {
  const [user] = useState(currentUser);

  const handleSignout = () => {
    auth.signOut();
    db.ref("presence").child(user.uid).remove();
  };

  return (
    <Grid style={{ width: "100%" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          <Header inverted floated="left" as="h3">
            <Icon name="chat" />
            <Header.Content>Welcome to Chat</Header.Content>
            <Icon name="power off" onClick={handleSignout} />
          </Header>
          <Header as="h4" icon inverted textAlign="center">
            <Image src={user?.photoURL} style={{ margin: "10px 0" }} avatar />
            <Header.Content>{user?.displayName}</Header.Content>
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
