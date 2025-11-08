import { Folder } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.folder-structure-diagram.title'),
  path: '/folder-structure-diagram',
  description: t('tools.folder-structure-diagram.description'),
  keywords: ['folder', 'structure', 'diagram', 'tree', 'ascii'],
  component: () => import('./folder-structure-diagram.vue'),
  icon: Folder,
  createdAt: new Date('2024-04-20'),
  category: 'Text',
});
