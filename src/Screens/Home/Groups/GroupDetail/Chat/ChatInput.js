import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput, useTheme} from 'react-native-paper';

const ChatInput = ({message, setMessage, handleAddNewMessage}) => {
  const {t} = useTranslation();
  const theme = useTheme()
  return (
    <View style={{
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <KeyboardAvoidingView style={styles.innerContainer}>
        <View
          style={{
            backgroundColor: '#f0f0f0',
            flex: 3,
            marginRight: 10,
            paddingVertical: Platform.OS === 'ios' ? 10 : 0,
            borderRadius: 30,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <TextInput
            multiline
            placeholder={t('Type something...')}
            underlineColor={'transparent'}
            activeUnderlineColor={'transparent'}
            style={{
              fontSize: 15,
              maxHeight: 150,
              backgroundColor: 'transparent',
              width:"100%"
            }}
            value={message}
            onChangeText={text => setMessage(text)}
          />
        </View>
        <TouchableOpacity
          disabled={message ? false : true}
          onPress={handleAddNewMessage}
          style={{
            backgroundColor: message ? '#003153' : '#d4cfcf',
            borderRadius: 50,
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name="send"
            style={{
              transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
            }}
            size={23}
            color="#fff"
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    // borderTopWidth:1
  },
  replyContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  closeReply: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  reply: {
    marginTop: 5,
  },
  innerContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  inputAndMicrophone: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    borderRadius: 30,
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    color: '#000',
    flex: 1,
    fontSize: 15,
    height: '10%',
    maxHeight: 150,
  },
  rightIconButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
  },
  swipeToCancelView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  swipeText: {
    color: '#9f9f9f',
    fontSize: 15,
  },
  emoticonButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  recordingActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  recordingTime: {
    color: '#9f9f9f',
    fontSize: 20,
    marginLeft: 5,
  },
  microphoneAndLock: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  lockView: {
    backgroundColor: '#eee',
    width: 60,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 130,
    paddingTop: 20,
  },
  sendButton: {
    backgroundColor: '#003153',
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatInput;
