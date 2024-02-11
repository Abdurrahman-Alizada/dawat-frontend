
import { Appbar, useTheme } from 'react-native-paper';
import EventSettingsScreenAppbarGift from '../adUnits/eventSettingsScreenAppbarGift';
import {useTranslation} from 'react-i18next'
export default function CustomNavigationBar({ navigation, back, title }) {
  const theme = useTheme()
  const {t} = useTranslation();
  
    return (
      <Appbar.Header style={{backgroundColor: theme.colors.background}}  elevated={true}>
        {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={t(title)} />
       <EventSettingsScreenAppbarGift />
      </Appbar.Header>
    );
  }