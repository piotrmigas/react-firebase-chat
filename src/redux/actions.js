export const setUser = (user) => {
  return {
    type: "SET_USER",
    payload: {
      currentUser: user,
    },
  };
};

export const clearUser = () => {
  return {
    type: "CLEAR_USER",
  };
};

export const setCurrentRoom = (room) => {
  return {
    type: "SET_CURRENT_ROOM",
    payload: {
      currentRoom: room,
    },
  };
};

export const setPrivateRoom = (isPrivateRoom) => {
  return {
    type: "SET_PRIVATE_ROOM",
    payload: {
      isPrivateRoom,
    },
  };
};

export const setUserPosts = (userPosts) => {
  return {
    type: "SET_USER_POSTS",
    payload: {
      userPosts,
    },
  };
};
