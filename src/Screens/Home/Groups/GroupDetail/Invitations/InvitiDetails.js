import {Text, StyleSheet, View, TouchableOpacity,Modal, ScrollView} from 'react-native';
import React, { useState } from 'react';
import {TextInput, Button, Appbar, Avatar,Menu,List} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  taskTitle: Yup.string().required('Task title is required').label('taskTitle'),
  taskDescription: Yup.string().label('taskDescription'),
});

const InvitiDetails = ({route}) => {
  const [fileData, setfileData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = React.useState(true);
console.log("hello", route.params?.currentInviti?.addedBy?.name)
    function renderFileData() {
        if (fileData) {
          return <Avatar.Image size={80} source={{uri: fileData.path}} />;
        } else {
          return <Avatar.Icon size={80} icon="account-circle-outline" />;
        }
      }

 return (
    <View>
        <Appbar.Header>
        <Appbar.BackAction 
        // onPress={() => navigation.goBack()} 
        />
        <Appbar.Content
          title={'Inviti details' }
        />
      </Appbar.Header>
      <Formik
        initialValues={{
          invitiName: route.params?.currentInviti?.invitiName ? route.params?.currentInviti?.invitiName :"",
          invitiDescription: route.params?.currentInviti?.invitiDescription ? route.params?.currentInviti?.invitiDescription :"",
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
          <ScrollView style={{marginVertical: '5%', paddingTop:"5%", paddingHorizontal:"5%"}}>
            <TouchableOpacity
              onPress={() => setModalVisible()}
              style={{alignSelf: 'center'}}>
              {renderFileData()}
            </TouchableOpacity>

            <TextInput
              error={errors.invitiName && touched.invitiName ? true : false}
              label="Invite name"
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
              label="Description"
              mode="outlined"
              style={{marginVertical: '2%', width: '100%'}}
              onChangeText={handleChange('invitiDescription')}
              onBlur={handleBlur('invitiDescription')}
              value={values.invitiDescription}
            />

            {errors.invitiDescription && touched.invitiDescription ? (
              <Text style={styles.error}>{errors.invitiDescription}</Text>
            ) : null}

            {/* <Modal
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
            </Modal> */}

            <Button
                mode="contained"
                // onPress={handleSubmit}
                style={{
                  backgroundColor: '#334C8C',
                  borderRadius: 10,
                  borderColor: '#C1C2B8',
                  borderWidth: 0.5,
                  padding: '1%',
                  marginVertical: '2%',
                }}>
                Add
              </Button>

            <List.Accordion title="More">
                  <List.Subheader>Added by</List.Subheader>
                  <View
                    style={{
                    //   fontWeight: 'bold',
                      borderRadius: 10,
                      textAlign: 'center',
                      borderColor: '#C1C2B8',
                      borderWidth: 0.5,
                      padding: '2%',
                      marginVertical: '2%',
                    }}>
                    <List.Item title={ route.params?.currentInviti?.addedBy?.name}  left={() =><View><Avatar.Icon size={30} icon="account-circle-outline" /></View> } />
                    <Text style={{paddingHorizontal:"15%"}}>at 3/12/2022</Text>
                  </View>
                
                  <List.Subheader>Invited by</List.Subheader>
                   <View
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
            
            </List.Accordion>

          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default InvitiDetails;

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
