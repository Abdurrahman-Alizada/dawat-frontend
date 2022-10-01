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
// import {ListItem, CheckBox, Avatar} from 'react-native-elements';
import moment from 'moment';
import {
  Avatar,
  Chip,
  Card,
  Paragraph,
  IconButton,
  Title,
} from 'react-native-paper';

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
      groupName: item.groupName,
    });
  };

  const onLongPressHandler = () => {
    console.log(item.groupName);
    Alert.alert('Hello', 'onlongPress');
  };
  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;

  return (
    <Pressable
      onPress={onPressHandler}
      onLongPress={() => onLongPressHandler()}>
      <Card
        mode="elevated"
        style={{
          marginTop: '3%',
          marginHorizontal: '3%',
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            flexDirection: 'row',
            // paddingHorizontal: '2%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Card.Content>
            <Title>Card Title</Title>
          </Card.Content>
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
            marginVertical: '1%',
            backgroundColor: '#BDBDBD',
          }}></View>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginHorizontal: '1%'}}>
              <Chip
                mode="outlined"
                icon="calendar-today"
                onPress={() => console.log('Pressed')}>
                12
              </Chip>
            </View>
            <View style={{marginHorizontal: '1%'}}>
              <Chip
                mode="outlined"
                icon="account-group-outline"
                onPress={() => console.log('Pressed')}>
                12
              </Chip>
            </View>
            <View style={{marginHorizontal: '1%'}}>
              <Chip
                mode="outlined"
                icon="message-text-outline"
                onPress={() => console.log('Pressed')}>
                12
              </Chip>
            </View>
          </View>

          <Card.Actions style={{justifyContent: 'space-between'}}>
            <RenderGroupMembers groupMembers={item} />
          </Card.Actions>
        </View>
      </Card>
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
