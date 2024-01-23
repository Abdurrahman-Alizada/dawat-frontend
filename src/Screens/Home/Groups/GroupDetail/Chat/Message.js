import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Avatar} from 'react-native-paper';
import React, { useEffect } from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  isMessagesSelectedHandler,
  addToselectedMessageIdsHandler,
  removeDeletedMessagesFromArray
} from '../../../../../redux/reducers/groups/chat/chatSlice';

const Message = ({item, currentLoginUser, theme}) => {
  const selectedMessageIds = useSelector(
    state => state.chat.selectedMessageIds,
  );
  const dispatch = useDispatch();

  const messageSelectionHandler = () => {
    dispatch(isMessagesSelectedHandler(true));
    dispatch(addToselectedMessageIdsHandler(item));
  };

  const isMsgIncludeInSelectedArray = selectedMessageIds?.includes(item._id);
  
  
  useEffect(()=>{
    if(item.messageDeletedFor?.includes(currentLoginUser._id)){
      dispatch(removeDeletedMessagesFromArray(item._id))
    }
  },[])

  return (
    <View>
      {item.messageDeletedFor?.includes(currentLoginUser._id) ? null : (
        <Pressable
          onLongPress={messageSelectionHandler}
          style={{
            width: '100%',
            backgroundColor: isMsgIncludeInSelectedArray
              ? theme.colors.surfaceVariant
              : theme.colors.background,
          }}>
          {item?.addedBy?._id === currentLoginUser._id ? (
            <View
              style={{
                padding: 5,
                marginTop: 5,
                alignSelf: 'flex-end',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  padding: 10,
                  marginHorizontal: '1%',
                  maxWidth: '80%',
                  borderRadius: 15,
                  alignSelf: 'flex-end',
                }}>
                <View>
                  <Text style={{fontSize: 16, color: '#fff'}}>
                    {item.content}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#dedede',
                      textAlign: 'left',
                    }}>
                    {moment(item.createdAt).fromNow(true)}
                  </Text>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: theme.colors.primary,
                    width: 20,
                    height: 25,
                    bottom: 0,
                    borderBottomLeftRadius: 25,
                    right: -10,
                  }}></View>

                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: isMsgIncludeInSelectedArray
                      ? theme.colors.primaryContainer
                      : theme.colors.background,
                    width: 20,
                    height: 35,
                    bottom: -6,
                    borderBottomLeftRadius: 18,
                    right: -20,
                  }}></View>
              </View>
              <Avatar.Image
                size={35}
                source={
                  item?.addedBy?.imageURL
                    ? {uri: item?.addedBy?.imageURL}
                    : require('../../../../../assets/drawer/male-user.png')
                }
              />
            </View>
          ) : (
            <View
              style={{
                padding: 5,
                flexDirection: 'row-reverse',
                alignSelf: 'flex-start',
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  backgroundColor: theme.colors.secondary,
                  padding: 10,
                  maxWidth: '80%',
                  marginLeft: '1%',
                  alignSelf: 'flex-start',
                  borderRadius: 15,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: theme.colors.surface,
                      justifyContent: 'center',
                    }}>
                    {item.content}
                  </Text>

                  <Text
                    style={{
                      fontSize: 11,
                      color: theme.colors.surfaceVariant,
                      textAlign: 'right',
                    }}>
                    {moment(item.createdAt).fromNow(true)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.leftArrow,
                    {backgroundColor: theme.colors.secondary},
                  ]}></View>
                <View
                  style={[
                    styles.leftArrowOverlap,
                    {
                      backgroundColor: isMsgIncludeInSelectedArray
                        ? theme.colors.primaryContainer
                        : theme.colors.background,
                    },
                  ]}></View>
              </View>
              <Avatar.Image
                size={35}
                source={
                  item?.addedBy
                    ? {uri: item?.addedBy?.imageURL}
                    : require('../../../../../assets/drawer/male-user.png')
                }
              />
            </View>
          )}
        </Pressable>
      )}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  rightArrow: {
    position: 'absolute',
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: 'absolute',
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },

  /*Arrow head for recevied messages*/
  leftArrow: {
    position: 'absolute',
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20,
  },
});
