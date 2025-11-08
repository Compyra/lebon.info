import { Firetruck } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.firewalld-generator.title'),
  path: '/firewalld-generator',
  description: t('tools.firewalld-generator.description'),
  keywords: ['firewalld', 'fw'],
  component: () => import('./firewalld-generator.vue'),
  icon: Firetruck,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
