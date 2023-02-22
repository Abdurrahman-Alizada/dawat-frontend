import {
  TouchableOpacity,
  StyleSheet,
  Modal,
  View,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
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
  Button,
} from 'react-native-paper';
import AvatarModal from '../Menus/Profile/AvatarModal';
import {useDispatch} from 'react-redux';
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

  const [fileData, setfileData] = useState(null);
  const fileDataRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddButtonDisable, setIsAddButtonDisable] = useState(false);
  const [avatarURL, setAvatarURL] = useState("");
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  let openCamera = () => {
    setModalVisible(!modalVisible);

    ImagePicker.openCamera({
      // cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setfileData(image);
        fileDataRef.current = image;
        console.log(image);
      })
      .catch(e => {
        console.log('Error in image selection', e);
      });
  };

  let openGallery = () => {
    setModalVisible(!modalVisible);

    ImagePicker.openPicker({
      // cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setfileData(image);
        fileDataRef.current = image;
        console.log(image);
      })
      .catch(e => {
        console.log('Error in image selection', e);
      });
  };

  let removePicture = () => {
    ImagePicker.clean()
      .then(() => {
        setfileData(null);
        fileDataRef.current = null;
        setAvatarURL(false)
      })
      .catch(e => {
        console.log(e);
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

      navigation.navigate('AddGroupMembers', {
        groupName: values.groupName,
        groupDescription: values.groupDescription,
        imageURL: '',
        isChat: true,
        isTasks: true,
        isInvitations: true,
        isMute: false,
        members: users,
        data: data,
      });
    } else {
      navigation.navigate('AddGroupMembers', {
        groupName: values.groupName,
        groupDescription: values.groupDescription,
        imageURL: avatarURL,
        isChat: true,
        isTasks: true,
        isInvitations: true,
        isMute: false,
        members: users,
      });
    }
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
                   {
                    avatarURL ?
                    <Avatar.Image
                    source={{uri: avatarURL}}
                    style={{alignSelf: 'center'}}
                    size={100}
                  />
                    :
                    <Avatar.Icon
                      icon="account-circle-outline"
                      style={{alignSelf: 'center'}}
                      size={100}
                    />
                   }
                  
                  </View>
                )}
              </TouchableOpacity>
              { (fileData || avatarURL) && (
                <Button
                  // style={{marginTop: '5%'}}
                  icon="delete"
                  mode="text"
                  onPress={removePicture}>
                  Remove image
                </Button>
              )}
              <TextInput
                style={{marginTop: '4%'}}
                error={errors.groupName && touched.groupName ? true : false}
                label="Group Name"
                mode="outlined"
                onChangeText={handleChange('groupName')}
                onBlur={handleBlur('groupName')}
                value={values.groupName}
              />
              {errors.groupName && touched.groupName ? (
                <Text style={{color:theme.colors.error}}>{errors.groupName}</Text>
              ) : null}

              <TextInput
                style={{marginTop: '4%'}}
                error={
                  errors.groupDescription && touched.groupDescription
                    ? true
                    : false
                }
                // placeholder="Group Description"
                label={`Group Description (${ 99 - values.groupDescription.length})`}
                mode="outlined"
                multiline
                maxLength={99}
                numberOfLines={3}
                // style={{marginVertical: '2%', width: '85%'}}
                onChangeText={handleChange('groupDescription')}
                onBlur={handleBlur('groupDescription')}
                value={values.groupDescription}
              />
              {errors.groupDescription && touched.groupDescription ? (
                <Text style={styles.error}>{errors.groupDescription}</Text>
              ) : null}
            </View>

            <FAB
              icon="arrow-right"
              label="Next"
              style={styles.fab}
              // disabled={isAddButtonDisable}
              // loading={isAddButtonDisable}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>

      <Modal
        onBlur={() => setModalVisible(false)}
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{
           flex: 1,
           justifyContent: 'flex-end',
           alignItems: 'center',
           backgroundColor:theme.colors.backdrop
        }}>
          <View
            style={[styles.modalView, {position: 'absolute', width: '100%', backgroundColor:theme.colors.surface}]}>
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
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="account-circle-outline"
                mode="outlined"
                size={40}
                onPress={() => {
                  setModalVisible(false);
                  setAvatarModalVisible(true);
                }}
              />
              <Text>Avatars</Text>
            </View>
          </View>
        </View>
      </Modal>

      {avatarModalVisible && (
        <AvatarModal
          avatarModalVisible={avatarModalVisible}
          setAvatarModalVisible={setAvatarModalVisible}
          setAvatarURL={setAvatarURL}
          setfileData={setfileData}
          fileDataRef={fileDataRef}
          // imageUploadHandler={imageUploadHandler}
        />
      )}

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
