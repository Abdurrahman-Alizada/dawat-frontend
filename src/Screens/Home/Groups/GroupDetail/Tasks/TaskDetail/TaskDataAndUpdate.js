import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  Text,
  TextInput,
  Button,
  Avatar,
  List,
  useTheme,
  Chip,
  IconButton,
  ToggleButton,
  Snackbar,
  Divider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {
  useUpdateTitleMutation,
  useUpdateDescriptionMutation,
  useUpdateStartingDatesMutation,
  useUpdateDueDatesMutation,
  useUpdatePriorityMutation,
} from '../../../../../../redux/reducers/groups/tasks/taskThunk';
import {useSelector} from 'react-redux';

const TaskDataAndUpdate = ({navigation}) => {
  const theme = useTheme();

  const currentViewingTask = useSelector(
    state => state?.tasks?.currentViewingTask,
  );

  const [updateTitle, {isLoading: updateTitleLoading}] =
    useUpdateTitleMutation();
  const [title, setTitle] = useState(currentViewingTask?.taskName);
  const [editTitle, setEditTitle] = useState(false);
  const updateTitleHandler = async () => {
    await updateTitle({
      previousTaskName: currentViewingTask.taskName,
      newTaskName: title,
      userId: await AsyncStorage.getItem('userId'),
      taskId: currentViewingTask._id,
    })
      .then(response => {
        // navigation.goBack();
        setEditTitle(false);
        console.log('updated task is =>', response);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [updateDescription, {isLoading: updateDescriptionLoading}] =
    useUpdateDescriptionMutation();
  const [description, setDescription] = useState(
    currentViewingTask?.taskDescription,
  );
  const [editDescription, setEditDescription] = useState(false);

  const updateDescriptionHandler = async () => {
    await updateDescription({
      taskDescription: description,
      userId: await AsyncStorage.getItem('userId'),
      taskId: currentViewingTask._id,
    })
      .then(response => {
        // navigation.goBack();
        setEditDescription(false);
        console.log('updated task is =>', response);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [updatePriority, {isLoading: updatePriorityLoading}] =
    useUpdatePriorityMutation();

  const [priority, setPriority] = useState(
    currentViewingTask.priority.priority,
  );
  const priorities = ['Low', 'Normal', 'High'];

  const priorityHandler = async p => {
    setPriority(p);
    await updatePriority({
      previousPriority: currentViewingTask.priority.priority,
      priority: p,
      userId: await AsyncStorage.getItem('userId'),
      taskId: currentViewingTask._id,
    })
      .then(response => {
        setSnackBarMessage('Priority has been updated');
        setSnakeBarVisible(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // date and time
  const [startDate, setStartDate] = useState(
    new Date(currentViewingTask.startingDate),
  );
  const [openStartingDate, setOpenStartingDate] = useState(false);
  const [updateStartingDates, {isLoading: updateStartingDateLoading}] =
    useUpdateStartingDatesMutation();
  const updateStartingDatesHandler = async date => {
    setStartDate(date);
    setOpenStartingDate(false);
    await updateStartingDates({
      previousStartingDate: moment(currentViewingTask.startingDate).format('lll'),
      startingDate: moment(date).format('lll'),
      userId: await AsyncStorage.getItem('userId'),
      taskId: currentViewingTask._id,
    })
      .then(response => {
        setSnackBarMessage('Task starting date has been changed');
        setSnakeBarVisible(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [updateDueDates, {isLoading: updateDueDateLoading}] =
    useUpdateDueDatesMutation();
  const [dueDate, setDueDate] = useState(new Date(currentViewingTask.dueDate));
  const [openDueDate, setOpenDueDate] = useState(false);
  useUpdateStartingDatesMutation();
  const updateDueDatesHandler = async date => {
    setDueDate(date);
    setOpenDueDate(false);

    await updateDueDates({
      previousDueDate: moment(currentViewingTask.dueDate).format('lll'),
      dueDate: moment(date).format('lll'),
      userId: await AsyncStorage.getItem('userId'),
      taskId: currentViewingTask._id,
    })
      .then(response => {
        setSnackBarMessage('Task due date has been changed');
        setSnakeBarVisible(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [snakeBarVisible, setSnakeBarVisible] = useState(false);
  const [snackbarMessage, setSnackBarMessage] = useState('');
  return (
    <View style={{flexGrow: 1}}>
      <View style={{flex: 1, marginTop: '2%'}}>
        <ScrollView>
          <List.Item
            title={() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  <Text style={{fontWeight: 'bold'}}>Title</Text>
                  <Text style={{fontSize: 10, marginLeft: '4%'}}>{` /${
                    100 - title.length
                  } characters remaining`}</Text>
                </View>
                <IconButton
                  mode="contained-tonal"
                  icon="pencil"
                  onPress={() => setEditTitle(true)}
                />
              </View>
            )}
            description={() => <Text style={{fontSize: 18}}>{title}</Text>}
            titleStyle={{
              color: theme.colors.secondary,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          />
          <Divider />
          <List.Item
            title={() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  <Text style={{fontWeight: 'bold'}}>Description</Text>
                  <Text style={{fontSize: 10, marginLeft: '4%'}}>{` /${
                    300 - description.length
                  } characters remaining`}</Text>
                </View>
                <IconButton
                  mode="contained-tonal"
                  icon="pencil"
                  onPress={() => setEditDescription(true)}
                />
              </View>
            )}
            description={() => (
              <Text
                style={{
                  fontSize: 18,
                }}>
                {description}
              </Text>
            )}
            titleStyle={{
              color: theme.colors.secondary,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          />
          <Divider />

          <View style={{paddingHorizontal: '5%', marginVertical: '4%'}}>
            <Text style={{fontWeight: 'bold'}}>Participant members</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '2%',
              }}>
              {currentViewingTask.responsibles?.map((responsible, index) => (
                <View
                  key={index}
                  style={{marginRight: '2%', alignItems: 'center'}}>
                  <Avatar.Image
                    size={40}
                    style={{marginVertical: '2%'}}
                    source={{
                      uri: responsible.imgURL
                        ? responsible.imgURL
                        : 'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329064/avatars-for-user-profile/Panda_qek53a.png',
                    }}
                  />
                  <Text style={{marginBottom: '5%'}}>
                    {responsible?.responsible?.name.length > 6
                      ? responsible?.responsible?.name.substring(0, 6) + '..'
                      : responsible?.responsible?.name}
                  </Text>
                </View>
              ))}
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => {
                  navigation.navigate('UpdateTaskMembers');
                }}>
                <Avatar.Icon icon="account-plus" mode="contained" size={40} />
                <Text>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Divider />

          <View style={{margin: '4%'}}>
            <Text style={{fontWeight: 'bold', margin: '2%'}}>Priority</Text>
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
              {priorities.map((singlePriority, index) => (
                <Chip
                  key={index}
                  style={{margin: '2%'}}
                  selected={
                    singlePriority.toLowerCase() === priority.toLowerCase()
                      ? true
                      : false
                  }
                  mode={
                    singlePriority.toLowerCase() === priority.toLowerCase()
                      ? 'flat'
                      : 'outlined'
                  }
                  onPress={() => priorityHandler(singlePriority)}>
                  {singlePriority}
                </Chip>
              ))}
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: '5%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '49%', marginTop: '2%'}}>
              <Text style={{fontWeight: 'bold'}}>Starting Timing</Text>
              <TouchableOpacity
                onPress={() => setOpenStartingDate(true)}
                style={{
                  borderRadius: 10,
                  borderColor: '#C1C2B8',
                  borderWidth: 0.5,
                  padding: '4%',
                  marginVertical: '4%',
                  textAlign: 'center',
                }}>
                <Text>{moment(startDate).format('lll')}</Text>
              </TouchableOpacity>
            </View>

            <View style={{width: '49%', marginTop: '2%'}}>
              <Text style={{fontWeight: 'bold'}}>Due Timing</Text>
              <TouchableOpacity
                onPress={() => setOpenDueDate(true)}
                style={{
                  borderRadius: 10,
                  borderColor: '#C1C2B8',
                  borderWidth: 0.5,
                  padding: '4%',
                  marginVertical: '4%',
                  textAlign: 'center',
                }}>
                <Text>{moment(dueDate).format('lll')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {editTitle && (
        <View style={{padding: '2%', backgroundColor: '#fff'}}>
          <TextInput
            outlineColor={theme.colors.background}
            style={{
              textAlignVertical: 'top',
              marginTop: '2%',
              backgroundColor: theme.colors.background,
            }}
            underlineColor={theme.colors.background}
            activeOutlineColor={theme.colors.onBackground}
            value={title}
            autoFocus
            mode="outlined"
            multiline
            onChangeText={text => setTitle(text)}
            right={<TextInput.Affix text={`/${99 - title.length}`} />}
          />

          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              justifyContent: 'space-between',
              alignSelf: 'flex-end',
            }}>
            <Button
              style={{width: '48%', marginRight: '1%'}}
              icon="close"
              mode="outlined"
              theme={{roundness: 1}}
              onPress={() => {
                setEditTitle(false);
                setTitle(currentViewingTask.taskName);
              }}>
              cancel
            </Button>
            <Button
              style={{width: '48%', marginLeft: '1%'}}
              icon="check"
              mode="contained"
              loading={updateTitleLoading}
              onPress={() => updateTitleHandler()}
              theme={{roundness: 1}}
              disabled={updateTitleLoading || title.length < 1}>
              Ok
            </Button>
          </View>
        </View>
      )}
      {editDescription && (
        <View style={{padding: '2%', backgroundColor: '#fff'}}>
          <TextInput
            outlineColor={theme.colors.background}
            style={{
              textAlignVertical: 'top',
              marginTop: '2%',
              backgroundColor: theme.colors.background,
            }}
            underlineColor={theme.colors.background}
            activeOutlineColor={theme.colors.onBackground}
            value={description}
            autoFocus
            mode="outlined"
            multiline
            onChangeText={text => setDescription(text)}
            right={<TextInput.Affix text={`/${300 - description.length}`} />}
          />

          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              justifyContent: 'space-between',
              alignSelf: 'flex-end',
            }}>
            <Button
              style={{width: '48%', marginRight: '1%'}}
              icon="close"
              mode="outlined"
              theme={{roundness: 1}}
              onPress={() => {
                setEditDescription(false);
                setDescription(currentViewingTask.taskDescription);
              }}>
              cancel
            </Button>
            <Button
              style={{width: '48%', marginLeft: '1%'}}
              icon="check"
              mode="contained"
              loading={updateDescriptionLoading}
              onPress={() => updateDescriptionHandler()}
              theme={{roundness: 1}}
              disabled={updateDescriptionLoading || description.length < 1}>
              Ok
            </Button>
          </View>
        </View>
      )}

      <Snackbar
        visible={snakeBarVisible}
        duration={3000}
        onDismiss={() => setSnakeBarVisible(false)}>
        {snackbarMessage}
      </Snackbar>

      <DatePicker
        date={startDate}
        open={openStartingDate}
        modal
        onConfirm={date => {
          updateStartingDatesHandler(date);
        }}
        onCancel={() => {
          setOpenStartingDate(false);
        }}
      />

      <DatePicker
        date={dueDate}
        open={openDueDate}
        modal
        onConfirm={date => {
          updateDueDatesHandler(date);
        }}
        onCancel={() => {
          setOpenDueDate(false);
        }}
      />
    </View>
  );
};

export default TaskDataAndUpdate;

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
});
