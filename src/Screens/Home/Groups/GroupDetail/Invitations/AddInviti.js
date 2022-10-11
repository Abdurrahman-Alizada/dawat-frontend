import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Modal,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/AntDesign';
import {Button, Input} from 'react-native-elements';
import {Avatar, IconButton, TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {useDispatch} from 'react-redux';
import {addNewInviti} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import AsyncStorage from '@react-native-community/async-storage';

const validationSchema = Yup.object().shape({
  invitiName: Yup.string()
    .required('Inviti name is required')
    .label('invitiName'),
  groupDescription: Yup.string().label('invitiDescription'),
});

const AddInviti = ({setVisible, groupId}) => {
  const dispatch = useDispatch();

  const submitHandler = async values => {
    let token = await AsyncStorage.getItem('token');
    dispatch(
      addNewInviti({
        token: token,
        groupId: groupId,
        invitiName: values.invitiName,
        invitiDescription: values.invitiDescription,
      }),
    );
   setVisible(false)
  };

  const [fileData, setfileData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(false);

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
    setModalVisible(false);

  };

  // let removePicture = () => {
  //   ImagePicker.clean()
  //     .then(() => {
  //       setfileData(null);
  //       console.log('removed all tmp images from tmp directory');
  //     })
  //     .catch(e => {
  //       alert(e);
  //     });
  // };
  function renderFileData() {
    if (fileData) {
      return (
        <Avatar.Image size={60} source={{uri: fileData.path}} />
      );
    } else {
      return   <Avatar.Icon size={60} icon="account-circle-outline" />
    }
  }

  return (
    <View
      style={{
        backgroundColor: '#fff',
        margin: '5%',
        borderRadius: 10,
        padding: '5%',
      }}>
      <IconButton
        style={{position: 'absolute', right: 5}}
        icon="close-circle-outline"
        // mode="outlined"
        size={30}
        onPress={() => setVisible(false)}
      />
      <Formik
        initialValues={{
          invitiName: '',
          invitiDescription: '',
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
            <TouchableOpacity
              onPress={() => setModalVisible()}
              style={{alignSelf: 'center'}}>
              {renderFileData()}
            </TouchableOpacity>

            {/* <IconButton
              style={{alignSelf: 'center'}}
              icon="camera"
              mode="outlined"
              size={30}
              onPress={() => setModalVisible()}
            /> */}

            <TextInput
              error={errors.invitiName && touched.invitiName ? true : false}
              label="Enter invite name"
              mode="outlined"
              style={{marginVertical: '2%', width: '100%'}}
              onChangeText={handleChange('invitiName')}
              onBlur={handleBlur('invitiName')}
              value={values.invitiName}
            />
            {errors.invitiName && touched.invitiName ? (
              <Text style={styles.error}>{errors.invitiName}</Text>
            ) : null}

            <TextInput
              error={
                errors.invitiDescription && touched.invitiDescription
                  ? true
                  : false
              }
              label="Enter Description"
              mode="outlined"
              style={{marginVertical: '2%', width: '100%'}}
              onChangeText={handleChange('invitiDescription')}
              onBlur={handleBlur('invitiDescription')}
              value={values.invitiDescription}
            />
            {errors.invitiDescription && touched.invitiDescription ? (
              <Text style={styles.error}>{errors.invitiDescription}</Text>
            ) : null}

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
                  style={[
                    styles.modalView,
                    {position: 'absolute', width: '100%'},
                  ]}>
                  <IconButton
                    style={{position: 'absolute', right: 5}}
                    icon="close-circle-outline"
                    // mode="outlined"
                    size={30}
                    onPress={() => setModalVisible(false)}
                  />
                  <IconButton
                    style={{marginHorizontal: '2%'}}
                    icon="camera-image"
                    mode="outlined"
                    size={40}
                    onPress={openCamera}
                  />
                  <IconButton
                    style={{marginHorizontal: '2%'}}
                    icon="image-outline"
                    mode="outlined"
                    size={40}
                    onPress={openGallery}
                  />
                </View>
              </View>
            </Modal>

            <Button
              onPress={handleSubmit}
              title="Add "
              titleStyle={{fontWeight: 'bold', width: '70%'}}
              buttonStyle={{
                backgroundColor: '#334C8C',
                borderRadius: 10,
                borderColor: '#C1C2B8',
                borderWidth: 0.5,
                height: 50,
              }}
            />
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
