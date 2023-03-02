import {View} from 'react-native';
import React,{useContext} from 'react';
import { List, Switch, Divider } from 'react-native-paper';
import {PreferencesContext} from '../../../../themeContext';

const Index = ({navigation}) => {
    const {toggleTheme, isThemeDark} = useContext(PreferencesContext);

    return (
    <View>
      <List.Item
        title="Dark Mode"
        onPress={() => toggleTheme()}
        left={(props)=><List.Icon {...props} icon="weather-night" />}
        right={() => (
          <Switch value={isThemeDark} onValueChange={() => toggleTheme()} />
        )}
        style={{paddingVertical: '5%'}}
      />
      <Divider />
    </View>
  );
};

export default Index;
