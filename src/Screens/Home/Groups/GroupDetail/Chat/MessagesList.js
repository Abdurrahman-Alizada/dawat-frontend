import React, {useState, useRef, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import { allMessages } from '../../../../../redux/reducers/groups/chat/chatThunk';

import Message from './Message';

const MessagesList = ({onSwipeToReply}) => {
  const dispatch = useDispatch()
  const messages = useSelector(state => state.chat.messages);

  const user = useRef(0);
  const scrollViewRef = useRef(null);

  let listViewRef;
  const downButtonHandler = () => {
    listViewRef?.scrollToEnd({ animated: true });
  };

  useEffect(()=>{
    downButtonHandler()
    dispatch(allMessages())
  }, [])

  return (
    <ScrollView
      style={{backgroundColor: '#fff', flex: 1}}
      ref={scrollViewRef} onContentSizeChange={() => {scrollViewRef.current?.scrollToEnd()}}
      
      >
      {messages?.map((message, index) => (
        <Message
          key={index}
          time={message.createdAt}
          isLeft={message.user !== user.current}
          message={message.content}
          onSwipe={onSwipeToReply}
          pic={message.pic}
        />
      ))}
    </ScrollView>
  );
};

export default MessagesList;
