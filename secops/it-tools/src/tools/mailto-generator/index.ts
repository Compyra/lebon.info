import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.mailto-generator.title'),
  path: '/mailto-generator',
  description: t('tools.mailto-generator.description'),
  keywords: ['mailto', 'generator', 'link'],
  component: () => import('./mailto-generator.vue'),
  icon: Mail,
  createdAt: new Date('2025-08-17'),
  category: 'Development',
});
