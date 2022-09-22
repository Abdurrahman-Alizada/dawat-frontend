import {Text, StyleSheet, Modal, View} from 'react-native';
import React, {useState} from 'react';
import {Chip, Button, Input} from 'react-native-elements';

import {Formik} from 'formik';
import * as Yup from 'yup';

import {useSelector, useDispatch} from 'react-redux';
import {addGroup} from '../../../../../redux/reducers/groups/groups';

const validationSchema = Yup.object().shape({
  groupName: Yup.string().required('Group name is required').label('groupName'),
  groupDescription: Yup.string().label('groupName'),
});

const AddCategory = ({navigation}) => {
  const dispatch = useDispatch();

  const submitHandler = values => {
    //   dispatch(
    //     addGroup({
    //       name: values.groupName,
    //       avatar_url: 'https://bootdey.com/img/Content/avatar/avatar6.png',
    //     }),
    //   );
    //   navigation.navigate('HomeIndex');
  };
  return (
    <Formik
      initialValues={{
        groupName: '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => submitHandler(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={{}}>
          <Input
            label="Enter invite name"
            placeholder="Gulab"
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

          <Input
            placeholder="Optional"
            label="Enter Description"
            onChangeText={handleChange('groupDescription')}
            onBlur={handleBlur('groupDescription')}
            value={values.groupDescription}
          />

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
  );
};

export default AddCategory;

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
