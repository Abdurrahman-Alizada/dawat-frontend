import {View, Text, Image, ScrollView, TouchableOpacity, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import {List, useTheme} from 'react-native-paper';
import BackgroundImages from './mainBackgroundImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {handleCurrentBackgroundImgSrcId} from '../../../../redux/reducers/groups/groups';

const ChangeMainImage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const currentBackgroundImgSrcId = useSelector(state => state.groups.currentBackgroundImgSrcId);

  const handleBackgroundImage = async id => {
    await AsyncStorage.setItem(`pingroup_backgroundImage`, `${id}`);
    dispatch(handleCurrentBackgroundImgSrcId(id));
  };

  return (
    <View style={{flex: 1, padding: '5%'}}>
      <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
        {BackgroundImages?.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => handleBackgroundImage(index)} style={{}}>
            <ImageBackground
              style={{height: 235, marginBottom: '5%', overflow: 'hidden', borderRadius: 10}}
              source={image}
              imageStyle={{resizeMode: "cover"}}
              >
              <View
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 0,
                  right: 0,
                  padding: '2%',
                }}>
                {currentBackgroundImgSrcId === index && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: theme.colors.primary,
                      borderRadius: 50,
                    }}>
                    <Image
                      style={{width: 20, height: 20}}
                      source={require('../../../../assets/images/groupDetails/invitation-approve-icon.png')}
                    />
                  </View>
                )}
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ChangeMainImage;
