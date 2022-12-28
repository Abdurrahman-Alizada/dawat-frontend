import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {TextInput, Dialog, Paragraph, Portal} from 'react-native-paper';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import { useRegisterUserMutation } from '../../../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-community/async-storage';

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
  
  const [visible, setVisible] = useState(false);
  const [registerUser, {isLoading, isError, error}] = useRegisterUserMutation();

  const submitHandler =async values => {
    console.log("hello value", values)
    const { data } = await registerUser({ 
      name: values.name,
      email: values.email,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    })

      console.log("hello data", data)

      if(data?._id){
      await AsyncStorage.setItem('isLoggedIn', 'login');
      await AsyncStorage.setItem('id', data._id);
      await AsyncStorage.setItem('token', data?.token);
      await AsyncStorage.setItem('userId', data?._id);
      // await AsyncStorage.setItem('name', data?.name);
      // await AsyncStorage.setItem('email', data?.email);
      console.log('user has been register =>', data);
      navigation.navigate("Drawer");
    }
    if(!data?._id && isError){
      console.log("error in login ", error)  
      setVisible(true)
    }

  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: '2%'}}>

      <Text style={{fontSize: 18, margin: '2%', fontWeight: '500'}}>
        Enter your detail
      </Text>
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
      <ScrollView>
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
            <View style={{marginVertical: '2%'}}>
              <View>
                <Input
                  rightIcon={{type: 'font-awesome', name: 'user'}}
                  label="Enter Your user name"
                  placeholder="gulab"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  renderErrorMessage={true}
                  errorMessage={
                    errors.name && touched.name ? (
                      <Text style={styles.error}>{errors.name}</Text>
                    ) : (
                      ''
                    )
                  }
                />
              </View>

              <View>
                <Input
                  rightIcon={{type: 'font-awesome', name: 'envelope'}}
                  label="Enter Your email"
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  renderErrorMessage={true}
                  errorMessage={
                    errors.email && touched.email ? (
                      <Text style={styles.error}>{errors.email}</Text>
                    ) : (
                      ''
                    )
                  }
                />
              </View>

              <View>
                <Input
                  rightIcon={{type: 'font-awesome', name: 'lock'}}
                  label="Password"
                  placeholder="*********"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  renderErrorMessage={true}
                  errorMessage={
                    errors.password && touched.password ? (
                      <Text style={styles.error}>{errors.password}</Text>
                    ) : (
                      ''
                    )
                  }
                />
              </View>

              <View>
                <Input
                  rightIcon={{type: 'font-awesome', name: 'check'}}
                  label="Confirm password"
                  placeholder="*********"
                  onChangeText={handleChange('passwordConfirmation')}
                  onBlur={handleBlur('passwordConfirmation')}
                  value={values.passwordConfirmation}
                  renderErrorMessage={true}
                  errorMessage={
                    errors.passwordConfirmation &&
                    touched.passwordConfirmation ? (
                      <Text style={styles.error}>
                        {errors.passwordConfirmation}
                      </Text>
                    ) : (
                      ''
                    )
                  }
                />
              </View>

              <Button
                title={'Sign up'}
                onPress={handleSubmit}
                containerStyle={{
                  width: '95%',
                  alignSelf: 'center',
                }}
                buttonStyle={{
                  backgroundColor: '#334C8C',
                  height: 50,
                  borderRadius: 5,
                }}
              />
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
