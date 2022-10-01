import React, {useState} from 'react';
import {Pressable, Image, StyleSheet, Text, View, Alert} from 'react-native';
import moment from 'moment';
import { Chip, Card, Paragraph, IconButton} from 'react-native-paper';

const RenderGroupMembers = ({groupMembers}) => {
  if (groupMembers.responsibleAvatars) {
    // console.log('hhhh', groupMembers.users.length);
    return (
      <View style={styles.groupMembersContent}>
        {groupMembers.responsibleAvatars.map((user, index) => (
          <View key={index}>
            {index < 3 ? (
              <View>
                <Image
                  style={styles.memberImage}
                  source={require('../../../../../assets/drawer/userImage.png')}
                  // source={require('../../../../../assets')}
                />
              </View>
            ) : (
              <></>
            )}
          </View>
        ))}
        {groupMembers.responsibleAvatars.length > 3 ? (
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
              +{groupMembers.responsibleAvatars.length - 3}
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
      source={require('../../../../../assets/images/onboarding/1.png')}
    />
  );
};

const SingleTask = ({item}, navigation) => {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  
  const onPressHandler = () => {
    navigation.navigate('GroupDetail', {
      groupId: item._id,
      groupName: item.groupName,
    });
  };

  const onLongPressHandler = () => {
    console.log(item.groupName);
    Alert.alert('Hello', 'onlongPress');
  };

  return (
    <View>
      {/* <Pressable */}
        {/* // onPress={onPressHandler}
        // onLongPress={() => onLongPressHandler()}> */}
        <Card mode="outlined" style={{margin: '3%', backgroundColor: '#fff'}}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: '2%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{}}>
              <Chip
                icon="check"
                // mode="flat"
                mode="outlined"
                onPress={() => Alert.alert('Information chip pressed')}>
                Done
              </Chip>
            </View>

            <IconButton
              icon="dots-horizontal"
              iconColor={'#BDBDBD'}
              size={30}
              onPress={() => console.log('Pressed')}
            />
          </View>
          <Card.Content>
            <Paragraph>Card content</Paragraph>
          </Card.Content>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#BDBDBD',
            }}></View>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Card.Actions style={{justifyContent: 'space-between'}}>
              <Paragraph>
                {moment(20111031).fromNow()} - {moment(new Date()).to()}
              </Paragraph>
            </Card.Actions>
            <Card.Actions style={{justifyContent: 'space-between'}}>
              <RenderGroupMembers groupMembers={item} />
            </Card.Actions>
          </View>
        </Card>
      {/* </Pressable> */}
    </View>
  );
};

export default SingleTask;

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    justifyContent: 'flex-start',
    borderRadius: 5,
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    height: 100,
    alignItems: 'baseline',
  },
  itemName: {
    fontSize: 13,
    color: '#282F3E',
    fontWeight: '600',
  },

  itemDate: {
    fontSize: 13,
    color: '#282F3E',
    fontWeight: 'bold',
  },
  itemDesc: {
    fontSize: 13,
    color: '#282F3E',
    // fontWeight: 'bold',
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
