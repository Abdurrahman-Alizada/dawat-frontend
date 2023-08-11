import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import ErrorSnackBar from '../../../Components/ErrorSnackBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  useTheme,
  Button,
  Avatar,
  ActivityIndicator,
} from 'react-native-paper';
import {PreferencesContext} from '../../../themeContext';
import CountDown from 'react-native-countdown-xambra';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import PinnedGroupHeader from '../../../Components/PinnedGroupHeader';

const Groups = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {isThemeDark} = useContext(PreferencesContext);
  const [loading, setLoading] = useState(true);

  const [pinGroup, setPinGroup] = useState(null);
  const pinGroupTime = useRef(0);

  const PG = useSelector(state => state.groups?.pinGroup);
  const getPinGroup = async () => {
    setLoading(true);
    let pGroup = await AsyncStorage.getItem('pinGroup');
    let parsePinGroup = JSON.parse(pGroup);
    setPinGroup(parsePinGroup);
    let currentTime = moment(new Date());
    let dueTIme = moment(new Date(parsePinGroup?.time));
    pinGroupTime.current = dueTIme.diff(currentTime, 'seconds');
    setLoading(false);
  };

  useLayoutEffect(() => {
    getPinGroup();
  }, [PG]);

  const [isError, setIsError] = useState(false);
  useEffect(() => {
    setIsError(isError);
  }, [isError]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={isThemeDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <PinnedGroupHeader theme={theme} />

      {!loading ? (
        <View style={{flex: 1}}>
          {pinGroup ? (
            <KeyboardAvoidingView
              enabled={false}
              keyboardVerticalOffset={0}
              behavior="height"
              style={{flex: 1}}>
              <Image
                style={{
                  width: '100%',
                  height: '28%',
                  opacity: 0.9,
                  alignSelf: 'center',
                  resizeMode: 'cover',
                }}
                source={require('../../../assets/images/main-1.png')}
              />
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: '#26231c',
                  opacity: 0.8,
                  height: '28%',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 24,
                  }}>
                  {pinGroup?.groupName}
                </Text>
                <CountDown
                  until={pinGroupTime.current ? pinGroupTime.current : 0}
                  onFinish={() => alert('finished')}
                  onPress={() => alert('hello')}
                  size={22}
                  style={{margin: '2%'}}
                  digitTxtStyle={{color: '#fff'}}
                  digitStyle={{backgroundColor: '#265AE8'}}
                  timeLabelStyle={{color: '#fff'}}
                  // timeToShow={['D','H']}
                  // showSeparator
                  separatorStyle={{color: '#fff', alignSelf: 'center'}}
                />
              </View>

              <View
                style={{
                  marginVertical: '5%',
                  marginHorizontal: '2%',
                  flexGrow: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Tasks', {groupId: pinGroup?._id})
                  }
                  style={{
                    height: '30%',
                    borderRadius: 5,
                    backgroundColor: theme.colors.textRed,
                    width: '48%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Avatar.Icon
                    icon={require('../../../assets/icons/guest-icon.png')}
                    style={{backgroundColor: '#fff', alignSelf: 'center'}}
                    size={45}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      marginTop: '1.5%',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Todo list
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Invitations', {groupId: pinGroup?._id})
                  }
                  style={{
                    height: '30%',
                    borderRadius: 5,
                    backgroundColor: theme.colors.yellow,
                    width: '48%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Avatar.Icon
                    icon={require('../../../assets/icons/guests-icon-1.png')}
                    style={{backgroundColor: '#fff', alignSelf: 'center'}}
                    size={45}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      marginTop: '1.5%',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Guests
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    height: '30%',
                    borderRadius: 5,
                    backgroundColor: theme.colors.blueBG,
                    width: '48%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '3%',
                  }}>
                  <Avatar.Icon
                    icon={require('../../../assets/icons/chat-icon-1.png')}
                    style={{backgroundColor: '#fff', alignSelf: 'center'}}
                    size={45}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      marginTop: '1.5%',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Chat
                  </Text>
                </View>

                <View
                  style={{
                    height: '30%',
                    borderRadius: 5,
                    backgroundColor: theme.colors.purpleLight,
                    width: '48%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '3%',
                  }}>
                  <Avatar.Icon
                    icon={require('../../../assets/icons/settings-icon-1.png')}
                    style={{backgroundColor: '#fff', alignSelf: 'center'}}
                    size={45}
                    // color={theme.colors.error}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      marginTop: '1.5%',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Settings
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <Button
                    // loading={isLoading}
                    // disabled={!(dirty && isValid) || isLoading}
                    // disabled={isLoading}
                    style={{
                      marginTop: '3%',
                      width: false ? '98%' : '75%',
                    }}
                    contentStyle={{padding: '2%'}}
                    buttonStyle={{padding: '1%', width: '100%'}}
                    theme={{roundness: 1}}
                    mode="contained"
                    icon={() => (
                      <Avatar.Icon
                        icon={require('../../../assets/icons/summary-icon-1.png')}
                        style={{backgroundColor: '#fff', alignSelf: 'center'}}
                        size={40}
                      />
                    )}
                    labelStyle={{fontWeight: 'bold'}}
                    onPress={async () => {
                      await AsyncStorage.clear();
                    }}
                    // onPress={() => navigation.navigate('Login')}
                    buttonColor={theme.colors.tertiary}>
                    Summary
                  </Button>
                  {true ? (
                    <Button
                      // loading={isLoading}
                      // disabled={!(dirty && isValid) || isLoading}
                      //   disabled={true}
                      style={{
                        marginTop: '3%',
                        width: '23%',
                      }}
                      contentStyle={{padding: '2%'}}
                      buttonStyle={{padding: '1%', width: '100%'}}
                      theme={{roundness: 1}}
                      mode="outlined"
                      icon="sync"
                      labelStyle={{
                        fontWeight: 'bold',
                      }}
                      onPress={() => navigation.navigate('Login')}>
                      Sync
                    </Button>
                  ) : null}
                </View>
              </View>
            </KeyboardAvoidingView>
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 22}}>No group</Text>
              <Button
                // loading={isLoading}
                // disabled={!(dirty && isValid) || isLoading}
                // disabled={isLoading}
                style={{
                  marginTop: '3%',
                  width: '70%',
                }}
                contentStyle={{padding: '2%'}}
                buttonStyle={{padding: '1%', width: '100%'}}
                theme={{roundness: 2}}
                mode="contained"
                icon="plus-circle-multiple-outline"
                labelStyle={{fontWeight: 'bold'}}
                onPress={() => navigation.navigate('AddGroup')}
                buttonColor={theme.colors.blueBG}>
                Add group
              </Button>
            </View>
          )}
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      )}
      <ErrorSnackBar
        isVisible={isError}
        text={'Something went wrong'}
        onDismissHandler={() => setIsError(false)}
      />
    </View>
  );
};

export default Groups;
