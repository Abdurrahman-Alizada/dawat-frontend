import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Button,
  Avatar,
  List,
  Snackbar,
  Text,
  useTheme,
  Appbar,
  Card,
  Divider,
} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import GeneralAppbar from '../../../../../Components/GeneralAppbar';
const Index = ({group, onClose}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );


  const [SnackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackBar, setShowSnackbar] = useState(false);

  const goBack = () => navigation.goBack();

  
  return (
    <View style={{flex: 1}}>
      <GeneralAppbar title={'Summary'} back={goBack} navigation={navigation} />

      <ScrollView contentContainerStyle={{}}>
        <Text
          style={{
            paddingHorizontal: '5%',
            marginVertical: '3%',
            color: theme.colors.textGray,
            fontWeight: '600',
          }}
          variant="bodyMedium">
          Group: '{currentViewingGroup?.groupName}'
        </Text>

        <View
          style={{
            marginVertical: '2%',
          }}>
          <Text style={{paddingVertical:"3%", paddingHorizontal: '5%', fontWeight:"700"}} variant="headlineSmall">
            Guests
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              paddingHorizontal: '5%',
            }}>
            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.error,
                }}
                variant="headlineLarge">
                20
              </Text>

                <Text
                  style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
                  variant="bodyLarge">
                  Pending
                </Text>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.primary,
                }}
                variant="headlineLarge">
                20
              </Text>
                <Text
                  style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
                  variant="bodyLarge">
                  Invited
                </Text>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.tertiary,
                }}
                variant="headlineLarge">
                20
              </Text>
                <Text
                  style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
                  variant="bodyLarge">
                  Others
                </Text>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.secondary,
                }}
                variant="headlineLarge">
                20
              </Text>

                <Text
                  style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
                  variant="bodyLarge">
                  Total
                </Text>
            </Card>
          </View>
          {/* <Divider
            style={{marginTop: '2%',height:1, marginHorizontal: '5%'}}
          /> */}
        </View>

        <View
          style={{
            marginVertical: '2%',
          }}>
          <Text style={{paddingVertical:"3%", paddingHorizontal: '5%', fontWeight:"700"}} variant="headlineSmall">
            Tasks
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              paddingHorizontal: '5%',
            }}>
            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.error,
                }}
                variant="headlineLarge">
                20
              </Text>

                <Text
                  style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
                  variant="bodyLarge">
                  Not completed
                </Text>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.primary,
                }}
                variant="headlineLarge">
                34
              </Text>
                <Text
                  style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
                  variant="bodyLarge">
                  Completed
                </Text>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '100%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.secondary,
                }}
                variant="headlineLarge">
                20
              </Text>

                <Text
                  style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
                  variant="bodyLarge">
                  Total
                </Text>
            </Card>
          </View>
          
        </View>

      </ScrollView>

      <Snackbar
        visible={showSnackBar}
        duration={3000}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: 'Ok',
          onPress: () => {
            setShowSnackbar(false);
          },
        }}>
        {SnackbarMessage}
      </Snackbar>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  postDescription: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: 'normal',
  },
  seeMore: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
