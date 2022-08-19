import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Input, Button} from 'react-native-elements';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {registerUser} from '../../../redux/reducers/user/userThunk';
import {successFun} from '../../../redux/reducers/user/user'

import CustomLoader from '../../../Components/CustomLoader';

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

  const [animating, setAnimating] = useState(false); //State for ActivityIndicator animation
  const loader = a => {
    setAnimating(a);
  };

  const dispatch = useDispatch();
  const submitHandler = values => {
    dispatch(
      registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        navigation : navigation 
      }),
    )
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: '2%'}}>
      <CustomLoader animating={animating} />

      <Text style={{fontSize: 18, margin: '2%', fontWeight: '500'}}>
        Enter your detail
      </Text>

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
