import React, {Fragment} from "react";
import {Avatar, Box, makeStyles} from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";


const useStyles = makeStyles(() => ({
  avatar: {
    height: 20,
    width: 20,
    marginRight: 2,
    marginTop: 10,
    float: "right"
  }

}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;
  let lastReadIndex;
  for(let i = messages.length - 1; i >= 0; i--){
    if(messages[i].senderId === userId && messages[i].readStatus){
      lastReadIndex = i;
      break;
    }
  }
  return (
    <Box>
      {messages.map((message, i) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
            <Fragment key={message.id}>
              <SenderBubble key={message.id} text={message.text} time={time} />
              {i === lastReadIndex && <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}/>}
            </Fragment>

        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
