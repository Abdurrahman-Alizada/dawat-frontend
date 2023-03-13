import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {
  TextInput,
  Dialog,
  Paragraph,
  Portal,
  useTheme,
  Button,
} from 'react-native-paper';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {useRegisterUserMutation} from '../../../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').label('Name'),
  email: Yup.string()
    .email('Please enter valid email')
    .required('Email is required')
    .label('Email'),
  password: Yup.string()
    .min(2, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required')
    .label('Password'),
  passwordConfirmation: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .label('passwordConfirmation'),
});

const SignupWithEmail = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [registerUser, {isLoading, isError, error}] = useRegisterUserMutation();

  const submitHandler = async values => {
    const response = await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    });
    if(response?.error?.status === 409 ){
      setVisible(true);
      return;
    }
   
    if(response.data.message === "An Email sent to your account please verify" ){
      navigation.navigate("Login", {message : response.data.message})
    }
    
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: '2%',
      }}>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(true)}>
          <Dialog.Title>Login Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph> {error?.data?.message}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
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
            <View style={{margin: '2%'}}>
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
                Enter the following details to continue.
              </Text>

              <TextInput
                label="Name"
                placeholder="Enter Your user name here"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                mode="outlined"
                value={values.name}
                activeOutlineColor={theme.colors.secondary}
                error={errors.name && touched.name ? true : false}
                style={{marginTop: '2%'}}
              />
              {errors.name && touched.name ? (
                <Text style={{color: theme.colors.error}}>{errors.name}</Text>
              ) : null}

              <TextInput
                label="Email"
                placeholder="Enter Your email here"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                mode="outlined"
                value={values.email}
                activeOutlineColor={theme.colors.secondary}
                error={errors.email && touched.email ? true : false}
                style={{marginTop: '2%'}}
              />
              {errors.email && touched.email ? (
                <Text style={{color: theme.colors.error}}>{errors.email}</Text>
              ) : null}

              <TextInput
                error={errors.password && touched.password ? true : false}
                label="Password"
                placeholder="Enter your password here"
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

              <TextInput
                error={errors.password && touched.password ? true : false}
                label="Confirm password"
                placeholder="Confirm your password"
                mode="outlined"
                secureTextEntry={true}
                style={{marginVertical: '2%'}}
                onChangeText={handleChange('passwordConfirmation')}
                onBlur={handleBlur('passwordConfirmation')}
                value={values.passwordConfirmation}
                activeOutlineColor={theme.colors.secondary}
              />
              {errors.passwordConfirmation && touched.passwordConfirmation ? (
                <Text style={{color: theme.colors.error}}>
                  {errors.passwordConfirmation}
                </Text>
              ) : null}

              <Button
                loading={isLoading}
                disabled={isLoading}
                style={{
                  marginTop: '5%',
                  padding: '1%',
                }}
                theme={{roundness: 1}}
                mode="contained"
                onPress={handleSubmit}
                buttonColor={theme.colors.secondary}>
                Sign up
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
                    width: '58%',
                  }}>
                  Already have an account?
                </Text>
                <Button
                  mode="contained-tonal"
                  compact
                  textColor={theme.colors.onSecondary}
                  buttonColor={theme.colors.secondary}
                  theme={{roundness: 2}}
                  style={{
                    marginTop: '2%',
                    paddingHorizontal: '1%',
                    width: '40%',
                  }}
                  onPress={() => navigation.navigate('Login')}>
                  Sign in
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default SignupWithEmail;

const styles = StyleSheet.create({
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
  borderRed: {
    borderColor: 'red',
    borderBottomWidth: 4,
  },
  borderGreen: {
    borderColor: '#ddd',
    borderBottomWidth: 4,
  },
  error: {
    color: 'red',
    marginLeft: 20,
  },
});
