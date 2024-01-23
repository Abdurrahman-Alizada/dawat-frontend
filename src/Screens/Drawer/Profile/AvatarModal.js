import React, {useEffect, useState} from 'react';
import {View, ScrollView, Modal, TouchableOpacity} from 'react-native';
import {Divider, IconButton, Avatar, useTheme} from 'react-native-paper';
const AvatarModal = props => {
  const theme = useTheme();

  const avatarsURL = [
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329065/avatars-for-user-profile/Tiger_kcfhtn.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329065/avatars-for-user-profile/Raccon_ju44tn.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329064/avatars-for-user-profile/Panda_qek53a.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329064/avatars-for-user-profile/Lion_qgtzwj.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329064/avatars-for-user-profile/Monkey_w1lfhg.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329064/avatars-for-user-profile/Horse_ze8r60.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329064/avatars-for-user-profile/Rabbit_lkmdsx.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329063/avatars-for-user-profile/Elephant_onovwu.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329063/avatars-for-user-profile/Otter_lrxptc.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329063/avatars-for-user-profile/Dog_ckhcim.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329062/avatars-for-user-profile/Deer_ljj0i4.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329063/avatars-for-user-profile/Chicken_tqtvm0.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329062/avatars-for-user-profile/Cat_a3abro.png',
    'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329063/avatars-for-user-profile/Bear_nvybp5.png',
  ];

  const [selectedAvatar, setSelectedAvatar] = useState('');
  return (
    <Modal visible={props.avatarModalVisible}>
     <View style={{flex:1, backgroundColor:theme.colors.background}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.background,
        }}>
        <IconButton
          style={{}}
          icon="arrow-left"
          // mode="outlined"
          size={30}
          onPress={() => props.setAvatarModalVisible(false)}
        />
        <IconButton
          style={{}}
          icon="check"
          //   mode="outlined"
          size={30}
          onPress={() => {
            props?.imageUploadHandler && props?.imageUploadHandler();
            props.setAvatarModalVisible(false);
          }}
        />
      </View>
      <Divider />

      <ScrollView
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          padding: '1%',
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        {avatarsURL.map((avatarURL, index) => (
          <TouchableOpacity
            onPress={() => {
              props.fileDataRef.current = null;
              setSelectedAvatar(avatarURL);
              props.setAvatarURL(avatarURL);
              props?.setIsEditStart && props?.setIsEditStart(true) // function for inviti image update.. enable update button
            }}
            style={{margin: '1%'}}
            key={index}>
            {selectedAvatar === avatarURL && (
              <IconButton
                style={{
                  position: 'absolute',
                  left: '55%',
                  top: 60,
                  zIndex: 100,
                }}
                icon="check"
                mode="contained"
                size={20}
              />
            )}
            <Avatar.Image
              source={{
                uri: avatarURL,
              }}
              size={100}
            />
          </TouchableOpacity>
        ))}
        
      </ScrollView>
      </View>
    </Modal>
  );
};

export default AvatarModal;
