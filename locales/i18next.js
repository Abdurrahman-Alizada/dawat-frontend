import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';
import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';
import ur from './ur.json';
import hi from './hi.json';

export const languageResources = {
  // left to right
  en: en,
  // fr: fr,
  // hi: hi,
  // right to left
  // ar: ar,
  ur: ur,
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18next;
