'use client';
import { useEffect, useMemo, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store/store';
import { useParams } from 'next/navigation';

// ----------------------------------------------------------------------

const icon = (name: string, dimentions: number = 1) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: dimentions, height: dimentions }}
  />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  dashboard: icon('home', 0.75),
  order: icon('orders', 0.75),
  categorie: icon('categories', 0.75),
  product: icon('products', 0.75),
  analytics: icon('analytics', 0.75),
  customers: icon('customers', 0.75),
  payments: icon('ic_payment', 0.75),
  vouchers: icon('ic_vouchers', 0.75),
  integrations: icon('ic_integrations', 0.75),
  domain: icon('domain', 0.75),
  deliverypickup: icon('ic_deliverypickup', 0.75),
  accountSettings: icon('ic_settings', 0.75),
  design: icon('ic_design', 0.75),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const { categoury } = useParams();

  // Initialize state with the initial value for navData
  let navData = [
    // OVERVIEW
    // ----------------------------------------------------------------------
    {
      subheader: t('overview'),
      items: [
        {
          title: t('Web Theme'),
          icon: ICONS.analytics,
          path: '',
          children: [
            {
              title: t('theme'),
              path: `/dashboard/${categoury}/theme`,
              icon: ICONS.blog,
            },
            {
              title: t('style'),
              path: `/dashboard/${categoury}/style`,
              icon: ICONS.blog,
            },
            {
              title: t('icons'),
              path: `/dashboard/${categoury}/icon`,
              icon: ICONS.blog,
            },
          ],
        },
        {
          title: t('Mobile Theme'),

          icon: ICONS.analytics,
          path: '',
          children: [
            {
              title: t('theme'),
              path: `/dashboard/${categoury}/theme`,
              icon: ICONS.blog,
            },
            {
              title: t('style'),
              path: `/dashboard/${categoury}/style`,
              icon: ICONS.blog,
            },
            {
              title: t('icons'),
              path: `/dashboard/${categoury}/icon`,
              icon: ICONS.blog,
            },
          ],
        },
        {
          title: t('Plans'),
          path: `/dashboard/${categoury}/plans`,
          icon: ICONS.blog,
        },
        {
          title: t('Currency'),
          path: `/dashboard/${categoury}/currency`,
          icon: ICONS.blog,
        },
      ],
    },
  ]; // Add any other dependencies as needed

  return navData;
}

interface NavItem {
  title: string;
  icon: any; // Adjust the type according to what ICONS returns
  path: string;
  children?: NavItem[]; // Optional, for nested items
  permissions?: string[]; // Optional, for permission checks
}

interface NavDataItem {
  subheader: string;
  items: NavItem[];
}
