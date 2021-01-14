import { useState } from "react";
import { Segment, Accordion, Header, Icon, Image, List } from "semantic-ui-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const MetaPanel = ({ currentRoom, isPrivateRoom, userPosts }) => {
  const [room] = useState(currentRoom);
  const [privateRoom] = useState(isPrivateRoom);
  const [activeIndex, setActiveIndex] = useState(0);

  const setActive = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const formatCount = (num) => (num > 1 || num === 0 ? `${num} posts` : `${num} post`);

  const displayTopPosters = (posts) =>
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 3);

  if (privateRoom) return null;

  return (
    <Segment>
      <Header as="h3" attached="top" textAlign="center">
        About
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title active={activeIndex === 0} index={0} onClick={setActive}>
          <Icon name="dropdown" />
          <Icon name="info" />
          Room Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0} className="accordion-text">
          {room?.details}
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 1} index={1} onClick={setActive}>
          <Icon name="dropdown" />
          <Icon name="user circle" />
          Top Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <List>{userPosts && displayTopPosters(userPosts)}</List>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 2} index={2} onClick={setActive}>
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created {dayjs(room?.createdBy.timestamp).fromNow()} by
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Header as="h5">
            <Image circular src={room?.createdBy.avatar} />
            {room?.createdBy.name}
          </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
};

export default MetaPanel;
