import { Comment, Image } from "semantic-ui-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Message = ({ message, user }) => {
  const isImage = (message) => message.hasOwnProperty("image") && !message.hasOwnProperty("text");

  const isOwnUser = (message, user) => (message.user.id === user.uid ? "message__self" : "");

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnUser(message, user)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{dayjs(message.timestamp).fromNow()}</Comment.Metadata>
        {isImage(message) ? (
          <Image src={message.image} style={{ padding: "1em" }} />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
