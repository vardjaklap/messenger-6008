export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessages: 1
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    let copyConvo = Object.assign({}, convo);
    if (copyConvo.id === message.conversationId) {
      copyConvo.messages.push(message);
      copyConvo.latestMessageText = message.text;
      //increase unread message only if from another user
      if(copyConvo.otherUser.id === message.senderId){
        copyConvo.unreadMessages++;
      }
      return copyConvo;
    } else {
      return copyConvo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      convo.id = message.conversationId;
      convo.messages.push(message);
      convo.latestMessageText = message.text;
      return convo;
    } else {
      return convo;
    }
  });
};

export const readReceivedMessages = (state, convoId) => {
  return state.map((convo) => {
    let copyConvo = Object.assign({}, convo);
    if (copyConvo.id === convoId) {
      copyConvo.unreadMessages = 0;
      return copyConvo;
    } else {
      return copyConvo;
    }
  });
};

export const readMyMessages = (state, convoId) => {
  return state.map((convo) => {
    let copyConvo = Object.assign({}, convo);
    if (copyConvo.id === convoId) {
      //set last message as read to display avatar icon
      copyConvo.messages[copyConvo.messages.length-1].hasBeenRead = true;
      copyConvo.unreadMessages = 0;
      return copyConvo;
    } else {
      return copyConvo;
    }
  });
};