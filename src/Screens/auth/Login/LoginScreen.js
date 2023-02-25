import React, {useLayoutEffect, useState} from 'react';

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Yup from 'yup';
import {
  TextInput,
  Button,
  Dialog,
  Paragraph,
  Banner,
  Portal,
  useTheme,
} from 'react-native-paper';
import {useLoginUserMutation} from '../../../redux/reducers/user/userThunk';
import { handleCurrentLoaginUser } from '../../../redux/reducers/user/user';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
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

const LoginScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const [verificationBannerVisible, setVerificationBannerVisible] = useState(
    route.params ? true : false,
  );
 

  const [bannerMessage, setBannerMessage] = useState(
    route?.params?.message ? route?.params?.message : '',
  );
  const [errorMessage, setErrorMessage] = useState('');

  const [loginUser, {isLoading, isError, error}] = useLoginUserMutation();
  const submitHandler = async values => {
    const response = await loginUser({
      email: values.email,
      password: values.password,
    });

    if (response?.error) {
      setVisible(true);
    }
    if (response?.data?.message) {
      setErrorMessage(response?.data?.message);
      setVisible(true);
    }
    if (!response?.data?.user?.verified) {
      setBannerMessage('Please verify the provided email first');
      setVerificationBannerVisible(true);
    }
    if (response?.data?.token) {
      dispatch(handleCurrentLoaginUser(response?.data?.user))
      await AsyncStorage.setItem('isLoggedIn', 'login');
      await AsyncStorage.setItem('id', response?.data?.user?._id);
      await AsyncStorage.setItem('token', response?.data?.token);
      await AsyncStorage.setItem('userId', response?.data?.user?._id);
      await AsyncStorage.setItem('name', response.data.user.name);
      await AsyncStorage.setItem('email', response?.data?.user?.email);
      navigation.navigate('Drawer');
    }
    // if (!data?._id && isError) {
    //   console.log('error in login ', error);
    //   setVisible(true);
    // }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(true)}>
          <Dialog.Title>Login Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph> {error?.data?.message} </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: '5%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 100 / 2,
                borderWidth: 10,
                borderColor: '#097969',
              }}
            />

            <View
              style={{
                width: 20,
                height: 20,
                alignSelf: 'flex-end',
                borderRadius: 100 / 2,
                backgroundColor: '#F77A55',
              }}
            />
          </View>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 18,
              marginVertical: '2%',
              fontWeight: '500',
              textAlign: 'center',
            }}>
            Application name
          </Text>
        </View>
        <Text
          style={{
            // alignSelf: 'center',
            fontSize: 15,
            marginTop: '2%',
            fontWeight: '400',
            // textAlign: 'center',
          }}>
          Enter your email and password to continue.
        </Text>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            submitHandler(values);
            // actions.resetForm({
            //   email: '',
            //   password: '',
            // });
          }}>
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
                placeholder="Enter your email"
                mode="outlined"
                style={{marginVertical: '2%'}}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                activeOutlineColor={theme.colors.secondary}
              />
              {errors.email && touched.email ? (
                <Text style={{color: theme.colors.error}}>{errors.email}</Text>
              ) : null}
              <TextInput
                error={errors.password && touched.password ? true : false}
                label="Password"
                mode="outlined"
                secureTextEntry={true}
                style={{marginVertical: '2%'}}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                activeOutlineColor={theme.colors.secondary}
              />
              {errors.password && touched.password ? (
                <Text style={{color: theme.colors.error}}>
                  {errors.password}
                </Text>
              ) : null}
              <Button
                loading={isLoading}
                style={{
                  marginTop: '5%',
                  padding: '1%',
                }}
                contentStyle={{padding: '1%'}}
                theme={{roundness: 1}}
                mode="contained"
                onPress={handleSubmit}
                buttonColor={theme.colors.secondary}>
                Sign in
              </Button>

              <View
                style={{
                  marginTop: '10%',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  justifyContent: 'space-evenly',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                  }}>
                  Don't have an account?
                </Text>
                <Button
                  mode="contained-tonal"
                  compact
                  textColor={theme.colors.onSecondary}
                  buttonColor={theme.colors.secondary}
                  theme={{roundness: 2}}
                  style={{marginTop: '2%', paddingHorizontal: '1%'}}
                  // onPress={() => navigation.navigate('SignUpwithEmail')}>
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  Create account
                </Button>
              </View>
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
