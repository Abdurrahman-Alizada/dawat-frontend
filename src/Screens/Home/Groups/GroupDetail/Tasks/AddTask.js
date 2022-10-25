import {TouchableOpacity, Text, StyleSheet, Modal, View} from 'react-native';
import React, {useState} from 'react';
import { TextInput, Button, Avatar, List} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';
import {instance} from '../../../../../redux/axios';
import AsyncStorage from '@react-native-community/async-storage';

import {useAddInvitiMutation} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';

const validationSchema = Yup.object().shape({
  taskTitle: Yup.string().required('Task title is required').label('taskTitle'),
  taskDescription: Yup.string().label('taskDescription'),
});

const AddInviti = ({setVisible, groupId}) => {
  const [addInviti, {isLoading}] = useAddInvitiMutation();

  const submitHandler = async values => {
    await addInviti({
      groupId: groupId,
      invitiName: values.invitiName,
      invitiDescription: values.invitiDescription,
    })
      .then(response => {
        console.log('new created group is =>', response);
      })
      .catch(e => {
        console.log(e);
      });
    setVisible(false);
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
          // console.log('if ',index, props.item._id);
        } else if (index == 0) {
          users.shift();
          usersList.shift();
        }
      } else {
        setUsers([...users, props.item._id]);
        setUsersList([...usersList, props.item]);
        // console.log('else', index, props.item._id);
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
    <View
      style={{
        margin: '5%',
        borderRadius: 10,
        padding: '5%',
      }}>
      <Formik
        initialValues={{
          taskTitle: '',
          taskDescription: '',
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
            {/* <TouchableOpacity
              onPress={() => setModalVisible()}
              style={{alignSelf: 'center'}}>
              {renderFileData()}
            </TouchableOpacity> */}

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
                errors.taskDescription && touched.taskDescription ? true : false
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
                    // console.log('dropdonw items', items.data);
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

            <Button
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
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AddInviti;

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
