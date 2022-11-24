import React, {useState, useCallback} from 'react';
import {ToastAndroid, TouchableOpacity, Image, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconButton, Avatar} from 'react-native-paper';
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

const TaskBrief = ({item, closeModalize, navigation}) => {
 
  const showToast = (response) => {
    ToastAndroid.show(`Task has been deleted`, ToastAndroid.SHORT);
  };

  const [deleteTask, {isLoading: deleteLoading}] = useDeleteTaskMutation();
  const deleteHandler = async () => {
    await deleteTask({groupId: item?.group?._id, taskId: item?._id})
      .then(response => {
        closeModalize();
        showToast();
        console.log('deleted group is =>', response);
      })
      .catch(e => {
        console.log('error in deleteHandler', e);
      });
  };

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(
    e => {
      setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
    },
    [textShown],
  );
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
          <View
            style={{
              alignItems: 'flex-start',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar.Image
                size={40}
                source={require('../../../../../assets/drawer/userImage.png')}
              />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  margin: '1%',
                }}>
                {item.taskName}
              </Text>
            </View>
            <View style={{}}>
              <Text
                style={{textAlign: 'justify'}}
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 2}>
                {item.taskDescription}
              </Text>

              {lengthMore ? (
                <TouchableOpacity onPress={() => toggleNumberOfLines()}>
                  <Text style={{fontWeight: 'bold'}}>
                    {textShown ? 'Read less' : 'Read more'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>

        <View style={{padding: '2%'}}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="account-supervisor-circle" size={30} />
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
        </View>
      </View>
    </View>
  );
};

export default TaskBrief;

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
