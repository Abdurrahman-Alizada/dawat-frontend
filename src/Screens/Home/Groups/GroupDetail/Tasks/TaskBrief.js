import React, {useState, useCallback} from 'react';
import {
  ToastAndroid,
  StyleSheet,
  View,
} from 'react-native';
import {Checkbox} from 'react-native-paper'

import {IconButton, Avatar, List, Chip} from 'react-native-paper';
import {useDeleteTaskMutation} from '../../../../../redux/reducers/groups/tasks/taskThunk';

const TaskBrief = ({item, closeModalize, navigation}) => {
  const showToast = response => {
    ToastAndroid.show(`Task has been deleted`, ToastAndroid.SHORT);
  };

  const [deleteTask, {isLoading: deleteLoading}] = useDeleteTaskMutation();
  const deleteHandler = async () => {
    await deleteTask({groupId: item?.group?._id, taskId: item?._id})
      .then(response => {
        closeModalize();
        showToast();
        console.log('deleted task is =>', response);
      })
      .catch(e => {
        console.log('error in deleteHandler', e);
      });
  };

  const getIconForChip = () => {
    if (item.priority.priority === 'Normal') {
      return 'alpha-n-circle-outline';
    } else if (item.priority.priority === 'High') {
      return 'alpha-h-circle-outline';
    } else if (item.priority.priority === 'Low') {
      return 'alpha-l-circle-outline';
    } else {
      return 'alpha-n-circle-outline';
    }
  };
  const TitleForChip = () => {
    if (item.priority.priority === 'Normal') {
      return 'Normal Priority';
    } else if (item.priority.priority === 'High') {
      return 'High Priority';
    } else if (item.priority.priority === 'Low') {
      return 'Low Priority';
    } else {
      return 'No Priority';
    }
  };

  return (
    <View style={{padding: '4%'}}>
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Chip icon={getIconForChip()} onPress={() => console.log('Pressed')}>
            {TitleForChip()}
          </Chip>
        </View>

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
      </View>


      <List.Item
        title={item.taskName}
        description={item.taskDescription}
        // left={props => (
        //   <Avatar.Image
        //     size={45}
        //     {...props}
        //     style={{alignSelf: 'center'}}
        //     avatarStyle={{borderRadius: 20}}
        //     source={
        //       item.taskImageURL
        //         ? {uri: item.taskImageURL}
        //         : require('../../../../../assets/drawer/male-user.png')
        //     }
        //   />
        // )}
        left={props =>(
          <Checkbox
          {...props}
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => {
            // setChecked(!checked);
          }}
        />
        )}
      />

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
