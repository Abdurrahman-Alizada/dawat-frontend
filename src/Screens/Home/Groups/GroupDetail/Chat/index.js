import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';

import ChatInput from './ChatInput';
import MessagesList from './MessagesList';

const MessagesScreen = ({navigation, route}) => {
  const {groupId} = route.params;
  const [reply, setReply] = useState('');
  const [isLeft, setIsLeft] = useState();

  const swipeToReply = (message, isLeft) => {
    setReply(message.length > 50 ? message.slice(0, 20) + '...' : message);
    setIsLeft(isLeft);
  };

  const closeReply = () => {
    setReply('');
  };

  return (
    <View style={{flexGrow: 1}}>
      <MessagesList onSwipeToReply={swipeToReply} groupId={groupId} />
      <ChatInput
        groupId={groupId}
        reply={reply}
        isLeft={isLeft}
        closeReply={closeReply}
        username={'user name'}
      />
    </View>
  );
};

export default MessagesScreen;
