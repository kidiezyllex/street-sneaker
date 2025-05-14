import { MenuItem } from '@/interface/types';
import {
  mdiChartBar,
  mdiTagMultiple,
  mdiRestart,
  mdiShoeSneaker,
  mdiDesk,
  mdiOrderBoolDescendingVariant,
  mdiAccount,
} from '@mdi/js';

export const menuItems: MenuItem[] = [
  {
    id: 'statistics',
    name: 'Thống kê',
    path: '/admin/statistics',
    icon: mdiChartBar,
  },
  {
    id: 'pos',
    name: 'Bán hàng tại quầy',
    path: '/admin/pos',
    icon: mdiDesk,
  },
  {
    id: 'orders',
    name: 'Quản lý đơn hàng',
    path: '/admin/orders',
    icon: mdiOrderBoolDescendingVariant,
  },
  {
    id: 'products',
    name: 'Quản lý sản phẩm',
    path: '/admin/products',
    icon: mdiShoeSneaker,
    subMenu: [
      {
        id: 'products-list',
        name: 'Sản phẩm',
        path: '/admin/products',
      },
      {
        id: 'products-soles',
        name: 'Đế giày',
        path: '/admin/products/soles',
      },
      {
        id: 'products-types',
        name: 'Loại giày',
        path: '/admin/products/types',
      },
      {
        id: 'products-materials',
        name: 'Chất liệu',
        path: '/admin/products/materials',
      },
      {
        id: 'products-brands',
        name: 'Thương hiệu',
        path: '/admin/products/brands',
      },
    ],
  },
  {
    id: 'returns',
    name: 'Trả hàng',
    path: '/admin/returns',
    icon: mdiRestart,
  },
  {
    id: 'discounts',
    name: 'Giảm giá',
    path: '/admin/discounts',
    icon: mdiTagMultiple,
    subMenu: [
      {
        id: 'discounts-vouchers',
        name: 'Mã giảm giá',
        path: '/admin/discounts/vouchers',
      },
      {
        id: 'discounts-promotions', 
        name: 'Khuyến mãi',
        path: '/admin/discounts/promotions',
      },
    ],
  },
  {
    id: 'accounts',
    name: 'Quản lý tài khoản',
    path: '/admin/accounts',
    icon: mdiAccount,
  },
]; 