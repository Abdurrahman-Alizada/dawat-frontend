import React, {useRef, useState} from 'react';
import {StyleSheet, StatusBar, View, ScrollView} from 'react-native';
import {
  TextInput,
  Dialog,
  Text,
  Paragraph,
  Portal,
  Appbar,
  Avatar,
  useTheme,
  Menu,
  Button,
} from 'react-native-paper';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {
  useRegisterUserMutation,
  useResendEmailForUserRegistrationMutation,
} from '../../../redux/reducers/user/userThunk';
import AuthAppbar from '../../../Components/Appbars/AuthAbbar';
import {useTranslation} from 'react-i18next';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('*required')
    .trim('Full name can not include leading and trailing spaces')
    .label('Name')
    .min(2, ({min}) => `Name must be at least ${min} characters`),
  email: Yup.string().email('Please enter valid email').required('*required').label('Email'),
  password: Yup.string()
    .min(6, ({min}) => `Password must be at least ${min} characters`)
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
  const {t} = useTranslation();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showTryAgainButton, setShowTryAgainButton] = useState(false);
  const email = useRef('');

  const [registerUser, {isLoading, isError, error}] = useRegisterUserMutation();

  const submitHandler = async values => {
    email.current = values.email;
    registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    })
      .then(res => {
        if (res?.error?.status === 409) {
          setMessage(res?.error?.data?.message);
          setShowLoginButton(false);
          if (!res?.error?.data?.verified) {
            setShowTryAgainButton(true);
          }
          setVisible(true);
        } else if (res?.data?.message === 'An Email sent to your account please verify') {
          formikRef.current.resetForm();
          setMessage(
            `${t('An Email sent to')} ${email.current}. ${t('Please verify and then login')}`,
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

  const [
    resendEmailForUserRegistration,
    {isLoading: resendLoading, isError: resendEmailIsError, error: resendEmailError},
  ] = useResendEmailForUserRegistrationMutation();

  const resendEmail = () => {
    resendEmailForUserRegistration({
      email: email.current,
    })
      .then(res => {
        console.log(res);
        if (res?.error?.status === 409) {
          setMessage(res?.error?.data?.message);
          setVisible(true);
        } else if (res?.data?.message === 'An Email sent to your account please verify') {
          formikRef.current.resetForm();
          setMessage(`${t('Again! An email sent to your account. Please verify and then login')}`);
          setShowTryAgainButton(false);
          setShowLoginButton(true);
          setVisible(true);
        } else {
          setShowTryAgainButton(true);
          setShowLoginButton(true);
          setMessage(`${t('Something went wrong')}`);
          setVisible(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const openMenu = () => setShowMenu(true);
  const closeMenu = () => setShowMenu(false);

  const formikRef = useRef();

  return (
    <View>
      <AuthAppbar title={'Create account'} />

      <ScrollView
        contentContainerStyle={{
          justifyContent: 'space-between',
          marginTop: '5%',
        }}
        showsVerticalScrollIndicator={false}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => submitHandler(values)}>
          {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
            <View style={{paddingHorizontal: '5%'}}>
              <TextInput
                label={t('Full name')}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                mode="outlined"
                value={values.name}
                activeOutlineColor={theme.colors.secondary}
                error={errors.name && touched.name ? true : false}
                style={{marginTop: '2%', height: 55}}
              />
              {errors.name && touched.name ? (
                <Text style={{color: theme.colors.error}}>{errors.name}</Text>
              ) : null}

              <TextInput
                label={t('Email')}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                mode="outlined"
                value={values.email}
                activeOutlineColor={theme.colors.secondary}
                error={errors.email && touched.email ? true : false}
                style={{marginTop: '2%', height: 55}}
              />
              {errors.email && touched.email ? (
                <Text style={{color: theme.colors.error}}>{errors.email}</Text>
              ) : null}

              <TextInput
                error={errors.password && touched.password ? true : false}
                label={t('Password')}
                mode="outlined"
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye' : 'eye-off'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                secureTextEntry={!showPassword}
                style={{marginTop: '2%', height: 55}}
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
                label={t('Confirm password')}
                mode="outlined"
                right={
                  <TextInput.Icon
                    icon={showPasswordConfirmation ? 'eye' : 'eye-off'}
                    onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  />
                }
                secureTextEntry={!showPasswordConfirmation}
                style={{marginTop: '2%', height: 55}}
                onChangeText={handleChange('passwordConfirmation')}
                onBlur={handleBlur('passwordConfirmation')}
                value={values.passwordConfirmation}
                activeOutlineColor={theme.colors.secondary}
              />
              {errors.passwordConfirmation && touched.passwordConfirmation ? (
                <Text style={{color: theme.colors.error}}>{errors.passwordConfirmation}</Text>
              ) : null}

              <Button
                loading={isLoading || resendLoading}
                disabled={isLoading || resendLoading}
                style={{
                  marginTop: '5%',
                }}
                contentStyle={{
                  padding: '3%',
                }}
                theme={{roundness: 10}}
                mode="contained"
                onPress={handleSubmit}
                buttonColor={theme.colors.blueBG}
                textColor="#fff">
                {t('Create')}
              </Button>
            </View>
          )}
        </Formik>

        {/* <View
        style={{
          marginVertical: '5%',
          flexDirection: 'row',
          paddingHorizontal: '5%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '46%',
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                />
                <Text
                  style={{fontSize:16, color: theme.colors.textGray}}>
                  or
                </Text>
                <View
                  style={{
                    width: '46%',
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                />
              </View>
              <Button
                loading={isLoading}
                // disabled={!(dirty && isValid) || isLoading}
                disabled={isLoading}
                style={{
                  marginVertical: '3%',
                }}
                contentStyle={{padding: '3%'}}
                buttonStyle={{padding: '1%'}}
                theme={{roundness: 1}}
                mode="contained"
                icon={() => (
                  <Avatar.Image
                    size={24}
                    style={{backgroundColor:"#EDEEF0", marginHorizontal:"2%"}}
                    source={require('../../../assets/icons/google-icon.png')}
                  />
                )}
                // onPress={handleSubmit}
                buttonColor={"#EDEEF0"}
                labelStyle={{color:theme.colors.textGray, fontWeight:"bold"}}
                >
                Login with Google
              </Button>
            </View>

      </View> */}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(true)}>
          <Dialog.Title>{t('Create account')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph> {message}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            {showTryAgainButton && (
              <Button
                onPress={() => {
                  setVisible(false);
                  resendEmail();
                }}>
                {t('Resend Email')}
              </Button>
            )}

            {showLoginButton && (
              <Button
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('Login');
                }}>
                {t('Go to login')}
              </Button>
            )}

            <Button
              textColor={theme.colors.error}
              onPress={() => {
                setVisible(false);
                email.current = '';
              }}>
              {t('close')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default SignupWithEmail;
