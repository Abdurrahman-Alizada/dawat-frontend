import React from 'react';
import {Image, StyleSheet, Text, View, FlatList, Alert} from 'react-native';
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
  // console.log("single item is ..",item)
  const onPressHandler = () => {
    navigation.navigate('GroupDetail', {
      itemId: 2,
      otherParam: 'anything you want here',
    });
  };

  const onLongPressHandler = () => {
    console.log(item._id);
    Alert.alert('Hello', 'onlongPress');
  };

  return (
    <ListItem
      onPress={onPressHandler}
      onLongPress={() => onLongPressHandler()}
      bottomDivider>
      <Avatar
        containerStyle={{height: 50, width: 50}}
        avatarStyle={{borderRadius: 50}}
        // source={{uri: item.avatar_url}}
        source={require('../../../assets/drawer/userImage.png')}
      />
      <ListItem.Content>
        <ListItem.Title>{item.groupName} </ListItem.Title>
        <View style={styles.subtitleView}>
          <RenderGroupMembers groupMembers={item} />

          <Text style={styles.ratingText}>5 months </Text>
        </View>
      </ListItem.Content>
      <CheckBox
        center
        title=""
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={false}
      />
      {/* <ListItem.Chevron /> */}
    </ListItem>
  );
};

export default SingleGroup;

const styles = StyleSheet.create({
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
