import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, Alert, Pressable, TouchableOpacity} from 'react-native';
import {Chip, Card, Paragraph, IconButton, Title} from 'react-native-paper';

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

const SingleGroup = ({
  item,
  navigation,
  checked,
  setChecked,
  checkedItems,
  setCheckedItems,
}) => {
  const onPressHandler = () => {
    navigation.navigate('GroupDetail', {
      groupId: item._id,
      groupName: item.groupName,
    });
  };

  // logic for checked on longPress
  const [include, setInclude] = useState(checkedItems?.includes(item._id));
  const index = checkedItems?.indexOf(item._id);

  const onLongPressHandler = () => {
    setChecked(true);
    if (include) {
      if (index !== -1 && index !== 0) {
        checkedItems.splice(include, 1);
        // console.log('if ',index, props.item._id);
      } else if (index == 0) {
        checkedItems.shift();
      }
    } else {
      setCheckedItems([...checkedItems, item._id]);
    }
    setInclude(!include);
  };
  // end logic for checked on longPress

  return (
    <TouchableOpacity
      onPress={onPressHandler}
      onLongPress={() => onLongPressHandler()}>
      <Card
        mode="outlined"
        style={{
          marginTop: '3%',
          marginHorizontal: '3%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Card.Content>
            <Title style={{fontFamily: 'Poppins-Regular'}}>
              {item.groupName}
            </Title>
          </Card.Content>

          {checked && include ? (
            <IconButton
              icon="check-circle"
              iconColor={'#BDBDBD'}
              size={30}
              onPress={() => console.log('Pressed')}
            />
          ) : (
            <IconButton
              icon="dots-horizontal"
              iconColor={'#BDBDBD'}
              size={30}
              onPress={() => console.log('Pressed')}
            />
          )}
        </View>
        <Card.Content>
          <Paragraph>{item.groupDescription}</Paragraph>
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
    </TouchableOpacity>
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
