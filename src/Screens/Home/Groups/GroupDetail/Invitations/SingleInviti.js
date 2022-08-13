import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Avatar} from 'react-native-elements';

const SingleInviti = ({item}, navigation) => {
  const onPressHandler = () => {
    Alert.alert('Hello', 'onPress');
  };

  const onLongPressHandler = () => {
    Alert.alert('Hello', 'onlongPress');
  };

  return (
    <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar
          containerStyle={{height: 50, width: 50}}
          avatarStyle={{borderRadius: 50}}
          source={require('../../../../../assets/images/onboarding/1.png')}
        />

        <View style={{paddingHorizontal: '5%', width: '80%'}}>
          <Text numberOfLines={1} style={styles.itemName}>
            {item.name}
          </Text>
          <Text style={styles.itemCode}>{item.subtitle}</Text>
        </View>
      </View>
    </View>
  );
};

export default SingleInviti;

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
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
