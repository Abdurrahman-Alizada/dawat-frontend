import React, {useState} from 'react';

import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Yup from 'yup';
import {TextInput, Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import { useLoginUserMutation } from '../../../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-community/async-storage';

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

  const [visible, setVisible] = useState(false);

  const [loginUser, {isLoading, isError, error}] = useLoginUserMutation();

  const submitHandler = async values => {
   
    const { data } = await loginUser({ email: values.email, password: values.password})

    if(data?._id){
      await AsyncStorage.setItem('isLoggedIn', 'login');
      await AsyncStorage.setItem('id', data._id);
      await AsyncStorage.setItem('token', data?.token);
      await AsyncStorage.setItem('userId', data?._id);
      await AsyncStorage.setItem('name', data?.name);
      await AsyncStorage.setItem('email', data?.email);
      console.log('user has been logged in =>', data);
      navigation.navigate("Drawer");
    }
    if(!data?._id && isError){
      console.log("error in login ", error)  
      setVisible(true)
    }

  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <Portal>
        <Dialog visible={visible} onDismiss={()=>setVisible(true)}>
            <Dialog.Title>Login Error</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Something went wrong {error?.data?.message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>setVisible(false)}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
      </Portal>

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

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={ (values, actions) => {
            submitHandler(values)
               actions.resetForm({
                  email: '',
                  password: '',
               })
            } 
          }>
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
              loading={isLoading}
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
                onPress={() => navigation.navigate('SignUpwithEmail')}
                // onPress={() => navigation.navigate('Register')}
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
