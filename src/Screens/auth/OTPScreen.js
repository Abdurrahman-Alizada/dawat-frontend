import {Platform, Animated, Image, SafeAreaView, View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useVerifyOTPForPasswordRecoveryMutation} from '../../redux/reducers/user/userThunk';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Button, Portal, Dialog, Paragraph, useTheme, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

export const CELL_SIZE = 50;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = '#fff';
// export const NOT_EMPTY_CELL_BG_COLOR = '#3557b7';
export const NOT_EMPTY_CELL_BG_COLOR = '#fff';
export const ACTIVE_CELL_BG_COLOR = '#d8dce3';

const {Value, Text: AnimatedText} = Animated;

const OTPScreen = ({navigation, route}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});

  const [visible, setVisible] = useState(false);
  const [isDisabled, setDisibility] = useState(true);
  const [message, setMessage] = useState('Something went wrong');

  const [VerifyOTPForPasswordRecovery, {isLoading, isError, error}] =
    useVerifyOTPForPasswordRecoveryMutation();
  const verify = () => {
    setDisibility(true);
    VerifyOTPForPasswordRecovery({email: route?.params?.email, OTP: value})
      .then(res => {
        if (res?.error?.data?.message) {
          setMessage(res?.error?.data?.message);
          setVisible(true);
        } else if (res?.error?.error) {
          setMessage(res?.error?.error);
          setVisible(true);
        } else if (res?.data?.message == `OTP verified successfully`) {
          navigation.navigate('ResetPasswordScreen', {user: res?.data?.user});
          setValue('');
        } else {
          setMessage('Unknown error');
          setVisible(true);
        }
        setDisibility(false);
      })
      .catch(err => {
        setDisibility(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (value?.length === 5) {
      setDisibility(false);
    } else {
      setDisibility(true);
    }
  }, [value]);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = ({index, symbol, isFocused}) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
    };

    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    return (
      <AnimatedText
        key={index}
        secureTextEntry={false}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={{paddingHorizontal: '2%'}}>
   
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{t("OTP verification error")}</Dialog.Title>
          <Dialog.Content>
            <Paragraph> {t(message)} </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={theme.colors.tertiary} onPress={() => setVisible(false)}>
              {t("close")}
            </Button>
            <Button
              onPress={() => {
                setVisible(false);
                setDisibility(false);
                navigation.navigate('ForgotPassword');
              }}>
              {t("Try again")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
   
      <Image
        style={{
          width: 227 / 2.4,
          height: 168 / 2,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '5%',
        }}
        source={require('../../assets/images/smartphone.png')}
      />
      <Text style={{paddingTop: 30, textAlign: 'center'}}>
        {t("Please enter the verification code")}{'\n'}
        {t("we send to")} {route?.params?.email}
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={{
          height: CELL_SIZE,
          marginTop: 30,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />

      <Button
        loading={isLoading}
        disabled={isDisabled}
        style={{
          margin: 30,
          justifyContent: 'center',
          minWidth: 300,
        }}
        contentStyle={{padding: '3%'}}
        buttonStyle={{padding: '1%'}}
        labelStyle={{color:"#fff"}}
        theme={{roundness: 10}}
        mode="contained"
        onPress={verify}
        >
        {t("Verify")}
      </Button>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          {t("Didn't recieve code?")}
        </Text>
        <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')}>
          {t("Request again")}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const CELL_COUNT = 5;

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));

const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const styles = StyleSheet.create({
  cell: {
    marginHorizontal: 8,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    ...Platform.select({web: {lineHeight: 65}}),
    fontSize: 30,
    textAlign: 'center',
    borderRadius: CELL_BORDER_RADIUS,
    color: '#665a6f',
    backgroundColor: '#fff',

    // IOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },
});

export default OTPScreen;
