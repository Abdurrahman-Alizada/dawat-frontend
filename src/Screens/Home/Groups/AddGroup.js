import {
  TouchableOpacity,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  View,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/AntDesign';
import {Chip, Button, Input} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';

import {useSelector, useDispatch} from 'react-redux';
import {addNewGroup} from '../../../redux/reducers/groups/groupThunk';

const validationSchema = Yup.object().shape({
  groupName: Yup.string().required('Group name is required').label('groupName'),
  groupDescription: Yup.string().label('groupName'),
});

const AddGroup = ({navigation, onClose}) => {
  const [userId, setuserId] = React.useState(null);

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([
    {
      label: 'Basit',
      value: '6303618c8a24e03f142414f4',
      icon: () => (
        <ImageBackground
          source={require('../../../assets/images/auth/checkInbox.png')}
          style={{width: 35, height: 35}}
          imageStyle={{borderRadius: 25}}
        />
      ),
    },
    {
      label: 'Gulab',
      value: '63036572f9005d3684d967d9',
      icon: () => (
        <ImageBackground
          source={require('../../../assets/images/onboarding/1.png')}
          style={{width: 35, height: 35}}
          imageStyle={{borderRadius: 25}}
        />
      ),
    },
    {
      label: 'Khan',
      value: '6303677058c03728fc0a554f',
      icon: () => (
        <ImageBackground
          source={require('../../../assets/images/onboarding/1.png')}
          style={{width: 35, height: 35}}
          imageStyle={{borderRadius: 25}}
        />
      ),
    },

  ]);

  useEffect(() => {
    const getUserInfo = async () => {
      let userId = await AsyncStorage.getItem('userId');
      setuserId(userId);
      console.log('user id is..', userId);
    };
    getUserInfo();
  }, []);

  const dispatch = useDispatch();

  const submitHandler = values => {
    console.log("values are", values, users)
    dispatch(
      addNewGroup({
        groupName: values.groupName,
        members: users,
      }),
    );
    navigation.navigate('HomeIndex');
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
    <View style={{padding: '5%', backgroundColor:"#fff", flex:1}}>
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
            <View>
              <Input
                label="Enter your Group name"
                placeholder="Czn Marriage etc."
                onChangeText={handleChange('groupName')}
                onBlur={handleBlur('groupName')}
                value={values.groupName}
                renderErrorMessage={true}
                errorMessage={
                  errors.groupName && touched.groupName ? (
                    <Text style={styles.error}>{errors.groupName}</Text>
                  ) : (
                    ''
                  )
                }
              />
            </View>

            <View style={{marginBottom: '2%'}}>
              <DropDownPicker
               multiple={true}
               min={0}
               max={3}
               open={open}
                value={users}
                items={items}
                placeholder={'Choose a member'}
                searchPlaceholder={'Search'}
                setOpen={setOpen}
                setValue={val => {
                  setUsers(val)
                }}
                setItems={setItems}
                listMode="MODAL"
                searchable={true}
                // addCustomItem={true}
                loading={true}
                searchContainerStyle={{
                  borderBottomColor: '#dfdfdf',
                }}
                style={[styles.inputStyle]}
                textStyle={{
                  fontSize: 16,
                  fontWeight: '700',
                }}
                labelStyle={{
                  fontWeight: 'bold'
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
    color: 'red',
    marginLeft: 20,
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
