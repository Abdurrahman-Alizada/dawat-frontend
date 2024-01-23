
import { Appbar, useTheme } from 'react-native-paper';
import EventSettingsScreenAppbarGift from '../adUnits/eventSettingsScreenAppbarGift';
export default function CustomNavigationBar({ navigation, back, title }) {
  const theme = useTheme()
    return (
      <Appbar.Header style={{backgroundColor: theme.colors.background}}  elevated={true}>
        {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={title} />
       <EventSettingsScreenAppbarGift />
      </Appbar.Header>
    );
  }