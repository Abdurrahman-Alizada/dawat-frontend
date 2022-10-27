import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconButton} from 'react-native-paper';
import {useDeleteTaskMutation} from '../../../../../redux/reducers/groups/tasks/taskThunk';
const RenderGroupMembers = ({groupMembers}) => {
  if (groupMembers.responsibleAvatars) {
    return (
      <View style={styles.groupMembersContent}>
        {groupMembers.responsibleAvatars.map((user, index) => (
          <View key={index}>
            {index < 3 ? (
              <View>
                <Image
                  style={styles.memberImage}
                  source={require('../../../../../assets/drawer/userImage.png')}
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
      source={require('../../../../../assets/drawer/userImage.png')}
    />
  );
};

const SingleTask = ({item, closeModalize, navigation}) => {
  const [deleteTask, {isLoading: deleteLoading}] = useDeleteTaskMutation();
  const deleteHandler = async () => {
    await deleteTask({groupId: item?.group?._id, taskId: item?._id})
      .then(response => {
        closeModalize();
        console.log('deleted group is =>', response);
      })
      .catch(e => {
        console.log('error in deleteHandler', e);
      });
  };

  return (
    <View>
      <View style={{padding: '2%'}}>
        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
          <IconButton
            icon="square-edit-outline"
            mode="outlined"
            size={30}
            onPress={() => {
              closeModalize();
              navigation.navigate('AddTask', {task: item});
            }}
          />
          <IconButton
            selected={deleteLoading}
            icon="delete-outline"
            mode="outlined"
            size={30}
            onPress={deleteHandler}
          />
        </View>
        <View style={{padding: '2%'}}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="account-group-outline" size={25} />
            <View style={{marginLeft: '2%'}}>
              <Text style={{fontSize: 18, marginBottom: '1%'}}>
                Responsible
              </Text>
              <RenderGroupMembers groupMembers={item} />
            </View>
          </View>
        </View>

        <View style={{padding: '2%'}}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="timelapse" size={25} />
            <View style={{marginLeft: '2%'}}>
              <Text
                style={{
                  fontSize: 18,
                }}>
                Time
              </Text>

              <Text
                style={{
                  fontSize: 14,
                }}>
                {moment(item.createdAt).fromNow()} -{' '}
                {moment(item.updatedAt).to()}
              </Text>
            </View>
          </View>
          <View></View>
        </View>
      </View>

      {/* <Card mode="outlined" style={{margin: '3%', backgroundColor: '#fff'}}>
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
          <Paragraph>{item.name}</Paragraph>
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
              {moment(item.date).fromNow()} - {moment(new Date()).to()}
            </Paragraph>
          </Card.Actions>
          <Card.Actions style={{justifyContent: 'space-between'}}>
            <RenderGroupMembers groupMembers={item} />
          </Card.Actions>
        </View>
      </Card> */}
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
    height: 30,
    width: 30,
    borderRadius: 50,
  },
});
