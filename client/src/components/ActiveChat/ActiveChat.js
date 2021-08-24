import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Avatar, Box} from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  },

  avatar: {
    height: 20,
    width: 20,
    marginRight: 2,
    marginTop: 10,
    float: "right"
  }

}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user } = props;
  const conversation = props.conversation || {};

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Box>
              {(conversation.messages[conversation.messages.length-1]?.hasBeenRead === true &&
              conversation.messages[conversation.messages.length-1]?.senderId === user.id) &&
              <Avatar alt={conversation.otherUser.username} src={conversation.otherUser.photoUrl} className={classes.avatar}/>}
            </Box>
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
        state.conversations &&
        state.conversations.find(
            (conversation) => conversation.otherUser.username === state.activeConversation
        )
  };
};

export default connect(mapStateToProps, null)(ActiveChat);
