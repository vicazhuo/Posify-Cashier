import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '@/store/index';

import Languages from '@/i18n/locale';

store.dispatch('store/i18n/getLocale');

const locale = store.state.store.i18n.locale;

Vue.use(VueI18n);

export default new VueI18n({
    locale,
    messages: Languages
});
