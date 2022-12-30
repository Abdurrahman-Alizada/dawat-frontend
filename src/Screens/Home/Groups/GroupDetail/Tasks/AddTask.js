import { Text, StyleSheet, View, Platform, ScrollView,TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {ToggleButton, TextInput, Button, Avatar, List, Appbar} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';
import {instance} from '../../../../../redux/axios';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-date-picker'

import {useAddTaskMutation, useUpdateTaskMutation} from '../../../../../redux/reducers/groups/tasks/taskThunk';
import moment from 'moment';

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
    // console.log("hello", values.taskTitle,groupId,values.taskDescription, users,startDate, dueDate,prority)
    await addTask({
      taskName: values.taskTitle,
      groupId: groupId,
      taskDescription: values.taskDescription,
      responsibles: users,
      startingDate: startDate,
      dueDate: dueDate,
      prority:prority
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
 // date and time
 const [startDate, setStartDate] = useState(new Date())
 const [openStartingDate, setOpenStartingDate] = useState(false)
 const [dueDate, setDueDate] = useState(new Date())
 const [openDueDate, setOpenDueDate] = useState(false)
 //  priority
 const [prority,setPriority] = useState("low")

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
          borderRadius: 10,
          padding: '4%',
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
                label="what is to be done?"
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
                label="Some Description"
                mode="outlined"
                multiline
                style={{marginVertical: '2%',maxHeight:200, width: '100%'}}
                onChangeText={handleChange('taskDescription')}
                onBlur={handleBlur('taskDescription')}
                value={values.taskDescription}
              />
              {errors.taskDescription && touched.taskDescription ? (
                <Text style={styles.error}>{errors.taskDescription}</Text>
              ) : null}

            
              {users.length > 0 ? (
                <ScrollView
                  horizontal={true}
                  style={{maxHeight: 60}}
                  contentContainerStyle={{}}
                  showsHorizontalScrollIndicator={false}>
                  {usersList.map((user, index) => (
                    <View style={{marginRight: 5}} key={user._id}>
                      <Avatar.Image
                        size={40}
                        source={require('../../../../../assets/drawer/userImage.png')}
                      />
                      <Text style={{alignSelf: 'center'}}>{user.name}</Text>
                      {/* <Text style={{alignSelf: 'center', maxWidth:"30%", alignSelf:"flex-start"}} numberOfLines={1}>{user}</Text> */}
                    </View>
                  ))}
                </ScrollView>
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
                listMode="MODAL"
                searchable={true}
                loading={dropdonwSearchLoading}
                disableLocalSearch={true}
                style={{marginVertical: '2%'}}
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
                      console.log("hello users",typeof items.data)
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
            

           <DatePicker 
           date={startDate} 
           open={openStartingDate}
           modal
          onConfirm={(date) => {
            setStartDate(date);
            setOpenStartingDate(false);
          }}
          onCancel={() => {
            setOpenStartingDate(false);
          }}
           />

        <DatePicker 
           date={dueDate} 
           open={openDueDate}
           modal
          onConfirm={(date) => {
            setDueDate(date);
            setOpenDueDate(false);
          }}
          onCancel={() => {
            setOpenDueDate(false);
          }}
           />
            
             <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                
                <View style={{width: '48%', marginTop:"2%"}}>
                  <Text style={{fontWeight:"bold"}}>Starting Timing</Text>
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
                   <Text style={{fontWeight: 'bold',}}> 
                    {moment(startDate).format('lll')} {' '} 
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={{width: '48%', marginTop:"2%"}}>
                  <Text style={{fontWeight:"bold"}}>Due Timing</Text>
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
                   <Text style={{fontWeight: 'bold',}}> 
                    {moment(dueDate).format('lll')} {' '} 
                    </Text>
                  </TouchableOpacity>
                </View>
                
              </View>

          <View style={{marginVertical:"4%"}}>
          <Text style={{fontWeight:"bold", marginVertical:"2%"}}>Priority</Text>
          <ToggleButton.Row onValueChange={value => setPriority(value)} value={prority}>
            <ToggleButton style={{width:"33%"}} icon={()=><Text>Low</Text>} value="Low" />
            <ToggleButton style={{width:"33%"}} icon={()=><Text>Normal</Text>} value="Normal" />
            <ToggleButton style={{width:"33%"}} icon={()=><Text>High</Text>} value="High" />
          </ToggleButton.Row>

          </View>
              {route.params?.task ? (
                <Button
                  disabled={updateLoading}
                  loading={updateLoading}
                  mode="contained"
                  onPress={handleSubmit}
                  style={{
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
  error: {
    color: 'red',
  },
});
