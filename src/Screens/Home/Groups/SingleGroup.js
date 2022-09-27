import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Pressable,
} from 'react-native';
import {ListItem, CheckBox, Avatar} from 'react-native-elements';

const RenderGroupMembers = ({groupMembers}) => {
  if (groupMembers) {
    // console.log('hhhh', groupMembers.users.length);
    return (
      <View style={styles.groupMembersContent}>
        {groupMembers.users.map((user, index) => (
          <View key={index}>
            {index < 3 ? (
              <View>
                <Image
                  style={styles.memberImage}
                  source={require('../../../assets/drawer/userImage.png')}
                />
              </View>
            ) : (
              <></>
            )}
          </View>
        ))}
        {groupMembers.users.length > 3 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1.5,
              borderRadius: 50,
              borderColor: '#20232a',
            }}>
            <Text
              style={{
                fontSize: 10,
                paddingHorizontal: '1%',
                fontWeight: 'bold',
              }}>
              +{groupMembers.users.length - 3}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  }
  return (
    <Image
      style={styles.memberImage}
      source={require('../../../assets/images/onboarding/1.png')}
    />
  );
};

const SingleGroup = ({item}, navigation) => {
  const onPressHandler = () => {
    navigation.navigate('GroupDetail', {
      groupId: item._id,
      groupName : item.groupName
    });
  };

  const onLongPressHandler = () => {
    console.log(item.groupName);
    Alert.alert('Hello', 'onlongPress');
  };
  return (
    <Pressable
      onPress={onPressHandler}
      onLongPress={() => onLongPressHandler()}>
      <View style={[styles.itemContainer, {backgroundColor: '#999'}]}>
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar
              containerStyle={{height: 20, width: 20}}
              avatarStyle={{borderRadius: 50}}
              source={require('../../../assets/images/onboarding/1.png')}
            />

            <View style={{paddingHorizontal: '5%', width: '80%'}}>
              <Text numberOfLines={1} style={styles.itemName}>
                {item.groupName}
              </Text>
              {/* <Text style={styles.itemCode}>{item.invitiDescription}</Text> */}
            </View>
          </View>
          <View style={styles.subtitleView}>
            <RenderGroupMembers groupMembers={item} />
            <Text style={styles.ratingText}>5 months </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default SingleGroup;

const styles = StyleSheet.create({
  itemContainer: {
    width: '96%',
    margin: '2%',
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: '1%',
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

  subtitleView: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  mainImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
  },
  groupMembersContent: {
    flexDirection: 'row',
  },
  memberImage: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
});
