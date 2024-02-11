import React, {useEffect, useState, useContext, useLayoutEffect, useRef} from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import ErrorSnackBar from '../../../Components/ErrorSnackBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, useTheme, Button, Avatar, ActivityIndicator} from 'react-native-paper';
import {ThemeContext} from '../../../themeContext';
import CountDown from 'react-native-countdown-xambra';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import PinnedGroupHeader from '../../../Components/PinnedGroupHeader';
import {handleCurrentViewingGroup} from '../../../redux/reducers/groups/groups';
import BackgroundImages from './changeBackMainImage/mainBackgroundImages';
import {useTranslation} from 'react-i18next';

const Groups = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  const {isThemeDark} = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);

  const PG = useSelector(state => state.groups?.pinGroup);
  const pinGroupFlag = useSelector(state => state.groups?.pinGroupFlag);
  const currentBackgroundImgSrcId = useSelector(state => state.groups?.currentBackgroundImgSrcId);

  const [pinGroup, setPinGroup] = useState(PG);
  const pinGroupTime = useRef(0);
  const getPinGroup = async () => {
    setLoading(true);
    let pinGroupId = JSON.parse(await AsyncStorage.getItem('pinGroupId'));

    let groups = JSON.parse(await AsyncStorage.getItem('groups'));

    let pinGroup1 = groups?.find(group => group?._id === pinGroupId);

    setPinGroup(pinGroup1);
    let currentTime = moment(new Date());
    let dueTIme = moment(new Date(pinGroup1?.time));
    pinGroupTime.current = dueTIme.diff(currentTime, 'seconds');
    pinGroup1 = groups = pinGroup1 = null;
    setLoading(false);
  };

  useLayoutEffect(() => {
    getPinGroup();
  }, [PG, pinGroupFlag]);

  const [isError, setIsError] = useState(false);
  useEffect(() => {
    // StatusBar.setTranslucent(true);
    // StatusBar.setBackgroundColor("transparent");

    setIsError(isError);
  }, [isError]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={isThemeDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {!pinGroup && <PinnedGroupHeader theme={theme} istransparent={false} />}

      {!loading ? (
        <View style={{flex: 1}}>
          {pinGroup ? (
            <View style={{flex: 1}}>
              <ImageBackground
                style={{height: 280, justifyContent: 'flex-start'}}
                imageStyle={{resizeMode: 'stretch'}}
                source={BackgroundImages[currentBackgroundImgSrcId]}>
                <PinnedGroupHeader theme={theme} istransparent={true} />
                <View style={{}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 24,
                      marginTop: 25,
                    }}>
                    {pinGroup?.groupName}
                  </Text>

                  {moment(pinGroup.time).diff(moment(new Date()), 'seconds') < 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        justifyContent: 'center',
                      }}>
                      <CountDown
                        until={Math.abs(moment(pinGroup?.time).diff(moment(new Date()), 'seconds'))}
                        size={22}
                        style={{margin: '2%'}}
                        digitTxtStyle={{color: '#fff'}}
                        digitStyle={{backgroundColor: theme.colors.error}}
                        timeLabelStyle={{color: '#fff'}}
                        running={false}
                        separatorStyle={{color: '#fff', alignSelf: 'center'}}
                        timeLabels={{d: t('Days'), h: t('Hours'), m: t('Minutes'), s: t('Seconds')}}
                      />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#fff',
                        }}>
                        {t('ago')}
                      </Text>
                    </View>
                  ) : (
                    <CountDown
                      until={pinGroupTime.current ? pinGroupTime.current : 0}
                      // onPress={() =>
                      //   Alert.alert(
                      //     `${moment(pinGroup.time)
                      //       .locale(i18n.language)
                      //       .format('MMM D, YYYY, h:mm a')}`,
                      //   )
                      // }
                      size={22}
                      style={{margin: '2%'}}
                      digitTxtStyle={{color: '#fff'}}
                      digitStyle={{backgroundColor: '#265AE8'}}
                      timeLabelStyle={{color: '#fff'}}
                      separatorStyle={{color: '#fff', alignSelf: 'center'}}
                      timeLabels={{d: t('Days'), h: t('Hours'), m: t('Minutes'), s: t('Seconds')}}
                    />
                  )}
                </View>
              </ImageBackground>

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
                  onPress={() => {
                    dispatch(handleCurrentViewingGroup(pinGroup));
                    navigation.navigate('Tasks', {
                      groupId: pinGroup?._id,
                      isHeader: true,
                    });
                  }}
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
                    {t('Todo list')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dispatch(handleCurrentViewingGroup(pinGroup));
                    navigation.navigate('Invitations', {
                      groupId: pinGroup?._id,
                      isHeader: true,
                    });
                  }}
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
                    {t('Guests')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dispatch(handleCurrentViewingGroup(pinGroup));
                    navigation.navigate('GroupChat', {
                      isHeader: true,
                    });
                  }}
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
                    {t('Chat')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dispatch(handleCurrentViewingGroup(pinGroup));
                    navigation.navigate('SingleGroupSettings', {
                      group: pinGroup,
                    });
                  }}
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
                    {t('Settings')}
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Button
                    // loading={isLoading}
                    // disabled={!(dirty && isValid) || isLoading}
                    // disabled={isLoading}
                    style={{
                      marginTop: '3%',
                      // width: false ? '98%' : '75%',
                      width: '98%',
                      alignSelf: 'center',
                    }}
                    contentStyle={{padding: '4%'}}
                    buttonStyle={{padding: '4%', width: '100%'}}
                    theme={{roundness: 1}}
                    mode="contained"
                    icon={() => (
                      <Avatar.Icon
                        icon={require('../../../assets/icons/summary-icon-1.png')}
                        style={{backgroundColor: '#fff', alignSelf: 'center'}}
                        size={40}
                      />
                    )}
                    labelStyle={{fontWeight: 'bold', fontSize: 20}}
                    onPress={() => {
                      dispatch(handleCurrentViewingGroup(pinGroup));
                      navigation.navigate('GroupBrief');
                    }}
                    s
                    buttonColor={theme.colors.tertiary}>
                    {t('Summary')}
                  </Button>
                  {/* {true ? (
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
                  ) : null} */}
                </View>
              </View>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{alignSelf: 'center', width: '70%'}}>
                  <Text
                    style={{
                      fontSize: 22,
                    }}>
                    {t('No event has been pinned')}
                  </Text>
                  <Text style={{}}>{t('i. Create event or navigate to events screen.')}</Text>
                  <Text style={{}}>{t('ii. Long press on any event from list.')}</Text>
                  <Text style={{}}>
                    {t(
                      'iii. In the upper menu, a pin icon will appear click on it and the event will display here as pinned event.',
                    )}
                  </Text>
                </View>
                <Button
                  style={{
                    marginTop: '5%',
                    width: '70%',
                    alignSelf: 'center',
                  }}
                  contentStyle={{padding: '2%'}}
                  buttonStyle={{padding: '1%', width: '100%'}}
                  theme={{roundness: 2}}
                  mode="outlined"
                  icon="plus-circle-multiple-outline"
                  labelStyle={{fontWeight: 'bold'}}
                  onPress={() => navigation.navigate('AddGroup')}>
                  {t('Create event')}
                </Button>

                <Button
                  style={{
                    marginTop: '3%',
                    width: '70%',
                    alignSelf: 'center',
                  }}
                  contentStyle={{padding: '2%'}}
                  buttonStyle={{padding: '1%', width: '100%'}}
                  theme={{roundness: 2}}
                  mode="contained"
                  icon="pin"
                  labelStyle={{fontWeight: 'bold'}}
                  onPress={() => navigation.navigate('HomeIndex')}
                  buttonColor={theme.colors.blueBG}>
                  {t('Pin from existing events')}
                </Button>
              </View>
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
        text={t('Something went wrong')}
        onDismissHandler={() => setIsError(false)}
      />
    </View>
  );
};

export default Groups;
