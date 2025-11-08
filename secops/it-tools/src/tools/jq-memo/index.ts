import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.jq-memo.title'),
  path: '/jq-memo',
  description: t('tools.jq-memo.description'),
  keywords: ['jq', 'cheatsheet', 'memo'],
  component: () => import('./jq-memo.vue'),
  icon: Brackets,
  createdAt: new Date('2024-08-15'),
  category: 'Cheatsheets',
});
