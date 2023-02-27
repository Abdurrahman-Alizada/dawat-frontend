import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Button, useTheme} from 'react-native-paper';
import {
  useGetAllMessagesQuery,
  useAddNewMessageMutation,
} from '../../../../../redux/reducers/groups/chat/chatThunk';
import ChatInput from './ChatInput';
import Message from './Message';
import { baseURL } from '../../../../../redux/axios';
// for socket.io
import io from "socket.io-client";

const MessagesScreen = ({navigation}) => {
  
  const dispatch = useDispatch();
  const theme = useTheme();
  const listRef = useRef();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const {data, isLoading, refetch, isFetching, isError, error} =
    useGetAllMessagesQuery({groupId: currentViewingGroup?._id});

    const [addNewMessage, {isLoading: addNewMessageLoading}] =
    useAddNewMessageMutation();

  const handleAddNewMessage = () => {
    setNewMessage('');
    addNewMessage({
      content: newMessage,
      groupId: currentViewingGroup?._id,
      addedBy: currentLoginUser?._id,
    })
      .then(res => {
        socket.emit("new message", res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };
     

  // socket

  const ENDPOINT = baseURL;
  let socket, selectedChatCompare;

   useLayoutEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", currentLoginUser);
    socket.emit("join chat", currentViewingGroup._id);
  },[])

  useEffect(()=>{
    if(data){
      setMessages(data)
    }
  },[data])

  useEffect(()=>{
    socket?.on("message received", (newMessageReceived) => {
      console.log("new message", newMessageReceived.content)
     setMessages(prevState => [...prevState, newMessageReceived])
    });
  },[messages])

  // end

  return (
    <View style={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        {isLoading ? (
          <View style={{margin: '5%'}}>
            {[1, 2, 3, 4].map((item, index) => (
              <View key={index} style={{marginTop: '3%'}}>
                <SkeletonPlaceholder height="100%" borderRadius={4}>
                  <SkeletonPlaceholder.Item
                    flexDirection="row"
                    alignItems="center">
                    <SkeletonPlaceholder.Item
                      width={50}
                      height={50}
                      borderRadius={50}
                    />
                    <SkeletonPlaceholder.Item width="100%" marginLeft={20}>
                      <SkeletonPlaceholder.Item width="60%" height={10} />
                      <SkeletonPlaceholder.Item
                        marginTop={7}
                        width="30%"
                        height={8}
                      />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={messages}
            // keyExtractor={item => item._id}
            // initialNumToRender={10} 
            ref={listRef}
            ListEmptyComponent={() => (
              <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                  source={require('../../../../../assets/images/groupDetails/Messages-empty.png')}
                />
                <Text>Send message to start conversation</Text>
                <Text>or</Text>
                <Button
                  icon="refresh"
                  mode="contained"
                  style={{marginTop: '5%'}}
                  onPress={refetch}>
                  Refresh
                </Button>
              </View>
            )}
            onContentSizeChange={() => {
              listRef.current?.scrollToEnd();
            }}
            renderItem={({item}) => (
              <Message
                item={item}
                currentLoginUser={currentLoginUser}
                theme={theme}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          />
        )}
      </View>

      <ChatInput
        message={newMessage}
        setMessage={setNewMessage}
        handleAddNewMessage={handleAddNewMessage}
      />
    </View>
  );
};

export default MessagesScreen;
