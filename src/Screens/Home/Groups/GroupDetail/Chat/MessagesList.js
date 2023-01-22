import AsyncStorage from '@react-native-community/async-storage';
import React, {useRef, useEffect} from 'react';
import {ScrollView, Text, View, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {allMessages} from '../../../../../redux/reducers/groups/chat/chatThunk';

import Message from './Message';

const MessagesList = ({onSwipeToReply, groupId}) => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.chat.messages);
  // console.log("messags are", messages[0].addedBy._id)
  const user = useRef(0);
  const scrollViewRef = useRef(null);

  let listViewRef;
  const downButtonHandler = () => {
    listViewRef?.scrollToEnd({animated: true});
  };
  let userId = '';
  const getUser = async () => {
    userId = await AsyncStorage.getItem('userId');
  };
  const getAllMessages = async () => {
    const token = await AsyncStorage.getItem('token');
    dispatch(allMessages({groupId: groupId, token}));
  };
  useEffect(() => {
    getUser();
    downButtonHandler();
    getAllMessages();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {messages.length > 0 ? (
        <ScrollView
          style={{backgroundColor: '#fff', flex: 1}}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd();
          }}>
          {messages?.map((message, index) => (
            <Message
              key={index}
              addedBy={message.addedBy}
              time={message.createdAt}
              userId={message.addedBy?._id}
              message={message.content}
              onSwipe={onSwipeToReply}
              pic={message.pic}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image 
          source={require('../../../../../assets/images/groupDetails/Messages-empty.png')}
          />
          <Text>Send message to start conversation</Text>
        </View>
      )}
    </View>
  );
};

export default MessagesList;
