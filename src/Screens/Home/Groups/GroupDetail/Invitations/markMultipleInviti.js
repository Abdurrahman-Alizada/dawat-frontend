import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, FAB, useTheme} from 'react-native-paper';

const MarkMultipleInviti = ({navigation}) => {
  const theme = useTheme();
  return (
    <View style={{flex: 1}}>
      <Appbar
        style={{
          backgroundColor: theme.colors.background,
        }}
        elevated
        >
        <Appbar.BackAction
          onPress={()=>navigation.goBack()}
          style={{maxWidth: '10%'}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '90%',
          }}>
          <Appbar.Action icon="check" onPress={() => {}} />
          <Appbar.Action icon="clock-outline" onPress={() => {}} />
          <Appbar.Action icon="cancel" onPress={() => {}} />
          <Appbar.Action icon="label-off" onPress={() => {}} />
        </View>
      </Appbar>
    </View>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    // bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});

export default MarkMultipleInviti;
