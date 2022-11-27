// ==========================================
//  Title:  AddInviti
//  Author: Abdur Rahman
//  createdAt:   25 Oct, 2022
//  Modified by : -------
// ==========================================
import {TouchableOpacity, Text, StyleSheet, Modal, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import ImagePicker from "react-native-image-crop-picker";
import {Avatar, IconButton, TextInput, Button, List} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';

import {
  useAddInvitiMutation,
  useUpdateInvitiMutation,
  useDeleteInvitiMutation
} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
// import { useNavigation } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
  invitiName: Yup.string()
    .required('Inviti name is required')
    .label('invitiName'),
  groupDescription: Yup.string().label('invitiDescription'),
});

const AddInviti = ({route, navigation}) => {
  const { groupId, currentInviti} = route.params
  const [addInviti, {isLoading}] = useAddInvitiMutation();
  const [updateInviti, {isLoading: updateLoading}] = useUpdateInvitiMutation();
  const [deleteInviti, {isLoading: deleteLoading}] = useDeleteInvitiMutation();
  const [isEditStart, setIsEditStart] = useState(false)
  const submitHandler = async values => {
    currentInviti?._id ? updateHandler(values) : addHandler(values);
  };

  const [fileData, setfileData] = useState(null);
  const [invitiImageURL, setInvitiImageURL] = useState(null);
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
      setIsEditStart(true)
    });
    setModalVisible(false);
  };

  const cloudinaryUpload = (photo) => {
    const data = new FormData()
    data.append('file', photo)
    data.append('upload_preset', 'bzgif1or')
    data.append("cloud_name", "dblhm3cbq")
    fetch("https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json()).
      then(data => {
        setInvitiImageURL(data.secure_url)
      }).catch(err => {
       console.log("An Error Occured While Uploading", err)
      })
  }

  let openGallery = () => {
    setModalVisible(!modalVisible);
    ImagePicker.openPicker(
      {
      // cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setfileData(image);
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
      return <Avatar.Image size={60} source={{uri: fileData.path}} />;
    } else {
      return <Avatar.Icon size={60} icon="account-circle-outline" />;
    }
  }

  const [stautsDropdonwOpen, setStautsDropdonwOpen] = useState(false);
  const [stauts, setStatus] = useState(currentInviti?.lastStatus?.invitiStatus);
  const [statuses, setStatuses] = useState([
    {label: 'Invited', value: 'invited'},
    {label: 'Rejected', value: 'rejected'},
    {label: 'Pending', value: 'pending'}
  ]);

  const addHandler = async values => {
    
    const uri = fileData?.path;
    const type = fileData?.mime;
    const name = values.invitiName;
    const photo = {uri,type,name}
    // cloudinaryUpload(source)
    const data = new FormData()
    data.append('file', photo)
    data.append('upload_preset', 'bzgif1or')
    data.append("cloud_name", "dblhm3cbq")
    fetch("https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json()).
      then(async (data) => {
        setInvitiImageURL(data.secure_url)
        await addInviti({
          groupId: groupId,
          invitiName: values.invitiName,
          invitiDescription: values.invitiDescription,
          invitiImageURL:data.secure_url,
          lastStatus: stauts,
        })
          .then(response => {
            navigation.goBack()
          })
          .catch(e => {
            console.log('error in addHandler', e);
          });
      }).catch(err => {
       console.log("An Error Occured While Uploading", err)
      })
 
  };
  const updateHandler = async values => {
    await updateInviti({
      invitiId: currentInviti?._id,
      invitiName: values.invitiName,
      invitiDescription: values.invitiDescription,
      lastStatus:stauts
    })
      .then(response => {
        console.log('group has been updated =>', response);
        navigation.goBack()
      })
      .catch(e => {
        console.log('error in updateHandler', e);
      });
  };
  const deleteHandler = async ()=>{
    await deleteInviti({groupId:groupId, invitiId:currentInviti?._id})
    .then(response => {
      navigation.goBack();
    })
    .catch(e => {
      console.log('error in deleteHandler', e);
    });
  }


  return (
    <ScrollView
      style={{ padding: '5%' }}>
      
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
          <View style={{marginVertical: '2%'}}>
            <TouchableOpacity
              onPress={() => setModalVisible()}
              style={{alignSelf: 'center'}}>
              {renderFileData()}
            </TouchableOpacity>

            <TextInput
              error={errors.invitiName && touched.invitiName ? true : false}
              label="Enter invite name"
              mode="outlined"
              style={{marginVertical: '2%', width: '100%'}}
              onChangeText={handleChange('invitiName')}
              onChange={()=>setIsEditStart(true)}
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
              onChange={()=>setIsEditStart(true)}
              onBlur={handleBlur('invitiDescription')}
              value={values.invitiDescription}
            />
            {errors.invitiDescription && touched.invitiDescription ? (
              <Text style={styles.error}>{errors.invitiDescription}</Text>
            ) : null}


            <DropDownPicker
                style={{marginVertical: '2%', width: '100%'}}
                open={stautsDropdonwOpen}
                placeholder="Inviti Status"
                value={stauts}
                items={statuses}
                setOpen={setStautsDropdonwOpen}
                setValue={setStatus}
                setItems={setStatuses}
              />

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
            {currentInviti?.invitiName ? (
              <View>
                <Button
                  loading={updateLoading}
                  disabled={!isEditStart}
                  mode="contained"
                  onPress={handleSubmit}
                  style={{
                    borderRadius: 10,
                    borderColor: '#C1C2B8',
                    borderWidth: 0.5,
                    padding: '1%',
                    marginVertical: '2%',
                  }}>
                  Update
                </Button>
                <Button
                  mode="contained"
                  onPress={()=>deleteHandler()}
                  style={{marginVertical:"5%", padding:"1%"}}
                  >
                  Delete
                </Button>
              </View>
            ) : (
              <Button
                loading={isLoading}
                mode="contained"
                onPress={handleSubmit}
                style={{
                  borderRadius: 10,
                  borderColor: '#C1C2B8',
                  borderWidth: 0.5,
                  padding: '1%',
                  marginVertical: '2%',
                }}>
                Add
              </Button>
            )}
          </View>
        )}
      </Formik>

     {currentInviti?.invitiName &&
      <List.Accordion title="More">
        <List.Subheader>Added by</List.Subheader>
        <View
          style={{
            borderRadius: 10,
            textAlign: 'center',
            borderColor: '#C1C2B8',
            borderWidth: 0.5,
            padding: '2%',
            marginVertical: '2%',
          }}>
          <List.Item title={ currentInviti?.addedBy?.name}  left={() =><View><Avatar.Icon size={30} icon="account-circle-outline" /></View> } />
          <Text style={{paddingHorizontal:"15%"}}>at 3/12/2022</Text>
        </View>
      
        <List.Subheader>History</List.Subheader>
          {currentInviti?.statuses?.map((Status, index)=>          
          <View
          key={index}
          style={{
            borderRadius: 10,
            textAlign: 'center',
            borderColor: '#C1C2B8',
            borderWidth: 0.5,
            padding: '2%',
            marginVertical: '2%',
          }}>
          <List.Item title="Noman AKhtar"  left={() =><View><Avatar.Icon size={30} icon="account-circle-outline" /></View> } />
          <Text style={{paddingHorizontal:"15%"}}>at 3/12/2022</Text>
          </View>
          )

          }
  
      </List.Accordion>
      }

    </ScrollView>
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
    borderRadius: 10,
    marginVertical: '2%',
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
