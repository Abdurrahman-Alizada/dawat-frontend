import React, {useState} from 'react';

import {StatusBar, StyleSheet, View} from 'react-native';
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
import {handlePasswordResetSuccessfully} from '../../redux/reducers/user/user';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Something went wrong');

  const [resetPassword, {isLoading, isError, error}] = useResetPasswordMutation();

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
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(true)}>
          <Dialog.Title>{t("Reset password error")}</Dialog.Title>
          <Dialog.Content>
            <Paragraph> {t(message)} </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>{t("Ok")}</Button>
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
        {({handleChange, handleBlur, handleSubmit, values, errors, touched, dirty, isValid}) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              marginVertical: '2%',
            }}>
            <View>
              <TextInput
                error={errors.password && touched.password ? true : false}
                label={t("New password")}
                secureTextEntry={showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye' : 'eye-off'}
                    onPress={() => setShowPassword(!showPassword)}
                    style={{marginTop: '2%', height: 55}}
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
                <Text style={{color: theme.colors.error}}>{errors.password}</Text>
              ) : null}

              <TextInput
                error={errors.password && touched.password ? true : false}
                label={t("Confirm new password")}
                mode="outlined"
                secureTextEntry={showPasswordConfirmation}
                right={
                  <TextInput.Icon
                    icon={showPasswordConfirmation ? 'eye' : 'eye-off'}
                    onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  />
                }
                style={{marginTop: '2%', height: 55}}
                onChangeText={handleChange('passwordConfirmation')}
                onBlur={handleBlur('passwordConfirmation')}
                value={values.passwordConfirmation}
                activeOutlineColor={theme.colors.secondary}
              />
              {errors.passwordConfirmation && touched.passwordConfirmation ? (
                <Text style={{color: theme.colors.error}}>{errors.passwordConfirmation}</Text>
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
                  marginVertical: '5%',
                }}
                contentStyle={{padding: '3%'}}
                buttonStyle={{padding: '1%'}}
                theme={{roundness: 10}}
                mode="contained"
                onPress={handleSubmit}
                buttonColor={theme.colors.secondary}>
                {t("Reset")}
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
  
  error: {
    color: 'red',
  },
});
