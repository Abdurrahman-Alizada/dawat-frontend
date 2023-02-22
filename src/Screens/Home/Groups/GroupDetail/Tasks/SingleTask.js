import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {
  Badge,
  IconButton,
  Divider,
  List,
  useTheme,
  Avatar,
  Menu,
  ActivityIndicator,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {handleCurrentViewingTask} from '../../../../../redux/reducers/groups/tasks/taskSlice';
import {
  useDeleteTaskMutation,
  useMarkAsCompletedMutation,
} from '../../../../../redux/reducers/groups/tasks/taskThunk';

const RenderGroupMembers = ({task}) => {
  const theme = useTheme();
  if (task.responsibles) {
    return (
      <View style={styles.groupMembersContent}>
        {task.responsibles.map((user, index) => (
          <View key={index}>
            {index < 5 ? (
              <Avatar.Image
                size={20}
                source={{
                  uri: 'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329064/avatars-for-user-profile/Panda_qek53a.png',
                }}
              />
            ) : (
              <></>
            )}
          </View>
        ))}
        {task.responsibles.length > 5 ? (
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
              +{task.responsibles.length - 5}
            </Text>
          </View>
        ) : (
          <View>
            {task.responsibles.length < 1 && (
              <Text style={{color: theme.colors.onSurface}}>
                No participant
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
};

const SingleTask = ({item, cardHandler}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const currentLoginUser = useSelector(state=> state.user.currentLoginUser)

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [deleteTask, {isLoading: deleteLoading}] = useDeleteTaskMutation();
  const [markAsCompleted, {isLoading: markAsCompletedLoading}] =
    useMarkAsCompletedMutation();

  const deleteHandler = async () => {
    await deleteTask({groupId: item?.group?._id, taskId: item?._id})
      .then(response => {
        closeMenu();
        console.log('deleted group is =>', response);
      })
      .catch(e => {
        console.log('error in deleteHandler', e);
      });
  };

  const markAsCompletedHandler = async () => {
    await markAsCompleted({
      condition: !item.isCompleted,
      userId: currentLoginUser._id,
      taskId: item._id,
    })
      .then(response => {
        closeMenu();
        console.log('updated task in markAsCompletedHandler is =>', response);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <View>
      <View
        style={{
          paddingHorizontal: '5%',
          paddingVertical: '4%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <View style={{width: '90%'}}>
          <View
            style={{
              marginTop: '2%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: '800',
                fontSize: 16,
                color: theme.colors.onSurface,
                textDecorationLine: item.isCompleted ? 'line-through' : 'none',
              }}>
              {item.taskName}
            </Text>
          </View>
          <View
            style={{
              marginTop: '2%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              size={13}
              name="clock"
              style={{marginRight: 15}}
              color={theme.colors.onSurface}
            />
            <Text style={{fontSize: 13, color: theme.colors.onSurface}}>
              {moment(item.dueDate).format('llll')}
            </Text>
          </View>
          <View
            style={{
              marginTop: '2%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              size={13}
              name="users"
              style={{marginRight: 10}}
              color={theme.colors.onSurface}
            />
            <RenderGroupMembers task={item} />
          </View>
        </View>

        <View>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            // anchorPosition="bottom"
            anchor={
              <IconButton
                icon="dots-vertical"
                size={25}
                onPress={() => openMenu()}
              />
            }>
            <Menu.Item
              leadingIcon={() => (
                <View>
                  {markAsCompletedLoading ? (
                    <ActivityIndicator animating />
                  ) : (
                    <List.Icon
                      icon={
                        item?.isCompleted
                          ? 'checkbox-blank-circle'
                          : 'checkbox-blank-circle-outline'
                      }
                    />
                  )}
                </View>
              )}
              title={
                item?.isCompleted ? 'Mark as incompleted' : 'Mark as complete'
              }
              onPress={() => {
                markAsCompletedHandler()
              }}
            />

            <Menu.Item
              leadingIcon="comment-text-multiple"
              title="Details"
              titleStyle={{color: theme.colors.onBackground}}
              onPress={async () => {
                closeMenu();
                dispatch(handleCurrentViewingTask(item));
                navigation.navigate('TaskDetail');
              }}
            />
            <Divider />
            <Menu.Item
              leadingIcon={() => (
                <View>
                  {deleteLoading ? (
                    <ActivityIndicator animating />
                  ) : (
                    <List.Icon color={theme.colors.error} icon="delete" />
                  )}
                </View>
              )}
              title="Delete"
              titleStyle={{color: theme.colors.error}}
              onPress={async () => {
                deleteHandler();
                // navigation.navigate('AppSettingsMain');
              }}
            />
          </Menu>
        </View>
      </View>
      <Divider />
      {/* 

          {item.priority.priority === 'High' && (
            <Badge style={{marginHorizontal: 5}}></Badge>
          )}
          {item.priority.priority === 'Normal' && (
            <Badge
              style={{marginHorizontal: 5, backgroundColor: '#34f'}}></Badge>
          )}
          {item.priority.priority === 'Low' && (
            <Badge
              style={{marginHorizontal: 5, backgroundColor: '#ed3'}}></Badge>
          )}
*/}
    </View>
  );
};

export default SingleTask;

const styles = StyleSheet.create({
  groupMembersContent: {
    flexDirection: 'row',
  },
  memberImage: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
});
