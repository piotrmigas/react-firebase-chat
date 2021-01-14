import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Rooms from "./Rooms";
import DirectMessages from "./DirectMessages";

const SidePanel = ({ currentUser }) => {
  return (
    <Menu inverted size="large" color="black" fixed="left" vertical style={{ fontSize: "1.2rem" }}>
      <UserPanel currentUser={currentUser} />
      <Rooms currentUser={currentUser} />
      <DirectMessages currentUser={currentUser} />
    </Menu>
  );
};

export default SidePanel;
