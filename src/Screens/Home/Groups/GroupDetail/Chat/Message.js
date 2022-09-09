import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Avatar } from "react-native-elements";
import moment from "moment/moment";
import {
	FlingGestureHandler,
	Directions,
	State,
} from "react-native-gesture-handler";
import Animated, {
	withSpring,
	useAnimatedStyle,
	useAnimatedGestureHandler,
	useSharedValue
} from "react-native-reanimated";

const Message = ({ time, isLeft, message, onSwipe, pic }) => {
	const startingPosition = 0;
	const x = useSharedValue(startingPosition);

	const isOnLeft = (type) => {
		if (isLeft && type === "messageContainer") {
			return {
				alignSelf: "flex-start",
				backgroundColor: "#f0f0f0",
				borderTopLeftRadius: 0,
			};
		} else if (isLeft && type === "message") {
			return {
				color: "#000",
			};
		} else if (isLeft && type === "time") {
			return {
				color: "darkgray",
			};
		} else {
			return {
				borderTopRightRadius: 0,
			};
		}
	};

	const eventHandler = useAnimatedGestureHandler({
		onStart: (event, ctx) => {

		},
		onActive: (event, ctx) => {
			x.value = isLeft ? 50 : -50;
		},
		onEnd: (event, ctx) => {
			x.value = withSpring(startingPosition);
		}
	});

	const uas = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: x.value }]
		}
	});

	return (
		<FlingGestureHandler
			direction={Directions.LEFT}
			onGestureEvent={eventHandler}
			onHandlerStateChange={({ nativeEvent }) => {
				if (nativeEvent.state === State.ACTIVE) {
					onSwipe(message, isLeft);
				}
			}}
		>
			<Animated.View style={[styles.container, uas]}>
			  <View style={{flexDirection: isLeft ?"row" :"row-reverse", marginHorizontal:"2%"}}>
        <Avatar
            activeOpacity={0.2}
            avatarStyle={{}}
            containerStyle={{ backgroundColor: "#BDBDBD" }}
            icon={{}}
            iconStyle={{}}
            imageProps={{}}
            onLongPress={() => alert("onLongPress")}
            onPress={() => alert("onPress")}
            overlayContainerStyle={{}}
            placeholderStyle={{}}
            rounded
            size="small"
            source={{uri: 'https://media.istockphoto.com/photos/macaw-parrot-isolated-on-white-background-picture-id1328860045?b=1&k=20&m=1328860045&s=170667a&w=0&h=o24me3gyECkw5b_iKKrCiyowQYyAaW8q1cx8WUfwfoI='}}
            title="P"
            titleStyle={{}}
          />
      	
        <View
					style={[
						styles.messageContainer,
						isOnLeft("messageContainer"),
					]}
				>
          <View>
					<View style={styles.messageView}>
						<Text style={[styles.message, isOnLeft("message")]}>
							{message}
						</Text>
					</View>
				
        	<View style={styles.timeView}>
						<Text style={[styles.time, isOnLeft("time")]}>
							{moment(time).startOf('hour').fromNow() }
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
		alignSelf: "flex-end",
		flexDirection: "row",
		borderRadius: 15,
		paddingHorizontal: 10,
		marginHorizontal: 10,
		paddingTop: 5,
		paddingBottom: 10,
	},
	messageView: {
		backgroundColor: "transparent",
		// maxWidth: "80%",
	},
	timeView: {
		backgroundColor: "transparent",
		justifyContent: "flex-end",
		paddingLeft: 10,
	},
	message: {
		color: "white",
		alignSelf: "flex-start",
		fontSize: 15,
	},
	time: {
		color: "lightgray",
		alignSelf: "flex-end",
		fontSize: 10,
	},
});

export default Message;