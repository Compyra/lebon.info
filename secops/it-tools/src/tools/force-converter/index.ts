import { Power } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.force-converter.title'),
  path: '/force-converter',
  description: t('tools.force-converter.description'),
  keywords: ['force', 'converter'],
  component: () => import('./force-converter.vue'),
  icon: Power,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
