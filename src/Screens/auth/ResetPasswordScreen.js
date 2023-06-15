import React, { useState} from 'react';

import {
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  Text,
  Button,
  Dialog,
  Paragraph,
  Portal,
  List,
  useTheme,
} from 'react-native-paper';
import {useResetPasswordMutation} from '../../redux/reducers/user/userThunk';
import {useDispatch} from 'react-redux';
import { handlePasswordResetSuccessfully } from '../../redux/reducers/user/user';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(2, ({min}) => `Password must be at least ${min} characters`)
    .required('*required')
    .label('Password'),
  passwordConfirmation: Yup.string()
    .required('*required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .label('passwordConfirmation'),
});

const ResetPasswordScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Something went wrong');

  const [resetPassword, {isLoading, isError, error}] =
    useResetPasswordMutation();

    const submitHandler = async values => {
    resetPassword({
      id: route?.params?.user?._id,
      newPassword: values.password,
    })
      .then(res => {
        if (res?.error?.data?.message) {
          setMessage(res?.error?.data?.message);
          setVisible(true);
        } else if (res?.error?.error) {
          setMessage(res?.error?.error);
          setVisible(true);
        } else if (res?.data?.message == `Password has been updated`) {
          dispatch(handlePasswordResetSuccessfully(true));
          navigation.navigate('Login');
        } else {
          setMessage('Unknown error');
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(true)}>
          <Dialog.Title>Reset password error</Dialog.Title>
          <Dialog.Content>
            <Paragraph> {message} </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Formik
        initialValues={{
          password: '',
          passwordConfirmation: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          submitHandler(values);
          actions.resetForm();
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          dirty, 
          isValid 
        }) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              marginVertical: '2%',
            }}>
            <View>
              <TextInput
                error={errors.password && touched.password ? true : false}
                label="New password"
                secureTextEntry={showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye' : 'eye-off'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                mode="outlined"
                style={{marginTop: '2%'}}
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
                label="Confirm new password"
                mode="outlined"
                secureTextEntry={showPasswordConfirmation}
                right={
                  <TextInput.Icon
                    icon={showPasswordConfirmation ? 'eye' : 'eye-off'}
                    onPress={() =>
                      setShowPasswordConfirmation(!showPasswordConfirmation)
                    }
                  />
                }
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

              {/* <List.Item
                  title="Must be atleast 2 characters"
                  left={props => <List.Icon {...props} icon="information" />}
                /> */}

              <Button
                loading={isLoading}
                // disabled={isLoading}
                disabled={!(dirty && isValid)}
                icon="check-bold"
                style={{
                  marginVertical: '3%',
                }}
                contentStyle={{padding: '3%'}}
                buttonStyle={{padding: '1%'}}
                theme={{roundness: 1}}
                mode="contained"
                onPress={handleSubmit}
                buttonColor={theme.colors.secondary}>
                Reset
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ResetPasswordScreen;

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
