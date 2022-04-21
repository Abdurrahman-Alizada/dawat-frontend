import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

import ChatInput from "./ChatInput";
import MessagesList from "./MessagesList";

const MessagesScreen = ({ navigation, route }) => {
 
    // const { username, bio, picture, isBlocked, isMuted } = route.params;
	const [reply, setReply] = useState("");
	const [isLeft, setIsLeft] = useState();

	const swipeToReply = (message, isLeft) => {
		setReply(message.length > 50 ? message.slice(0, 30) + '...' : message);
		setIsLeft(isLeft);
	};

	const closeReply = () => {
		setReply("");
	};

	return (
		<View style={{ flexGrow: 1,  }}>
			<MessagesList onSwipeToReply={swipeToReply} />
			<ChatInput reply={reply} isLeft={isLeft} closeReply={closeReply} username={'user name'} />
		</View>
	);
};

export default MessagesScreen;
