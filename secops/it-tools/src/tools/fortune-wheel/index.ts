import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.fortune-wheel.title'),
  path: '/fortune-wheel',
  description: t('tools.fortune-wheel.description'),
  keywords: ['fortune', 'wheel'],
  component: () => import('./fortune-wheel.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-02-24'),
  category: 'Gaming',
});
