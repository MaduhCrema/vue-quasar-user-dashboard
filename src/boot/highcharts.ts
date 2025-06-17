import { boot } from 'quasar/wrappers';
import HighchartsVue from 'highcharts-vue';
import type { App } from 'vue';

export default boot(({ app }: { app: App }) => {
  app.use(HighchartsVue);
});
