import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Avatar} from 'react-native-paper';

const SingleInviti = ({item}, navigation) => {
  const onPressHandler = () => {
    Alert.alert('Hello', 'onPress');
  };

  const onLongPressHandler = () => {
    Alert.alert('Hello', 'onlongPress');
  };

  return (
    <View style={[styles.itemContainer, {backgroundColor: "#999"}]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar
          containerStyle={{height: 60, width: 60}}
          avatarStyle={{borderRadius: 20}}
          source={item.invitiImageURL ? invitiImageURL : require('../../../../../assets/images/onboarding/1.png')}
        />

        <View style={{paddingHorizontal: '5%', width: '80%'}}>
          <Text numberOfLines={1} style={styles.itemName}>
            {item.invitiName}
          </Text>
          <Text style={styles.itemCode}>{item.invitiDescription}</Text>
        </View>
      </View>
    </View>
  );
};

export default SingleInviti;

const styles = StyleSheet.create({
  
  itemContainer: {
    width:"48%",
    marginHorizontal:"1%",
    marginVertical:"0.5%",
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: 10,
    height: 90,
    alignItems: 'baseline',
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});
