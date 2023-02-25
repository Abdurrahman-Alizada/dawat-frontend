import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Avatar} from 'react-native-paper';
import moment from 'moment/moment';
import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';

const Message = ({time, message, onSwipe, addedBy, userId, pic}) => {
  let uId = '';
  const [isLeft, setIsLeft] = useState(false);
  const getUser = async () => {
    uId = await AsyncStorage.getItem('userId');
    if (uId == userId) {
      setIsLeft(false);
    } else {
      setIsLeft(true);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const startingPosition = 0;
  const x = useSharedValue(startingPosition);
  const isOnLeft = type => {
    if (isLeft && type === 'messageContainer') {
      return {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 0,
      };
    } else if (isLeft && type === 'message') {
      return {
        color: '#000',
      };
    } else if (isLeft && type === 'time') {
      return {
        color: 'darkgray',
      };
    } else if (isLeft && type === 'userName') {
      return {
        color: 'darkgray',
        display: 'flex',
      };
    } else {
      return {
        borderTopRightRadius: 0,
      };
    }
  };

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      x.value = isLeft ? 50 : -50;
    },
    onEnd: (event, ctx) => {
      x.value = withSpring(startingPosition);
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value}],
    };
  });

  return (
    <FlingGestureHandler
      direction={Directions.LEFT}
      onGestureEvent={eventHandler}
      onHandlerStateChange={({nativeEvent}) => {
        if (nativeEvent.state === State.ACTIVE) {
          onSwipe(message, isLeft);
        }
      }}>
      <Animated.View style={[styles.container, uas]}>
        <View
          style={{
            flexDirection: isLeft ? 'row' : 'row-reverse',
            marginHorizontal: '2%',
          }}>
          <Avatar.Image
            size={30}
            source={
              pic
                ? {uri: pic}
                : require('../../../../../assets/drawer/male-user.png')
            }
          />
          <View style={[styles.messageContainer, isOnLeft('messageContainer')]}>
            <View>
              <Text
                style={[{fontSize: 12, display: 'none'}, isOnLeft('userName')]}>
                {addedBy?.name}
              </Text>
              <View style={styles.messageView}>
                <Text style={[styles.message, isOnLeft('message')]}>
                  {message}
                </Text>
              </View>

              <View style={styles.timeView}>
                <Text style={[styles.time, isOnLeft('time')]}>
                  {moment(time).startOf('hour').fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </FlingGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginVertical: 5,
  },
  messageContainer: {
    backgroundColor: '#1B5583',
    // alignSelf: 'flex-end',
    // flexDirection: 'row',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: '1%',
    paddingTop: 5,
    paddingBottom: 10,
    maxWidth: '85%',
  },
  messageView: {
    backgroundColor: 'transparent',
    // maxWidth: "88%",
  },
  timeView: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  message: {
    color: 'white',
    alignSelf: 'flex-start',
    fontSize: 15,
  },
  time: {
    color: 'lightgray',
    alignSelf: 'flex-end',
    fontSize: 10,
  },
});

export default Message;
