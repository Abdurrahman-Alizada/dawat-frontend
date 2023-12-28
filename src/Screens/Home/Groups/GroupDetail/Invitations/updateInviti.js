// ==========================================
//  Title:  AddInviti
//  Author: Abdur Rahman
//  createdAt:   25 Oct, 2022
//  Modified by : -------
// ==========================================
import {TouchableOpacity, View} from 'react-native';
import React, {useState, useRef} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Avatar,
  IconButton,
  TextInput,
  Button,
  List,
  Text,
  useTheme,
  Chip,
  FAB,
} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AvatarModal from '../../../../Drawer/Profile/AvatarModal';
import {
  useAddInvitiMutation,
  useUpdateInvitiMutation,
  useDeleteInvitiMutation,
} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {Modalize} from 'react-native-modalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
const validationSchema = Yup.object().shape({
  invitiName: Yup.string()
    .required('Inviti name is required')
    .label('invitiName'),
  groupDescription: Yup.string().label('invitiDescription'),
});

const AddInviti = ({route, navigation}) => {
  const theme = useTheme();

  const {currentInviti} = route.params;
  const [updateInviti, {isLoading: updateLoading}] = useUpdateInvitiMutation();
  const [isEditStart, setIsEditStart] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [avatarURL, setAvatarURL] = useState(currentInviti.invitiImageURL);
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
        setIsEditStart(true);
      })
      .catch(e => {
        console.log('Error in image selection', e);
      });
    setModalVisible(false);
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
        setIsEditStart(true);
      })
      .catch(e => {
        console.log('Error in image selection', e);
      });
    setModalVisible(false);
  };

  let removePicture = () => {
    ImagePicker.clean()
      .then(() => {
        setfileData(null);
        setAvatarURL('');
        setIsEditStart(true);
      })
      .catch(e => {
        alert(e);
      });
  };

  const [status, setStatus] = useState(currentInviti?.lastStatus?.invitiStatus);
  const [selectedstatus, setSelectedStatus] = useState(
    currentInviti?.lastStatus?.invitiStatus,
  );
  const [statuses, setStatuses] = useState([
    {label: 'Invited', value: 'invited'},
    {label: 'Rejected', value: 'rejected'},
    {label: 'Pending', value: 'pending'},
    {label: 'Other', value: 'other'},
  ]);

  const [fileData, setfileData] = useState(null);
  const fileDataRef = useRef(null);

  const submitHandler = async values => {
    const uri = fileData?.path;
    const type = fileData?.mime;
    const name = values.invitiName;
    const photo = {uri, type, name};
    // cloudinaryUpload(source)
    const data = new FormData();
    data.append('file', photo);
    data.append('upload_preset', 'bzgif1or');
    data.append('cloud_name', 'dblhm3cbq');
    // if user upload image from mobile then execute if block otherwise else block.
    if (photo.uri) {
      fetch('https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload', {
        method: 'post',
        body: data,
      })
        .then(res => res.json())
        .then(async data => {
          await updateInviti({
            invitiId: currentInviti?._id,
            invitiName: values.invitiName,
            invitiDescription: values.invitiDescription,
            invitiImageURL: data.secure_url,
            lastStatus: status,
          })
            .then(response => {
              console.log('group has been updated  with image=>', response);
              navigation.goBack();
            })
            .catch(e => {
              console.log('error in updateHandler', e);
            });
        })
        .catch(err => {
          console.log(
            'An Error Occured While image Uploading in update function',
            err,
          );
        });
    } else {
      await updateInviti({
        invitiId: currentInviti?._id,
        invitiName: values.invitiName,
        invitiDescription: values.invitiDescription,
        invitiImageURL: avatarURL,
        lastStatus:
          status == currentInviti?.lastStatus?.invitiStatus ? null : status,
      })
        .then(response => {
          console.log('group has been updated without image=>', response);
          navigation.goBack();
        })
        .catch(e => {
          console.log('error in updateHandler', e);
        });
    }
  };

  const modalizeRef = useRef(null);
  const onOpenModalize = () => {
    modalizeRef.current?.open();
  };

  const onCloseModalize = () => {
    modalizeRef.current?.close();
  };

  return (
    <View style={{paddingHorizontal: '5%', flex: 1}}>
      <Formik
        initialValues={{
          invitiName: currentInviti?.invitiName,
          invitiDescription: currentInviti?.invitiDescription,
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
          <View style={{marginVertical: '2%', flex: 1}}>
            <TouchableOpacity
              style={{width: '50%', alignSelf: 'center'}}
              onPress={onOpenModalize}>
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
              error={errors.invitiName && touched.invitiName ? true : false}
              label="Name"
              placeholder="Name of Person who will be invited"
              mode="outlined"
              style={{marginVertical: '2%', width: '100%'}}
              onChangeText={handleChange('invitiName')}
              onChange={() => setIsEditStart(true)}
              onBlur={handleBlur('invitiName')}
              value={values.invitiName}
            />
            {errors.invitiName && touched.invitiName ? (
              <Text style={{color: theme.colors.error, fontSize: 13}}>
                {errors.invitiName}
              </Text>
            ) : null}

            <TextInput
              error={
                errors.invitiDescription && touched.invitiDescription
                  ? true
                  : false
              }
              label="Description"
              placeholder="Description about the person"
              mode="outlined"
              style={{marginVertical: '2%', width: '100%'}}
              onChangeText={handleChange('invitiDescription')}
              onChange={() => setIsEditStart(true)}
              onBlur={handleBlur('invitiDescription')}
              value={values.invitiDescription}
            />
            {errors.invitiDescription && touched.invitiDescription ? (
              <Text style={{color: theme.colors.error, fontSize: 13}}>
                {errors.invitiDescription}
              </Text>
            ) : null}

            <View>
              <Text style={{marginTop: '2%'}}>Inviti statuse</Text>
              <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                {statuses.map((statuse, index) => (
                  <Chip
                    key={index}
                    selected={selectedstatus === statuse.value ? true : false}
                    mode={
                      selectedstatus === statuse.value ? 'flat' : 'outlined'
                    }
                    style={{marginRight: '2%', marginVertical: '2%'}}
                    onPress={() => {
                      setSelectedStatus(statuse.value);
                      setStatus(statuse.value);
                      setIsEditStart(true);
                    }}>
                    {statuse.label}
                  </Chip>
                ))}
              </View>
            </View>

            <FAB
              icon="check"
              loading={updateLoading}
              disabled={!isEditStart || updateLoading}
              label={'Update'}
              style={{
                position: 'absolute',
                marginVertical: 16,
                right: 0,
                bottom: 0,
              }}
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
          setAvatarModalVisible={setAvatarModalVisible}
          setAvatarURL={setAvatarURL}
          setfileData={setfileData}
          fileDataRef={fileDataRef}
          setIsEditStart={setIsEditStart}
        />
      )}
    </View>
  );
};

export default AddInviti;
