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
    if (convo.id === message.conversationId) {
      let copyConvo = { ...convo };
      copyConvo.messages.push(message);
      copyConvo.latestMessageText = message.text;
      //increase unread message only if from another user
      if(copyConvo.otherUser.id === message.senderId){
        copyConvo.unreadMessages++;
      }
      return copyConvo;
    } else {
      return convo;
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

export const readReceivedMessages = (state, conversationId) => {
  return state.map((conversation) => {
    if (conversation.id === conversationId) {
      let copyConversation = { ...conversation };
      copyConversation.unreadMessages = 0;
      return copyConversation;
    } else {
      return conversation;
    }
  });
};

export const readMyMessages = (state, conversationId) => {
  return state.map((conversation) => {
    if (conversation.id === conversationId) {
      let copyConversation = { ...conversation };
      //set last message as read to display avatar icon
      copyConversation.messages[copyConversation.messages.length-1].readStatus = true;
      copyConversation.unreadMessages = 0;
      return copyConversation;
    } else {
      return conversation;
    }
  });
};