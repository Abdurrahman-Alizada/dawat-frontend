import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {Button, Avatar, List, Snackbar, Text, useTheme, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import RNFS from 'react-native-fs';
import {jsonToCSV, readString} from 'react-native-csv';
import {useSelector, useDispatch} from 'react-redux';
import {
  handleIsExportBanner,
  handleIsExportPDFBanner,
} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import moment from 'moment';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import DocumentPicker, {types} from 'react-native-document-picker';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import base64Logo from '../../../../../assets/logo/base64Logo';
import {useTranslation} from 'react-i18next';

const Index = ({onClose}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const {t} = useTranslation();
  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);

  const importCSV = () => {
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
              .then(result => {
                console.log(result);
                if (result.data) uploadCSV();
              })
              .catch(error => {
                console.log(error.message);
              });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            uploadCSV();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log('error is=>', error.message);
      });
  };

  const uploadCSV = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: types.csv,
      });
      if (res.type === 'text/comma-separated-values') {
        RNFS.readFile(res.uri, 'ascii')
          .then(response => {
            const results = readString(response);
            onClose();
            navigation.navigate('AddMultipleInviti', {data: results.data});
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        alert('Please select .csv file');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        onClose();
        alert('You did not pick any file');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const [exportLoading, setExportLoading] = useState(false);
  const exportCSV = () => {
    //  saveCSV();
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        console.log(result);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
              .then(result => {
                console.log(result);
                if (result.data) saveCSV();
              })
              .catch(error => {
                console.log(error.message);
              });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            saveCSV();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log('error is=>', error.message);
      });
  };

  const saveCSV = async () => {
    const jsonData = invitatiesFromAsyncStorage?.map(user => {
      return {
        'Guest name': user.invitiName,
        'Guest Description': user.invitiDescription,
        'Guest contact': user.contact,
        'Added by': user?.addedBy?.name,
        'Last status': user?.lastStatus?.invitiStatus,
        'Last status updated by': user?.lastStatus?.addedBy?.name,
        'Image URL of guest': user.invitiImageURL,
      };
    });
    const results = jsonToCSV(jsonData);
    const date = moment(new Date()).format(' d_MMM_YYYY_hh_mm_ss_A');
    const path = RNFS.DownloadDirectoryPath + `/${currentViewingGroup.groupName}${date}.csv`;

    RNFS.writeFile(path, results, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!', success);
        setExportLoading(false);
        onClose();
        dispatch(handleIsExportBanner(true));
      })
      .catch(err => {
        setSnackbarMessage('something went wrong');
        setShowSnackbar(true);
        console.log(err.message);
      });
  };

  const [invitatiesFromAsyncStorage, setInvitiesFromAsyncStorage] = useState([]);
  const getLocalInvities = async () => {
    let retString = await AsyncStorage.getItem(`guests_${currentViewingGroup?._id}`);
    setInvitiesFromAsyncStorage(JSON.parse(retString));
  };
  useEffect(() => {
    getLocalInvities();
  }, []);

  const [SnackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackBar, setShowSnackbar] = useState(false);

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const exportPDF = () => {
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        console.log(result);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            Alert.alert('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
              .then(result => {
                console.log(result);
                if (result.data) generatePDF();
              })
              .catch(error => {
                console.log(error.message);
              });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            generatePDF();
            break;
          case RESULTS.BLOCKED:
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
              .then(result => {
                console.log(result);
                if (result.data) generatePDF();
              })
              .catch(error => {
                console.log(error.message);
              });

            break;
        }
      })
      .catch(error => {
        console.log('error is=>', error.message);
      });
  };

  // Helper function to get base64 from image file

  const generatePDF = async () => {
    setIsLoadingPdf(true);
    const date = moment(new Date()).format(' d_MMM_YYYY_hh_mm_ss_A');

    try {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica';
                font-size: 12px;
              }
              footer {
                height: 50px;
                background-color: #fff;
                color: #000;
                display: flex;
                justify-content: flex-end;
                padding: 0 20px;
                margin-top: 20px
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #000;
                padding: 5px;
              }
              th {
                background-color: #ccc;
              }
              h1{
                margin-left:10px;
                margin-right:10px;
              }
            </style>
          </head>
          <body>

            <h1>Guests list of ${currentViewingGroup?.groupName}</h1>
            <table>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Added by</th>
                <th>Last status</th>
              </tr>

              ${invitatiesFromAsyncStorage
                ?.map(
                  user => `
                <tr>
                  <td>${user.invitiName || 'No name'}</td>
                  <td>${user.invitiDescription || 'Not description'}</td>
                  <td>${user?.addedBy?.name == 'You' ? 'Not specified' : user?.addedBy?.name}</td>
                  <td>${user?.lastStatus?.invitiStatus || 'Not specified'}</td>
                </tr>
              `,
                )
                .join('')}
            </table>
            <footer>
              <img src=${base64Logo} />
              <h1>Event planner</h1>
            </footer>
          </body>
        </html>
      `;
      const options = {
        html,
        fileName: `guests_${currentViewingGroup?.groupName}_${date}`,
        directory: 'Event planner',
      };
      await RNHTMLtoPDF.convert(options);
      onClose();
      dispatch(handleIsExportPDFBanner(true));
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const sampleFileDownloadHandler = () => {
    const jsonData = `[
    {
        "Guest name": "Gulab",
        "Guest Description": "some description about Gulab",
        "Guest contact": "contact detail of inviti",
        "Added by": "who is adding Gulab to group",
        "Last status": "status of Gulab invitaion",
        "Last status updated by": "who update the last status of Gulab invitaion",
        "Image URL of guest": "Image URL of gulab"
    }
  ]`;
    const results = jsonToCSV(jsonData);
    const date = moment(new Date()).format(' d_MMM_YYYY_hh_mm_ss_A');
    const path = RNFS.DownloadDirectoryPath + `/sample csv file ${date}.csv`;

    RNFS.writeFile(path, results, 'utf8')
      .then(success => {
        setSnackbarMessage('Sample file has been downloaded in download folder');
        setShowSnackbar(true);
      })
      .catch(err => {
        setSnackbarMessage('something went wrong');
        setShowSnackbar(true);
        console.log(err.message);
      });
  };

  return (
    <View>
      <View style={{padding: '5%'}}>
        <List.Item
          title={currentViewingGroup.groupName}
          description={currentViewingGroup.groupDescription}
          left={props => (
            <Avatar.Image
              {...props}
              size={45}
              source={
                currentViewingGroup.imageURL
                  ? {uri: currentViewingGroup.imageURL}
                  : require('../../../../../assets/drawer/male-user.png')
              }
            />
          )}
        />
        <Divider />
        <Button
          loading={isLoadingPdf}
          onPress={exportPDF}
          mode="contained"
          icon={'download'}
          contentStyle={{padding: '1%'}}
          style={{marginTop: '5%'}}
          buttonColor={theme.colors.error}
          theme={{roundness: 50}}>
          {t("Downlaod as PDF")}
        </Button>

        <Button
          loading={exportLoading}
          onPress={exportCSV}
          mode="contained"
          icon={'download'}
          contentStyle={{padding: '1%'}}
          style={{marginTop: '5%'}}
          buttonColor={'#297548'}
          theme={{roundness: 50}}>
          {t("Downlaod as CSV")}
        </Button>
        <Button
          onPress={importCSV}
          mode="contained"
          icon={'upload'}
          contentStyle={{padding: '1%'}}
          style={{marginTop: '5%'}}
          theme={{roundness: 50}}
          buttonColor={'#6c8ee3'}>
          {t("Upload CSV")}
        </Button>

        <Divider style={{marginVertical: '5%'}} />
        <Text style={{margin: '2%'}}>{t("Explanation")}</Text>

        <View style={{marginHorizontal: '2%'}}>
          <View style={{marginTop: '2%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="pdffile1" size={16} color={theme.colors.onBackground} />
              <Text style={{marginHorizontal: '1%', fontWeight: 'bold'}}>{t("Download PDF")}</Text>
            </View>
            <Text style={{}}>{t("Downlaod the guests list as PDF file")}</Text>
          </View>

          <View style={{marginTop: '5%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcon
                name="microsoft-excel"
                size={16}
                color={theme.colors.onBackground}
              />
              <Text style={{marginHorizontal: '1%', fontWeight: 'bold'}}>{t("Download CSV")}</Text>
            </View>
            <Text style={{}}>{t("Downlaod the guests list as CSV file")}</Text>
            <Text style={{}}>- {t("You can use it in future events")}</Text>
            <Text style={{}}>
              - {t("Just upload the CSV file to any event and it will adjust automatically to that event")}
            </Text>
          </View>

          <View style={{marginTop: '5%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcon
                name="microsoft-excel"
                size={16}
                color={theme.colors.onBackground}
              />
              <Text style={{marginHorizontal: '1%', fontWeight: 'bold'}}>{t("Upload CSV")}</Text>
            </View>
            <Text style={{}}>{t("Upload the CSV file.")}</Text>
            <Text style={{}}>
              - {t("Upload the CSV file that you have downloaded from another event.")}
            </Text>
            <Text style={{}}>- {t("It will adjust automatically to this event")}</Text>
            <Text style={{}}>
              - {t("You can upload your own created CSV file but it fields have to be according the sample file")}
            </Text>
            <TouchableOpacity onPress={sampleFileDownloadHandler} style={{marginVertical: '2%'}}>
              <Text style={{color: theme.colors.primary}}> {t("Downlaod sample file")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Snackbar
        visible={showSnackBar}
        // visible={true}
        duration={3000}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: t('Ok'),
          onPress: () => {
            setShowSnackbar(false);
          },
        }}>
        {t(SnackbarMessage)}
      </Snackbar>
    </View>
  );
};

export default Index;
