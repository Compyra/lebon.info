import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.passphrase-generator.title'),
  path: '/passphrase-generator',
  description: t('tools.passphrase-generator.description'),
  keywords: ['passphrase', 'random', 'password', 'generator'],
  component: () => import('./passphrase-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-08-15'),
  category: 'Generators',
});
