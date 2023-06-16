import {StyleSheet, View, StatusBar} from 'react-native';
import React, {useState} from 'react';
import {
  TextInput,
  Button,
  useTheme,
  Portal,
  Dialog,
  Text,
  Paragraph,
} from 'react-native-paper';
import {useForgotPasswordMutation} from '../../../redux/reducers/user/userThunk';

const ForgotPassword = ({navigation}) => {
  const regex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isDisabled, setDisibility] = useState(true);
  const [message, setMessage] = useState('Something went wrong');

  const checkEmail = e => {
    setDisibility(!regex.test(e));
    setEmail(e);
  };

  const [forgotPassword, {isLoading, isError, error}] =
    useForgotPasswordMutation();
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
        } else if(res?.data?.message == `OTP has been sent to ${email}`) {
          navigation.navigate("OTPScreen", {email:email});
          setEmail('')
        }else{
          setMessage("Unknown error");
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
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Password recovery error</Dialog.Title>
          <Dialog.Content>
            <Paragraph> {message} </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.tertiary}
              onPress={() => setVisible(false)}>
              close
            </Button>
            <Button onPress={() => {
              setVisible(false)
              sendEmail()
              }}>Try again</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{paddingVertical: '5%', paddingHorizontal: '2%'}}>
        
        <TextInput
          label="Enter your Email"
          mode="outlined"
          value={email}
          activeOutlineColor={theme.colors.secondary}
          onChangeText={e => checkEmail(e)}
        />

        <Button
          icon="email-send"
          mode="contained"
          disabled={isDisabled}
          style={{
            marginVertical: '2%',
          }}
          loading={isLoading}
          contentStyle={{padding: '3%'}}
          buttonStyle={{padding: '1%'}}
          theme={{roundness: 1}}
          buttonColor={theme.colors.secondary}
          onPress={sendEmail}>
          Continue
        </Button>
      </View>
    </View>
  );
};

export default ForgotPassword;

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
});
