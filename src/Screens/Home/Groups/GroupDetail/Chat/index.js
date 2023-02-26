import React, {useRef, useState} from 'react';
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

const MessagesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const listRef = useRef();
  const [newMessage, setNewMessage] = useState('');

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const {data: messages, isLoading, refetch, isFetching, isError, error} =
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
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  
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
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
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
