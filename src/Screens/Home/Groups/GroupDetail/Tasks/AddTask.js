import {Text, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button, Avatar, List, Appbar} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';
import {instance} from '../../../../../redux/axios';
import AsyncStorage from '@react-native-community/async-storage';

import {useAddTaskMutation, useUpdateTaskMutation} from '../../../../../redux/reducers/groups/tasks/taskThunk';

const validationSchema = Yup.object().shape({
  taskTitle: Yup.string().required('Task title is required').label('taskTitle'),
  taskDescription: Yup.string().label('taskDescription'),
});

const AddTask = ({route, navigation}) => {
  const {groupId} = route.params;
  const [addTask, {isLoading}] = useAddTaskMutation();
  const [updateTask, {isLoading: updateLoading}] = useUpdateTaskMutation();
  const submitHandler = async values => {
    route.params?.task ? updateHandler(values) : addHandler(values);
  };
  const addHandler = async values => {
    await addTask({
      taskName: values.taskTitle,
      groupId: groupId,
      taskDescription: values.taskDescription,
    })
      .then(response => {
        navigation.goBack();
        console.log('new created task is =>', response);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const updateHandler = async values => {
    await updateTask({
      taskId: route.params?.task?._id,
      taskName: values.taskTitle,
      taskDescription: values.taskDescription,
    })
      .then(response => {
        navigation.goBack();
        console.log('updated task is =>', response);
      })
      .catch(e => {
        console.log(e);
      });
  };


  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [items, setItems] = useState([]);
  const [dropdonwSearchLoading, setDropdownSearchLoading] = useState(false);

  const Item = props => {
    const [include, setInclude] = useState(users.includes(props.item._id));
    const index = users.indexOf(props.item._id);
    const add = () => {
      if (include) {
        if (index !== -1 && index !== 0) {
          users.splice(include, 1);
          usersList.splice(include, 1);
        } else if (index == 0) {
          users.shift();
          usersList.shift();
        }
      } else {
        setUsers([...users, props.item._id]);
        setUsersList([...usersList, props.item]);
      }
      setInclude(!include);
    };
    return (
      <View>
        <List.Item
          onPress={add}
          title={props.item.name}
          description={props.item.email}
          left={props => (
            <View>
              <Avatar.Image
                {...props}
                size={50}
                source={require('../../../../../assets/drawer/userImage.png')}
              />
              {include ? (
                <List.Icon
                  style={{position: 'absolute', right: -5, top: 10}}
                  color={'#3ff'}
                  icon="check-circle"
                />
              ) : null}
            </View>
          )}
          // left={props => <List.Icon {...props} icon="folder" />}
        />
      </View>
    );
  };

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={route.params?.task ? 'Update Task' : 'Add Task'}
        />
      </Appbar.Header>
      <View
        style={{
          margin: '5%',
          borderRadius: 10,
          padding: '5%',
        }}>
        <Formik
          initialValues={{
            taskTitle: route.params?.task?.taskName,
            taskDescription: route.params?.task?.taskDescription,
            status: '',
            startDate: '',
            endDate: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => submitHandler(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={{marginVertical: '2%'}}>
              <TextInput
                error={errors.taskTitle && touched.taskTitle ? true : false}
                label="Enter task title"
                mode="outlined"
                style={{marginVertical: '2%', width: '100%'}}
                onChangeText={handleChange('taskTitle')}
                onBlur={handleBlur('taskTitle')}
                value={values.taskTitle}
              />
              {errors.taskTitle && touched.taskTitle ? (
                <Text style={styles.error}>{errors.taskTitle}</Text>
              ) : null}

              <TextInput
                error={
                  errors.taskDescription && touched.taskDescription
                    ? true
                    : false
                }
                label="Enter Description"
                mode="outlined"
                multiline
                style={{marginVertical: '2%', width: '100%'}}
                onChangeText={handleChange('taskDescription')}
                onBlur={handleBlur('taskDescription')}
                value={values.taskDescription}
              />
              {errors.taskDescription && touched.taskDescription ? (
                <Text style={styles.error}>{errors.taskDescription}</Text>
              ) : null}

              <DropDownPicker
                renderListItem={props => <Item {...props} />}
                open={open}
                value={users}
                items={items}
                placeholder={'Choose a member'}
                searchPlaceholder={'Search'}
                setOpen={setOpen}
                setItems={setItems}
                listMode="FLATLIST"
                searchable={true}
                loading={dropdonwSearchLoading}
                disableLocalSearch={true}
                searchContainerStyle={{
                  borderBottomColor: '#dfdfdf',
                }}
                style={[styles.inputStyle]}
                textStyle={{
                  fontSize: 16,
                  fontWeight: '700',
                }}
                labelStyle={{
                  fontWeight: 'bold',
                }}
                itemKey="_id"
                onChangeSearchText={async () => {
                  setDropdownSearchLoading(true);
                  instance
                    .get('/api/account/allusers', {
                      headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                          'token',
                        )}`,
                      },
                    })
                    .then(items => {
                      setItems(items.data);
                    })
                    .catch(err => {
                      console.log('error in dropdown', err);
                      //
                    })
                    .finally(() => {
                      // Hide the loading animation
                      setDropdownSearchLoading(false);
                    });
                }}
              />

              {route.params?.task ? (
                <Button
                  disabled={updateLoading}
                  loading={updateLoading}
                  mode="contained"
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: '#334C8C',
                    borderRadius: 10,
                    borderColor: '#C1C2B8',
                    borderWidth: 0.5,
                    padding: '1%',
                    marginVertical: '2%',
                  }}>
                  Update
                </Button>
              ) : (
                <Button
                  disabled={isLoading}
                  loading={isLoading}
                  mode="contained"
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: '#334C8C',
                    borderRadius: 10,
                    borderColor: '#C1C2B8',
                    borderWidth: 0.5,
                    padding: '1%',
                    marginVertical: '2%',
                  }}>
                  Add
                </Button>
              )}
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#D70F64',
    color: '#FFFFFF',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 240,
    borderRadius: 10,
    marginVertical: '5%',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 5,
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  images: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginHorizontal: 30,
  },
  error: {
    color: 'red',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: '5%',
    // justifyContent: 'center',
  },
});
