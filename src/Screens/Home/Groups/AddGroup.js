import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect, useMemo, useRef} from 'react';
import {instance} from '../../../redux/axios';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Text,
  List,
  Avatar,
  TextInput,
  Checkbox,
  IconButton,
  Card,
  FAB,
  Badge,
  useTheme,
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

    if (fileDataRef.current) {
      const uri = fileDataRef.current?.path;
      const type = fileDataRef.current?.mime;
      const name = values.groupName;
      const photo = {uri, type, name};
      const data = new FormData();
      data.append('file', photo);
      data.append('upload_preset', 'bzgif1or');
      data.append('cloud_name', 'dblhm3cbq');
      fetch('https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload', {
        method: 'post',
        body: data,
      })
        .then(res => res.json())
        .then(async data => {
          await addGroup({
            groupName: values.groupName,
            groupDescription: values.groupDescription,
            imageURL: data.secure_url,
            isChat: true,
            isTasks: true,
            isInvitations: true,
            isMute: false,
            members: users,
          })
            .then(response => {
              console.log('new created group is =>', response);
            })
            .catch(e => {
              console.log(e);
            });
          navigation.navigate('HomeIndex');
        })
        .catch(err => {
          console.log('An Error Occured While Uploading group image', err);
          fileDataRef.current = null;
          setfileData(null);
          return;
        });
    }

    await addGroup({
      groupName: values.groupName,
      groupDescription: values.groupDescription,
      imageURL: '',
      isChat: true,
      isTasks: true,
      isInvitations: true,
      isMute: false,
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

  const removeItem = id => {
    const index = users.indexOf(id);
    if (index !== -1 && index !== 0) {
      users.splice(index, 1);
      usersList.splice(index, 1);
    } else if (index == 0) {
      users.shift();
      usersList.shift();
    }
  };
  const Item = itemProps => {
    const [include, setInclude] = useState(users.includes(itemProps.item._id));
    const index = users.indexOf(itemProps.item._id);
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
        setUsers([...users, itemProps.item._id]);
        setUsersList([...usersList, itemProps.item]);
        // console.log('else', index, props.item._id);
      }
      setInclude(!include);
    };
    return (
      <View>
        <List.Item
          onPress={add}
          title={itemProps.item.name}
          description={itemProps.item.email}
          left={props => (
            <View>
              <Avatar.Image
                {...props}
                variant="image"
                size={50}
                source={
                  itemProps.item?.imageURL
                    ? {uri: itemProps.item?.imageURL}
                    : require('../../../assets/drawer/userImage.png')
                }
              />
            </View>
          )}
          right={props => (
            <Checkbox
              {...props}
              status={include ? 'checked' : 'unchecked'}
              onPress={add}
            />
          )}
        />
      </View>
    );
  };

  const theme = useTheme();

  return (
    <View style={{flex: 1}}>
      <Formik
        initialValues={{
          groupName: '',
          groupDescription: '',
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
          <View
            style={{flex: 1, marginVertical: '2%', paddingHorizontal: '5%'}}>
            {!open && (
              <View>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
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
                  )}
                </TouchableOpacity>

                <TextInput
                  style={{marginTop: '4%'}}
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
                  style={{marginTop: '4%'}}
                  error={
                    errors.groupDescription && touched.groupDescription
                      ? true
                      : false
                  }
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
              </View>
            )}
            <View style={{marginVertical: open ? '0%' : '5%'}}>
              {users.length > 0 ? (
                <Card style={{marginBottom: open ? '2%' : '5%'}}>
                  {/* <Card.Title title="Card Title" /> */}
                  <Card.Content>
                    <ScrollView
                      horizontal={true}
                      contentContainerStyle={{}}
                      showsHorizontalScrollIndicator={false}>
                      {usersList.map(user => (
                        <TouchableOpacity
                        onPress={()=>setOpen(true)}
                          style={{marginRight: 5, alignItems: 'center'}}
                          key={user._id}>
                          {
                           user?.imageURL ?
                          <Avatar.Image
                            size={50}
                            source={{uri: user?.imageURL}}
                          />
                          :
                          <Avatar.Icon 
                          size={50}
                          icon="account-outline"
                          />
                          }
                          <Text style={{}} maxLength={10}>
                            {user.name.length > 5
                              ? user.name.substring(0, 6) + '..'
                              : user.name}
                          </Text>
                            {/* <Badge onPress={()=>removeItem(user._id)} style={{position:"absolute", right:"-10%", backgroundColor:theme.colors.background}} >
                          <Text style={{fontWeight:"bold"}}>X</Text>
                          </Badge> */}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </Card.Content>
                </Card>
               ) : null}
              
              <DropDownPicker
                renderListItem={props => <Item {...props} />}
                // multiple={true}
                open={open}
                value={users}
                items={items}
                placeholder={'Choose members'}
                searchPlaceholder={'Search'}
                setOpen={setOpen}
                setItems={setItems}
                listMode="MODAL"
                searchable={true}
                maxHeight="60%"
                dropDownDirection="BOTTOM"
                loading={dropdonwSearchLoading}
                disableLocalSearch={true}
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
                // styles
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.onSurface,
                }}
                searchTextInputStyle={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.onSurface,
                  color: theme.colors.onSurface,

                }}
                textStyle={{
                  fontSize: 16,
                  color: theme.colors.onSurface,
                }}
                dropDownContainerStyle={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.onSurface,
                }}
              />
            </View>

            <FAB
              icon="check"
              label="Add"
              style={styles.fab}
              disabled={isAddButtonDisable}
              loading={isAddButtonDisable}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>

      <Modal
        onBlur={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
        backdropOpacity={1}
        
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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
