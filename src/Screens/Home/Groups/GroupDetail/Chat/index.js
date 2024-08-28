import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {View, RefreshControl, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Button, useTheme, Dialog, Portal, PaperProvider, Text} from 'react-native-paper';
import {
  useGetAllMessagesQuery,
  useAddNewMessageMutation,
  useDeleteMessagesMutation,
} from '../../../../../redux/reducers/groups/chat/chatThunk';
import ChatInput from './ChatInput';
import Message from './Message';
import {baseURL} from '../../../../../redux/axios';
import {FlashList} from '@shopify/flash-list';
import {
  deleteselectedMessageIds,
  isConfirmDialogVisibleHandler,
  messagesHandler,
} from '../../../../../redux/reducers/groups/chat/chatSlice';
import ChatHeader from '../../../../../Components/Appbars/ChatAppbar';
// for socket.io
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';

const MessagesScreen = ({route}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const theme = useTheme();
  const listRef = useRef();
  const {isHeader} = route.params;
  const [newMessage, setNewMessage] = useState('');
  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);

  const messagesFromRedux = useSelector(state => state.chat?.messages);

  const {data, isLoading, refetch, isFetching, isError, error} = useGetAllMessagesQuery({
    groupId: currentViewingGroup?._id,
  });

  const [addNewMessage, {isLoading: addNewMessageLoading}] = useAddNewMessageMutation();

  // socket

  const ENDPOINT = baseURL;
  let socket;
  const [socket1, setSocket1] = useState(null);

  useLayoutEffect(() => {
    socket = io(ENDPOINT);
    socket?.emit('setup', currentLoginUser);
    socket?.emit('join chat', currentViewingGroup._id);

    setSocket1(io(ENDPOINT));
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(messagesHandler(data));
    }
  }, [data]);

  useEffect(() => {
    socket?.on('message received', newMessageReceived => {
      if (currentViewingGroup?._id !== newMessageReceived?.group?._id) {
        return;
      }
      dispatch(messagesFromRedux([newMessageReceived, ...messagesFromRedux]));
    });
  }, [messagesFromRedux]);

  // end

  const handleAddNewMessage = () => {
    setNewMessage('');
    dispatch(
      messagesHandler([
        {
          _id: Math.floor(Math.random() * 100) + 1,
          content: newMessage,
          addedBy: currentLoginUser,
          group: currentViewingGroup,
          createdAd: new Date(),
        },
        ...messagesFromRedux,
      ]),
    );

    addNewMessage({
      content: newMessage,
      groupId: currentViewingGroup?._id,
      addedBy: currentLoginUser?._id,
    })
      .then(res => {
        socket1?.emit('new message', res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  // delete message dialog
  const isConfirmDialogVisible = useSelector(state => state.chat?.isConfirmDialogVisible);
  const selectedMessageIds = useSelector(state => state.chat?.selectedMessageIds);
  const selectedMessages = useSelector(state => state.chat?.selectedMessages);

  const [deleteMessages, {isLoading: deleteMessageLoading}] = useDeleteMessagesMutation();

  const deleteMessgeHandler = () => {
    dispatch(deleteselectedMessageIds());
    deleteMessages({
      groupId: currentViewingGroup._id,
      userId: currentLoginUser._id,
      messages: selectedMessages,
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <View style={{flexGrow: 1}}>
      {isHeader && <ChatHeader deleteMessageHandler={deleteMessgeHandler} />}

      <View style={{flex: 1}}>
        <Portal>
          <Dialog
            visible={isConfirmDialogVisible}
            onDismiss={() =>dispatch(isConfirmDialogVisibleHandler(false))}>
            <Dialog.Title>{t("Delete")} {selectedMessageIds.length} {t("messages")}</Dialog.Title>
            <Dialog.Actions>
              <Button onPress={() => dispatch(isConfirmDialogVisibleHandler(false))}>{t("Cancel")}</Button>
              <Button onPress={deleteMessgeHandler}>{t("Delete")}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {isLoading ? (
          <View style={{margin: '5%'}}>
            {[1, 2].map((item, index) => (
              <View key={index} style={{marginTop: '3%'}}>
                <SkeletonPlaceholder height="100%" borderRadius={4}>
                  <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                    <SkeletonPlaceholder.Item width={50} height={50} borderRadius={50} />
                    <SkeletonPlaceholder.Item width="100%" marginLeft={20}>
                      <SkeletonPlaceholder.Item width="60%" height={10} />
                      <SkeletonPlaceholder.Item marginTop={7} width="30%" height={8} />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              </View>
            ))}

            {[1, 2, 3].map((item, index) => (
              <View key={index} style={{marginTop: '3%'}}>
                <SkeletonPlaceholder height="100%" borderRadius={4}>
                  <SkeletonPlaceholder.Item flexDirection="row-reverse" alignItems="center">
                    <SkeletonPlaceholder.Item width={50} height={50} borderRadius={50} />
                    <SkeletonPlaceholder.Item width="100%" marginRight={20}>
                      <SkeletonPlaceholder.Item alignSelf="flex-end" width="60%" height={10} />
                      <SkeletonPlaceholder.Item
                        marginTop={7}
                        width="30%"
                        height={8}
                        alignSelf="flex-end"
                      />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              </View>
            ))}

            {[1, 2, 3].map((item, index) => (
              <View key={index} style={{marginTop: '3%'}}>
                <SkeletonPlaceholder height="100%" borderRadius={4}>
                  <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                    <SkeletonPlaceholder.Item width={50} height={50} borderRadius={50} />
                    <SkeletonPlaceholder.Item width="100%" marginLeft={20}>
                      <SkeletonPlaceholder.Item width="60%" height={10} />
                      <SkeletonPlaceholder.Item marginTop={7} width="30%" height={8} />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              </View>
            ))}

            {[1, 2].map((item, index) => (
              <View key={index} style={{marginTop: '3%'}}>
                <SkeletonPlaceholder height="100%" borderRadius={4}>
                  <SkeletonPlaceholder.Item flexDirection="row-reverse" alignItems="center">
                    <SkeletonPlaceholder.Item width={50} height={50} borderRadius={50} />
                    <SkeletonPlaceholder.Item width="100%" marginRight={20}>
                      <SkeletonPlaceholder.Item alignSelf="flex-end" width="60%" height={10} />
                      <SkeletonPlaceholder.Item
                        marginTop={7}
                        width="30%"
                        height={8}
                        alignSelf="flex-end"
                      />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              </View>
            ))}
          </View>
        ) : (
          <FlashList
            data={messagesFromRedux}
            keyExtractor={item => item._id}
            estimatedItemSize={150}
            initialNumToRender={10}
            ref={listRef}
            ListEmptyComponent={() => (
              <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                  source={require('../../../../../assets/images/groupDetails/Messages-empty.png')}
                />
                <Text>{t("Chat will be available in future versions")}</Text>
                
                {/* <Text>{t("Send message to start conversation")}</Text>
                <Text>{t("or")}</Text>
                <Button icon="refresh" mode="contained" style={{marginTop: '5%'}} onPress={refetch}>
                  {t("Refresh")}
                </Button> */}
              </View>
            )}
            disableAutoLayout={true}
            inverted={messagesFromRedux.length !== 0 ? true : false}
            renderItem={({item}) => (
              <Message item={item} currentLoginUser={currentLoginUser} theme={theme} />
            )}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          />
        )}
      </View>

      {/* <ChatInput
        message={newMessage}
        setMessage={setNewMessage}
        handleAddNewMessage={handleAddNewMessage}
      /> */}
    </View>
  );
};

export default MessagesScreen;
