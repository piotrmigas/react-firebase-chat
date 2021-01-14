export const userReducer = (state = { currentUser: null }, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        currentUser: action.payload.currentUser,
      };
    case "CLEAR_USER":
      return {
        ...state,
      };
    default:
      return state;
  }
};

const roomState = {
  currentRoom: null,
  isPrivateRoom: false,
  userPosts: null,
};

export const roomReducer = (state = roomState, action) => {
  switch (action.type) {
    case "SET_CURRENT_ROOM":
      return {
        ...state,
        currentRoom: action.payload.currentRoom,
      };
    case "SET_PRIVATE_ROOM":
      return {
        ...state,
        isPrivateRoom: action.payload.isPrivateRoom,
      };
    case "SET_USER_POSTS":
      return {
        ...state,
        userPosts: action.payload.userPosts,
      };
    default:
      return state;
  }
};
