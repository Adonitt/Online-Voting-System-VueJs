import {createI18n} from "vue-i18n";
import en from "@/locales/en.js";
import sq from "@/locales/sq.js";

export default createI18n({
    legacy: false, locale: import.meta.env.VITE_I18N_LOCALE || 'sq', // gjuha startuese qfare me kane
    fallbackLocale: import.meta.env.VITE_I18N_FULLBACK_LOCALE || 'en', // nese nuk e gjan shqip , e merr english
    messages: {
        sq: sq, en: en, de: de
    }
})