import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translationsGetters = {
    en: () => require('./en-US.json'),
    pt: () => require('./pt-BR.json'),
};

export const translate = memoize(
    (key, config?) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = () => {
    const fallback = { languageTag: 'en' };

    const { languageTag } =
        RNLocalize.findBestAvailableLanguage(
            Object.keys(translationsGetters)
        ) || fallback;

    if (translate.cache.clear === undefined) {
        return;
    }

    translate.cache.clear();

    i18n.translations = { [languageTag]: translationsGetters[languageTag]() };
    i18n.locale = languageTag;
};

setI18nConfig();
