import React, {useState, useRef} from 'react';
import {ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Message from './Message';

const MessagesList = ({onSwipeToReply}) => {
  const messages = useSelector(state => state.chat);

  const user = useRef(0);
  const scrollView = useRef();

  return (
    <ScrollView
      style={{backgroundColor: '#fff', flex: 1}}
      ref={ref => (scrollView.current = ref)}
      onContentChange={() => {
        scrollView.current.scrollToEnd({animated: true});
      }}>
      {messages.map((message, index) => (
        <Message
          key={index}
          time={message.time}
          isLeft={message.user !== user.current}
          message={message.content}
          onSwipe={onSwipeToReply}
        />
      ))}
    </ScrollView>
  );
};

export default MessagesList;
