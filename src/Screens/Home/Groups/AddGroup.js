import {TouchableOpacity, StyleSheet, View} from 'react-native';
import React, {useState, useRef} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Modalize} from 'react-native-modalize';
import {
  Text,
  Avatar,
  TextInput,
  IconButton,
  FAB,
  useTheme,
  Button,
} from 'react-native-paper';
import AvatarModal from '../Menus/Profile/AvatarModal';

const validationSchema = Yup.object().shape({
  groupName: Yup.string().required('Group name is required').label('groupName'),
  groupDescription: Yup.string().label('groupDescription'),
});

const AddGroup = ({navigation, onClose}) => {
  const [users, setUsers] = useState([]);

  const [fileData, setfileData] = useState(null);
  const fileDataRef = useRef(null);
  const [avatarURL, setAvatarURL] = useState('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  let openCamera = () => {
    onCloseModalize();

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
    onCloseModalize();

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
        setAvatarURL(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const submitHandler = async values => {
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

  const modalizeRef = useRef(null);
  const onOpenModalize = () => {
    modalizeRef.current?.open();
  };

  const onCloseModalize = () => {
    modalizeRef.current?.close();
  };

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
              <TouchableOpacity onPress={onOpenModalize}>
                {fileData ? (
                  <Avatar.Image
                    source={{uri: fileData.path}}
                    style={{alignSelf: 'center'}}
                    size={100}
                  />
                ) : (
                  <View>
                    {avatarURL ? (
                      <Avatar.Image
                        source={{uri: avatarURL}}
                        style={{alignSelf: 'center'}}
                        size={100}
                      />
                    ) : (
                      <Avatar.Icon
                        icon="account-circle-outline"
                        style={{alignSelf: 'center'}}
                        size={100}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>
              {(fileData || avatarURL) && (
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
                <Text style={{color: theme.colors.error}}>
                  {errors.groupName}
                </Text>
              ) : null}

              <TextInput
                style={{marginTop: '4%'}}
                error={
                  errors.groupDescription && touched.groupDescription
                    ? true
                    : false
                }
                // placeholder="Group Description"
                label={`Group Description (${
                  99 - values.groupDescription.length
                })`}
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

      <Modalize
        modalStyle={{backgroundColor: theme.colors.background}}
        ref={modalizeRef}
        adjustToContentHeight={true}
        handlePosition="inside">
        <View
          style={{
            paddingVertical: '8%',
            paddingHorizontal: '5%',
            flexDirection: 'row',
            backgroundColor: theme.colors.background,
          }}>
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
                onCloseModalize();
                setAvatarModalVisible(true);
              }}
            />
            <Text>Avatars</Text>
          </View>
        </View>
      </Modalize>

      {avatarModalVisible && (
        <AvatarModal
          avatarModalVisible={avatarModalVisible}
          onCloseModalize={onCloseModalize}
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    color: 'red',
  },
});
