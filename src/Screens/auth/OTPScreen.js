import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
// import {Appbar} from 'react-native-paper';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const initCodes = [];
const OTPScreeen = (
  {navigation},
  {containerStyle, otpStyles, codeCount = 4, onTyping, onFinish},
) => {
  const inputCodeRef = useRef(new Array());
  const [codes, setCodes] = useState(initCodes);
  useEffect(() => {
    const codes = [];
    for (let i = 0; i < codeCount; i++) {
      codes.push('');
    }
    setCodes(codes);
    // setIsEnable(true)
  }, []);

  useEffect(() => {
    onTyping && onTyping(getCodes());
    const isTypeFinish = codes.every(function (i) {
      // isEnable.current = true;
      return i !== '';
    });
    if (isTypeFinish) {
      onFinish && onFinish(getCodes());
    }
  }, [codes]);

  const getCodes = () => {
    let codeString = '';
    codes.forEach(code => {
      codeString += code;
    });
    return codeString;
  };

  const onChangeCode = (code, index) => {
    const typedCode = code.slice(-1);
    const currentCodes = [...codes];
    currentCodes[index] = typedCode;
    setCodes(currentCodes);
  };
  const onKeyPress = (event, index) => {
    const key = event.nativeEvent.key;
    let destIndex = index;
    if (key === 'Backspace') {
      destIndex = index > 0 ? index - 1 : 0;
    } else {
      destIndex = index < codeCount - 1 ? index + 1 : codeCount - 1;
    }
    // console.log(index)
    if (index > 2) {
      setIsEnable(true);
    } else {
      setIsEnable(false);
    }
    inputCodeRef.current[destIndex].focus();
  };
  const [isEnable, setIsEnable] = useState(false);
  // const isEnable = useRef(false);
  return (
    <View style={[styles.a, containerStyle]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* <Appbar.Header style={{backgroundColor: '#fff'}}>
        <Appbar.BackAction
          onPress={() => {
            navigation.replace('LoginScreen2');
          }}
        />
        <Appbar.Content title="OTP Code" />
      </Appbar.Header> */}
      <View style={styles.t}>
        <Text style={styles.heading}>Enter Code</Text>
        <Text style={styles.subheading}>
          A reset code has been sent to your email Please enter that code
        </Text>
      </View>
      <View style={styles.b}>
        <View style={[styles.form]}>
          {codes.map((code, index) => {
            return (
              <TextInput
                key={index}
                ref={element => inputCodeRef.current.push(element)}
                style={[
                  styles.input,
                  otpStyles,
                  {width: width / (codeCount + 2), height: height / 14},
                ]}
                onChangeText={text => onChangeCode(text, index)}
                onKeyPress={event => onKeyPress(event, index)}
                value={code}
              />
            );
          })}
        </View>
        <View style={styles.SectionStyle}>
          <TouchableOpacity
            onPress={() => {
              if (isEnable) {
                navigation.replace('ResetPasswordScreen');
              }
            }}
            style={[
              styles.buttonStyle,
              {backgroundColor: isEnable ? '#F54748' : '#D9DCDF'},
            ]}
            activeOpacity={isEnable ? 0.5 : 1}>
            <Text style={styles.buttonTextStyle}>RESET PASSWORD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OTPScreeen;

const styles = StyleSheet.create({
  a: {
    flex: 4,
    backgroundColor: '#fff',
  },
  SectionStyle: {
    marginHorizontal: '10%',
    marginVertical: '10%',
  },
  t: {
    alignItems: 'center',
    padding: '10%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subheading: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
  b: {
    flex: 1,
  },
  buttonStyle: {
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 4,
    fontSize: 32,
    padding: 2,
    textAlign: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0,
    shadowRadius: 20.0,
    elevation: 20,
    borderRadius: 15,
  },
});
