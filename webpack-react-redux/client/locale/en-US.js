import { addLocaleData } from 'react-intl';
import localeData from 'react-intl/locale-data/en';
import messages from './en-US.messages';

addLocaleData([...localeData]);

export default {
    lang: 'en-US',
    localeData,
    messages,
};
