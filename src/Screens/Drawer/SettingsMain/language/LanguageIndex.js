import {I18nManager, ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import i18next from '../../../../../locales/i18next';
import {useSelector, useDispatch} from 'react-redux';
import languagesList from '../../../../../locales/languagesList';
import {handleCurrentLanguage} from '../../../../redux/reducers/user/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart'; // Import package from node modules
import CountryFlag from 'react-native-country-flag';

const Index = () => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const theme = useTheme();

  const [filteredDataSource, setFilteredDataSource] = useState([]);
  useEffect(() => {
    setFilteredDataSource(Object.values(languagesList));
  }, [languagesList]);

  const currentLanguage = useSelector(state => state.user.currentLanguage);

  const [languageToUpdate, setLanguageToUpdate] = useState('');
  const reqToChangeLng = async lng => {
    const isNewLanguageRTL = i18next.dir(lng) === 'rtl';
    const isCurrentLayoutRTL = I18nManager.isRTL;
    const isLayoutSame = isCurrentLayoutRTL === isNewLanguageRTL;

    if (!isLayoutSame) {
      setLanguageToUpdate(lng);
      setVisible(true);
    } else {
      changeLng(lng);
    }
  };

  const changeLng = async lng => {
    const isNewLanguageRTL = i18next.dir(lng) === 'rtl';
    const isCurrentLayoutRTL = I18nManager.isRTL;
    const isLayoutSame = isCurrentLayoutRTL === isNewLanguageRTL;


    setValue(lng);
    await AsyncStorage.setItem('currentLanguage', lng);
    dispatch(handleCurrentLanguage(lng));
    i18next.changeLanguage(lng).then(async () => {
      const l = i18n.language;
      let isLangRTL = l == 'ar' || l == 'ur';
      I18nManager.forceRTL(isLangRTL);
      if(!isLayoutSame){
        RNRestart.restart();
      }
    });
  };

  const [value, setValue] = useState(currentLanguage);
  const [lang, setLang] = useState('');
  const [visible, setVisible] = useState(false);

  // searchFilterFunction() has been written after 12 hours of work. Before modifying remember the first rule of programming
  // if it's working don't touch it
  const searchFilterFunction = async text => {
    const languageValues = Object.values(languagesList);
    setFilteredDataSource(languageValues);
    if (text) {
      let tempArr = [];

      Object.values(languagesList)?.filter((item, i) => {
        const itemData = item
          ? item?.name?.toLowerCase() + item?.nativeName?.toLowerCase()
          : ''.toLowerCase();
        const textData = text?.toLowerCase();
        if (itemData.indexOf(textData) > -1) {
          tempArr.push(i);
        }
        return itemData.indexOf(textData) > -1;
      });
      let finalArray = [];
      for (let i = 0; i < tempArr.length; i++) {
        finalArray.push(languageValues[tempArr[i]]);
      }
      setFilteredDataSource(finalArray);
    } else {
      setFilteredDataSource(Object.values(languagesList));
    }
  };

  return (
    <View
      style={{
        paddingVertical: '2%',
        flex: 1,
        paddingHorizontal: '4%',
        backgroundColor: theme.colors.background,
      }}>
      <TextInput
        label={t('Search for language')}
        mode="outlined"
        left={<TextInput.Icon icon={'magnify'} />}
        dense
        value={lang}
        onChangeText={e => {
          setLang(e);
          searchFilterFunction(e);
        }}
        style={{marginBottom: '4%'}}
        activeOutlineColor={theme.colors.secondary}
      />

      {filteredDataSource?.length ? (
        <RadioButton.Group onValueChange={newValue => reqToChangeLng(newValue)} value={value}>
          <ScrollView>
            {filteredDataSource?.map((item, index) => (
              <View
                key={index}
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View style={{marginRight: '3%'}}>
                  <CountryFlag isoCode={item?.isoCode} size={18} />
                </View>
                <View style={{width: '95%'}}>
                  <RadioButton.Item
                    label={item.nativeName}
                    // label={"native name"}
                    value={item.code}
                    onValueChange={() => reqToChangeLng(item)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </RadioButton.Group>
      ) : (
        <View>
          <Text style={{marginTop: '5%', textAlign: 'center'}}>{t('No language found')}</Text>
        </View>
      )}

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{t('Layout change')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Due to change in writing direction, this language needs to restart the app
            </Paragraph>
            {languageToUpdate === 'ur' && (
              <Paragraph>
                تحریری سمت میں تبدیلی کی وجہ سے، اس زبان کو ایپ کو دوبارہ شروع کرنے کی ضرورت ہے۔
              </Paragraph>
            )}
            {languageToUpdate === 'ar' && (
              <Paragraph>
                بسبب التغيير في اتجاه الكتابة، تحتاج هذه اللغة إلى إعادة تشغيل التطبيق
              </Paragraph>
            )}
            {languageToUpdate === 'fr' && (
              <Paragraph>
                En raison d'un changement dans le sens d'écriture, cette langue doit redémarrer
                l'application
              </Paragraph>
            )}
            {languageToUpdate === 'hi' && (
              <Paragraph>
                लेखन दिशा में परिवर्तन के कारण, इस भाषा को ऐप को पुनः आरंभ करने की आवश्यकता है
              </Paragraph>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={theme.colors.error} onPress={() => setVisible(false)}>
              Close {' '}
              {languageToUpdate === 'ar' && 'يغلق'}
              {languageToUpdate === 'fr' && 'Fermer'}
              {languageToUpdate === 'ur' && 'بند کریں'}
              {languageToUpdate === 'hi' && 'बंद करना'}
            </Button>
            <Button
              textColor={theme.colors.primary}
              onPress={() => {
                changeLng(languageToUpdate);
                setVisible(false);
              }}>
              Restart {" "}
              {languageToUpdate === 'ar' && 'تغيير التخطيط'}
              {languageToUpdate === 'fr' && 'Redémarrage'}
              {languageToUpdate === 'ur' && 'دوبارہ شروع کریں'}
              {languageToUpdate === 'hi' && 'पुनः आरंभ करें'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default Index;
