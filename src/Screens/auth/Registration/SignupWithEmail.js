import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  TextInput,
  Dialog,
  Text,
  Paragraph,
  Portal,
  useTheme,
  Button,
} from 'react-native-paper';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {useRegisterUserMutation} from '../../../redux/reducers/user/userThunk';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('*required')
    .trim('Full name can not include leading and trailing spaces')
    .strict(true)
    .label('Name')
    .min(2, ({min}) => `Name must be at least ${min} characters`),
  email: Yup.string()
    .email('Please enter valid email')
    .required('*required')
    .label('Email'),
  password: Yup.string()
    .min(2, ({min}) => `Password must be at least ${min} characters`)
    .required('*required')
    .label('Password'),
  passwordConfirmation: Yup.string()
    .required('*required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .label('passwordConfirmation'),
});

const SignupWithEmail = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showTryAgainButton, setShowTryAgainButton] = useState(false);

  const [registerUser, {isLoading, isError, error}] = useRegisterUserMutation();

  const submitHandler = async values => {
    registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    })
      .then(res => {
        console.log(res);
        if (res?.error?.status === 409) {
          setMessage(res?.error?.data?.message);
          setVisible(true);
          setShowTryAgainButton(true);
          setShowLoginButton(false);
        } else if (
          res?.data?.message === 'An Email sent to your account please verify'
        ) {
          setMessage(
            'An Email sent to your account. Please verify and then login',
          );
          setShowTryAgainButton(false);
          setShowLoginButton(true);
          setVisible(true);
        } else {
          setShowTryAgainButton(true);
          setShowLoginButton(true);
          setMessage('Something went wrong');
          setVisible(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: '5%',
        flex: 1,
        justifyContent: 'space-between',
      }}
      showsVerticalScrollIndicator={false}>
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
          <View style={{}}>
            <Portal>
              <Dialog visible={visible} onDismiss={() => setVisible(true)}>
                <Dialog.Title>Sign up</Dialog.Title>
                <Dialog.Content>
                  <Paragraph> {message}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  {showTryAgainButton && (
                    <Button
                      onPress={() => {
                        setVisible(false);
                        handleSubmit();
                      }}>
                      Try again
                    </Button>
                  )}

                  {showLoginButton && (
                    <Button
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate("Login")
                      }}>
                      Go to login
                    </Button>
                  )}

                  <Button
                    textColor={theme.colors.error}
                    onPress={() => setVisible(false)}>
                    close
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>

            <Text
              style={{
                fontSize: 18,
                marginTop: '10%',
                fontWeight: '700',
              }}>
              Enter the following details to continue.
            </Text>

            <TextInput
              label="Full name"
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
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye' : 'eye-off'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              secureTextEntry={!showPassword}
              style={{marginVertical: '2%'}}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              activeOutlineColor={theme.colors.secondary}
            />
            {errors.password && touched.password ? (
              <Text style={{color: theme.colors.error}}>{errors.password}</Text>
            ) : null}

            <TextInput
              error={errors.password && touched.password ? true : false}
              label="Confirm password"
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={showPasswordConfirmation ? 'eye' : 'eye-off'}
                  onPress={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                />
              }
              secureTextEntry={!showPasswordConfirmation}
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
                marginTop: '2%',
              }}
              contentStyle={{
                padding: '2%',
              }}
              theme={{roundness: 1}}
              mode="contained"
              onPress={handleSubmit}
              buttonColor={theme.colors.secondary}>
              Sign up
            </Button>
          </View>
        )}
      </Formik>

      <View
        style={{
          marginVertical: '10%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          Already have an account?
        </Text>
        <Button mode="text" onPress={() => navigation.navigate('Login')}>
          Sign in
        </Button>
      </View>
    </ScrollView>
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
