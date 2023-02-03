
import { Appbar } from 'react-native-paper';

export default function CustomNavigationBar({ navigation, back, title }) {
    return (
      <Appbar.Header elevated={true}>
        {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={title} />
      </Appbar.Header>
    );
  }