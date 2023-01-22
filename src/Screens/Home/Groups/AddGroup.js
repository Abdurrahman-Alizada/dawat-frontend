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
  groupDescription: Yup.string().label('groupDescription'),
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

  const [fileData, setfileData] = useState(null);
  const fileDataRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdonwSearchLoading, setDropdownSearchLoading] = useState(false);
  const [isAddButtonDisable, setIsAddButtonDisable] = useState(false);

  let openCamera = () => {
    setModalVisible(!modalVisible);

    ImagePicker.openCamera({
      // cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setfileData(image);
      fileDataRef.current = image;
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
      fileDataRef.current = image;
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
 
  const submitHandler = async values => {
    setIsAddButtonDisable(true);
    
    if(fileDataRef.current){
      const uri = fileDataRef.current?.path;
      const type = fileDataRef.current?.mime;
      const name = values.groupName;
      const photo = {uri,type,name}
      const data = new FormData()
      data.append('file', photo)
      data.append('upload_preset', 'bzgif1or')
      data.append("cloud_name", "dblhm3cbq")
      fetch("https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload", {
        method: "post",
        body: data
      }).then(res => res.json()).
        then(async (data) => {
          
          await addGroup({
            groupName: values.groupName,
            groupDescription : values.groupDescription,
            imageURL: data.secure_url,
            isChat:true,
            isTasks:true,
            isInvitations: true,
            isMute:false,
            members: users,
          })
            .then(response => {
              console.log('new created group is =>', response);
            })
            .catch(e => {
              console.log(e);
            });
          navigation.navigate('HomeIndex');

        }).catch(err => {
          console.log("An Error Occured While Uploading group image", err)
          fileDataRef.current = null
          setfileData(null)
          return;
        })
    }

    await addGroup({
      groupName: values.groupName,
      groupDescription : values.groupDescription,
      imageURL: "",
      isChat:true,
      isTasks:true,
      isInvitations: true,
      isMute:false,
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
    <View style={{padding: '5%'}}>
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
            groupDescription:'',
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
              <View>
                {fileData ? (
                  <Avatar.Image
                    source={{uri: fileData.path}}
                    style={{alignSelf: 'center'}}
                    size={100}
                  />
                ) : (
                  <View>
                    <Avatar.Icon
                      icon="account-circle-outline"
                      style={{alignSelf: 'center'}}
                      size={100}
                    />

                  </View>
                )
              }
              <IconButton
                style={{position: 'absolute', left: '52%', top: 55}}
                icon="camera"
                mode="contained"
                size={25}
                onPress={() => setModalVisible(true)}
              />
              </View>

              <TextInput
              style={{marginTop:"4%"}}
                error={errors.groupName && touched.groupName ? true : false}
                label="Group Name"
                mode="outlined"
                // style={{marginVertical: '2%', width: '85%'}}
                onChangeText={handleChange('groupName')}
                onBlur={handleBlur('groupName')}
                value={values.groupName}
              />
              {errors.groupName && touched.groupName ? (
                <Text style={styles.error}>{errors.groupName}</Text>
              ) : null}

              <TextInput
              style={{marginTop:"4%"}}
                error={errors.groupDescription && touched.groupDescription ? true : false}
                label="Group Description"
                mode="outlined"
                // style={{marginVertical: '2%', width: '85%'}}
                onChangeText={handleChange('groupDescription')}
                onBlur={handleBlur('groupDescription')}
                value={values.groupDescription}
              />
              {errors.groupDescription && touched.groupDescription ? (
                <Text style={styles.error}>{errors.groupDescription}</Text>
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

            
              <Button
              disabled={isAddButtonDisable}
              loading={isLoading}
                mode="contained"
                style={{
                  marginTop: '2%',
                }}
                onPress={handleSubmit}>
                Add
              </Button>
            </View>
          )}
        </Formik>
      </View>
      <Modal
        onBlur={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, {position: 'absolute', width: '100%'}]}>
            <IconButton
              style={{position: 'absolute', right: 5}}
              icon="close-circle-outline"
              // mode="outlined"
              size={30}
              onPress={() => setModalVisible(false)}
            />
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="camera-image"
                mode="outlined"
                size={40}
                onPress={openCamera}
              />
              <Text>Camera</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="image-outline"
                mode="outlined"
                size={40}
                onPress={openGallery}
              />
              <Text>Gallery</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddGroup;

const styles = StyleSheet.create({
  images: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginHorizontal: 30,
  },
  error: {
    color: 'red',
    marginLeft: 20,
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
