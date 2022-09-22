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
import { Button, Input} from 'react-native-elements';

import {Formik} from 'formik';
import * as Yup from 'yup';

import {useDispatch} from 'react-redux';
import { addNewInviti } from '../../../../../redux/reducers/groups/invitations/invitaionThunk';

const validationSchema = Yup.object().shape({
  invitiName: Yup.string().required('Inviti name is required').label('invitiName'),
  groupDescription: Yup.string().label('invitiDescription'),
});

const AddInviti = ({close, groupId}) => {
  const dispatch = useDispatch();

  const submitHandler = values => {
    dispatch(
      addNewInviti({
        groupId :groupId,
        invitiName: values.invitiName,
        invitiDescription: values.invitiDescription,
      }),
    );
   close()
  };

  const [fileData, setfileData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroup, setNewGroup] = useState({name: '', avatar_url: ''});

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

  return (
    <View style={{ padding:'5%' }}>
      <Formik
        initialValues={{
          invitiName: '',
          invitiDescription:''
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
            <Input
            label="Enter invite name"
            placeholder="Gulab"
            onChangeText={handleChange('invitiName')}
            onBlur={handleBlur('invitiName')}
            value={values.invitiName}
            renderErrorMessage={true}
            errorMessage={
                errors.invitiName && touched.invitiName ? (
                <Text style={styles.error}>{errors.invitiName}</Text>
                ) : (
                ''
                )
            }
            />
        
            <Input
              placeholder="Optional"
              label="Enter Description"
              onChangeText={handleChange('invitiDescription')}
              onBlur={handleBlur('invitiDescription')}
              value={values.invitiDescription}
            />

            {renderFileData()}

            <Button
              onPress={() => setModalVisible(true)}
              icon={{
                name: 'image',
                type: 'font-awesome',
                size: 20,
                color: '#333',
              }}
              title="Add Image "
              titleStyle={{fontWeight: 'bold', color: '#333'}}
              buttonStyle={{
                backgroundColor: '#EDEEF0',
                borderRadius: 10,
                height: 50,
              }}
            />

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
    justifyContent: 'center',
    alignItems: 'center',
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
