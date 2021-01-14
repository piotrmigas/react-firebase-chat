import { Header, Segment } from "semantic-ui-react";

const MessagesHeader = ({ roomName }) => {
  return (
    <Segment clearing>
      <Header fluid="true" floated="left" as="h2" style={{ marginBottom: 0 }}>
        <span>{roomName}</span>
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
