import React, {useEffect, useState} from 'react';

import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import LoginWithFacebook from './LoginWithFacebook';
// import LoginWithGoogle from './LoginWithGoogle';
import * as Yup from 'yup';
import {TextInput, Button} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../redux/reducers/user/userThunk';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter valid email')
    .required('Email is required')
    .label('Email'),
  password: Yup.string()
    .min(2, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required')
    .label('Password'),
});

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const submitHandler = values => {
    dispatch(
      loginUser({
        email: values.email,
        password: values.password,
        navigation : navigation
      })
    )
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'flex-start', marginTop: 5}}>
          <Icon size={28} name="times" />
        </View>

        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            marginVertical: '2%',
            fontWeight: '500',
            width: '70%',
            textAlign: 'center',
          }}>
          Welcome back! Sign in to continue!{' '}
        </Text>

        {/* <View>
          <LoginWithGoogle />

          <LoginWithFacebook />

          <Button
            title="Sign in With Apple"
            icon={{
              name: 'apple',
              type: 'font-awesome',
              size: 30,
              color: '#fff',
            }}
            iconContainerStyle={{width: '20%'}}
            titleStyle={{fontWeight: 'bold', width: '70%'}}
            buttonStyle={{
              backgroundColor: '#1E293B',
              borderRadius: 10,
              borderColor: '#C1C2B8',
              borderWidth: 0.5,
              height: 50,
            }}
          />
        </View> */}

        {/* <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            alignSelf: 'center',
            marginVertical: '2%',
          }}>
          or
        </Text> */}

        <Formik
          initialValues={{
            email: '',
            password: '',
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
              <TextInput
                error={errors.email && touched.email ? true : false}
                label="Email"
                mode="outlined"
                style={{marginVertical: '2%'}}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              {errors.email && touched.email ? (
                <Text style={styles.error}>{errors.email}</Text>
              ) : null}
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry={true}
                style={{marginVertical: '2%'}}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {errors.password && touched.password ? (
                <Text style={styles.error}>{errors.password}</Text>
              ) : (
                null
              )}
              <Button
                mode="contained"
                style={{
                  marginTop: '2%',
                  borderRadius: 5,
                  backgroundColor: '#334C8C',
                }}
                onPress={handleSubmit}>
                Sign in
              </Button>

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: '2%',
                }}>
                Don't have an account?{' '}
              </Text>

              <Button
                mode="outlined"
                style={{marginTop: '2%', borderRadius: 5}}
                onPress={() => navigation.navigate('Register')}
                // onPress={() => console.log('asdf')}
              >
                Create account
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  img: {
    width: 100,
    alignSelf: 'center',
    height: 100,
    borderRadius: 400,
  },

  buttonStyle: {
    height: 60,
    justifyContent: 'flex-start',
    paddingHorizontal: 50,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: '2%',
    backgroundColor: '#EDEEF0',
  },
  buttonTextStyle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    // marginLeft: 20,
  },
});
