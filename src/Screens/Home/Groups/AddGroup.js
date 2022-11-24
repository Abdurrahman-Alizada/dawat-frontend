import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Modal,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect, useMemo, useRef} from 'react';

import axios from 'axios';
import {instance} from '../../../redux/axios';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Badge,
  List,
  Avatar,
  TextInput,
  Button,
  IconButton,
} from 'react-native-paper';

import {useSelector, useDispatch} from 'react-redux';
import {useAddGroupMutation} from '../../../redux/reducers/groups/groupThunk';

const validationSchema = Yup.object().shape({
  groupName: Yup.string().required('Group name is required').label('groupName'),
  groupDescription: Yup.string().label('groupName'),
});

const AddGroup = ({navigation, onClose}) => {
  const [userId, setuserId] = React.useState(null);

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [items, setItems] = useState([]);
  const getUserInfo = async () => {
    let userId = await AsyncStorage.getItem('userId');
    setuserId(userId);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const dispatch = useDispatch();

  const [addGroup, {isLoading}] = useAddGroupMutation();

  const submitHandler = async values => {
    await addGroup({
      groupName: values.groupName,
      members: users,
    })
      .then(response => {
        console.log('new created group is =>', response);
      })
      .catch(e => {
        console.log(e);
      });
    navigation.navigate('HomeIndex');
  };

  const [fileData, setfileData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdonwSearchLoading, setDropdownSearchLoading] = useState(false);
  let openCamera = () => {
    setModalVisible(!modalVisible);

    ImagePicker.openCamera({
      // cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setfileData(image);
      console.log(image);
    });
  };

  let openGallery = () => {
    setModalVisible(!modalVisible);

    ImagePicker.openPicker({
      // cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setfileData(image);
      console.log(image);
    });
  };

  let removePicture = () => {
    ImagePicker.clean()
      .then(() => {
        setfileData(null);
        console.log('removed all tmp images from tmp directory');
      })
      .catch(e => {
        alert(e);
      });
  };
  function renderFileData() {
    if (fileData) {
      return (
        <View style={styles.images}>
          <Image source={{uri: fileData.path}} style={styles.images} />
          <Ionicons
            name="close"
            color="black"
            size={25}
            onPress={removePicture}
            style={{
              position: 'absolute',
              right: -5,
              top: -5,
              borderRadius: 50,
              backgroundColor: '#fff',
            }}
          />
        </View>
      );
    } else {
      return <View></View>;
    }
  }

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
                source={require('../../../assets/drawer/userImage.png')}
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
    <View style={{padding: '5%', backgroundColor: '#fff', flex: 1}}>
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
                source={require('../../../assets/drawer/userImage.png')}
              />
              <Text style={{alignSelf: 'center'}}>{user.name}</Text>
              {/* <Text style={{alignSelf: 'center', maxWidth:"30%", alignSelf:"flex-start"}} numberOfLines={1}>{user}</Text> */}
            </View>
          ))}
        </ScrollView>
      ) : null}
      <View style={{}}>
        <Formik
          initialValues={{
            groupName: '',
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <IconButton
                  style={{width: '10%'}}
                  icon="camera"
                  mode="outlined"
                  size={20}
                  onPress={() => setModalVisible()}
                />
                <TextInput
                  error={errors.groupName && touched.groupName ? true : false}
                  label="Group Name"
                  mode="outlined"
                  style={{marginVertical: '2%', width: '85%'}}
                  onChangeText={handleChange('groupName')}
                  onBlur={handleBlur('groupName')}
                  value={values.groupName}
                />
              </View>
              {errors.groupName && touched.groupName ? (
                <Text style={styles.error}>{errors.groupName}</Text>
              ) : null}

              <View style={{marginVertical: '5%'}}>
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
              </View>

              {/* <Input
              placeholder="Optional"
              label="Enter Description"
              onChangeText={handleChange('groupDescription')}
              onBlur={handleBlur('groupDescription')}
              value={values.groupDescription}
            /> */}

              {renderFileData()}

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                  <View style={[styles.modalView, {width: 350, height: 340}]}>
                    <TouchableOpacity
                      onPress={openCamera}
                      style={[styles.buttonStyle, {marginHorizontal: 50}]}>
                      <Text style={styles.buttonTextStyle}>Choose File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={openGallery}
                      style={[styles.buttonStyle, {marginHorizontal: 50}]}>
                      <Text style={styles.buttonTextStyle}>Open Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Button
                mode="contained"
                style={{
                  marginTop: '2%',
                  borderRadius: 5,
                  backgroundColor: '#334C8C',
                }}
                onPress={handleSubmit}>
                Add
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default AddGroup;

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
    marginLeft: '15%',
    color: 'red',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DFE2E5',
    borderRadius: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 20,
    width: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
