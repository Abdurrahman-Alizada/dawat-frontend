import React, {useState} from 'react';

import {
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  Text,
  Button,
  Dialog,
  Avatar,
  Paragraph,
  Banner,
  Portal,
  useTheme,
} from 'react-native-paper';
import {useLoginUserMutation} from '../../../redux/reducers/user/userThunk';
import {
  handleCurrentLoaginUser,
  handlePasswordResetSuccessfully,
} from '../../../redux/reducers/user/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import AuthAppbar from '../../../Components/Appbars/AuthAbbar';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Type your valid email address')
    .required('*required')
    .label('Email'),
  password: Yup.string()
    .min(6, ({min}) => `Password must be at least ${min} characters`)
    .required('*required')
    .label('Password'),
});

const LoginScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const passwordResetSuccessflly = useSelector(
    state => state?.user?.passwordResetSuccessflly,
  );

  const [verificationBannerVisible, setVerificationBannerVisible] = useState(
    route.params ? true : false,
  );

  const [bannerMessage, setBannerMessage] = useState(
    route?.params?.message ? route?.params?.message : '',
  );

  const [errorMessage, setErrorMessage] = useState('Something went wrong');

  const [loginUser, {isLoading, isError, error}] = useLoginUserMutation();
  const submitHandler = async (values, actions) => {
    const response = await loginUser({
      email: values.email,
      password: values.password,
    });

    if (response?.error) {
      setErrorMessage(response?.error?.data?.message);
      setVisible(true);
    }
    if (response?.data?.message) {
      console.log(response?.data?.message);
      setErrorMessage(response?.data?.message);
      setVisible(true);
    }
    if (!response?.data?.user?.verified) {
      setBannerMessage('Please verify the provided email first');
      setVerificationBannerVisible(true);
    }
    if (response?.data?.token) {
      dispatch(handleCurrentLoaginUser(response?.data?.user));
      await AsyncStorage.setItem('isLoggedIn', 'login');
      await AsyncStorage.setItem('id', response?.data?.user?._id);
      await AsyncStorage.setItem('token', response?.data?.token);
      await AsyncStorage.setItem('userId', response?.data?.user?._id);
      await AsyncStorage.setItem('name', response.data.user.name);
      await AsyncStorage.setItem('email', response?.data?.user?.email);
      actions.resetForm();
      navigation.navigate('SyncData')
    }
  };

  const [showPassword, setShowPassword] = useState(true);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        paddingVertical: '2%',
      }}>
      <AuthAppbar title={'Sign in'} />

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          submitHandler(values, actions);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          // dirty,
          // isValid,
        }) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              marginTop: '8%',
              paddingHorizontal: '5%',
            }}>
            <View>
              <TextInput
                error={errors.email && touched.email ? true : false}
                label="Email"
                // placeholder="Enter your email"
                mode="outlined"
                style={{marginTop: '2%', height: 55}}
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
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye' : 'eye-off'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                mode="outlined"
                style={{marginTop: '2%', height: 55}}
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
                disabled={isLoading}
                style={{
                  marginVertical: '5%',
                }}
                contentStyle={{padding: '3%'}}
                theme={{roundness: 20}}
                mode="contained"
                onPress={handleSubmit}
                buttonColor={theme.colors.blueBG}
                textColor={'#fff'}>
                Login
              </Button>

              <TouchableOpacity
                style={{marginVertical: '3%', alignSelf: 'center'}}
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={{fontWeight: 'bold', color: theme.colors.textRed}}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View>
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
                onPress={handleSubmit}
                buttonColor={"#EDEEF0"}
                labelStyle={{color:theme.colors.textGray, fontWeight:"bold"}}
                >
                Login with Google
              </Button>
            </View> */}
          </View>
        )}
      </Formik>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(true)}>
          <Dialog.Title>Sign in Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {' '}
              {errorMessage} {isError && error?.error}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Banner
        visible={passwordResetSuccessflly}
        actions={[
          {
            label: 'Ok',
            onPress: () => dispatch(handlePasswordResetSuccessfully(false)),
          },
        ]}
        // style={{paddingHorizontal:"5%"}}
        icon={({size}) => <Avatar.Icon size={size} icon="check-bold" />}>
        Your password has been reset successfully. You can sign in now with the
        updated password.
      </Banner>
    </ScrollView>
  );
};

export default LoginScreen;
