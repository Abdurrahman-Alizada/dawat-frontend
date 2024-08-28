import {StyleSheet, View, StatusBar} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button, useTheme, Portal, Dialog, Text, Paragraph} from 'react-native-paper';
import {useForgotPasswordMutation} from '../../../redux/reducers/user/userThunk';
import {useTranslation} from 'react-i18next';
import AuthAppbar from '../../../Components/Appbars/AuthAbbar';

const ForgotPassword = ({navigation}) => {
  const {t} = useTranslation();

  const regex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isDisabled, setDisibility] = useState(true);
  const [message, setMessage] = useState(`${t("Something went wrong")}`);

  const checkEmail = e => {
    setDisibility(!regex.test(e));
    setEmail(e);
  };

  const [forgotPassword, {isLoading, isError, error}] = useForgotPasswordMutation();

  const sendEmail = () => {
    setDisibility(true);
    forgotPassword(email)
      .then(res => {
        if (res?.error?.data?.message) {
          setMessage(res?.error?.data?.message);
          setVisible(true);
        } else if (res?.error?.error) {
          setMessage(res?.error?.error);
          setVisible(true);
        } else if (res?.data?.message == `OTP has been sent to ${email}`) {
          navigation.navigate('OTPScreen', {email: email});
          setEmail('');
        } else {
          setMessage('Unknown error');
          setVisible(true);
        }
        setDisibility(false);
      })
      .catch(e => {
        setDisibility(false);
        console.log(e);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: '2%',
      }}>
      <AuthAppbar title={"Forgot password"} />
      <View style={{paddingVertical: '5%', paddingHorizontal: '2%'}}>
        <TextInput
          label={t("Enter your Email")}
          mode="outlined"
          value={email}
          style={{marginTop: '2%', height: 55}}
          activeOutlineColor={theme.colors.secondary}
          onChangeText={e => checkEmail(e)}
        />

        <Button
          icon="email-send"
          mode="contained"
          disabled={isDisabled}
          style={{
            marginVertical: '3%',
          }}
          loading={isLoading}
          contentStyle={{padding: '3%'}}
          buttonStyle={{padding: '1%'}}
          theme={{roundness: 10}}
          buttonColor={theme.colors.secondary}
          onPress={sendEmail}>
          {t("Continue")}
        </Button>
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{t("Password recovery error")}</Dialog.Title>
          <Dialog.Content>
            <Paragraph> {message} </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={theme.colors.tertiary} onPress={() => setVisible(false)}>
              {t("close")}
            </Button>
            <Button
              onPress={() => {
                setVisible(false);
                sendEmail();
              }}>
              {t("Try again")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  );
};

export default ForgotPassword;
