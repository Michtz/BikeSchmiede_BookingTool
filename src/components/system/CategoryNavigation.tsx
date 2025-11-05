'use client';

import React from 'react';
import style from '@/styles/system/CategoryNavigation.module.scss';
import AssetIcon, { IconType } from '@/components/system/AssetIcon';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface CategoryNavigationProps {
  activeCategory?: string;
}

const CategoryNavigation: React.FC<
  CategoryNavigationProps
> = (): React.ReactElement => {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation(['common']);

  const categories = [
    { icon: 'tampers', label: t('common:products.categories.tamper') },
    { icon: 'milk-jugs', label: t('common:products.categories.milchkannen') },
    { icon: 'tools', label: t('common:products.categories.tools') },
    {
      icon: 'coffee-cups',
      label: t('common:products.categories.kaffeetassen'),
    },
    { icon: 'cleaning-tools', label: t('common:products.categories.cleaning') },
    { icon: 'scales', label: t('common:products.categories.waage') },
  ];

  const handleItemClick = (iconName: string) => {
    router.push(`/${iconName}`, { scroll: false });
  };
  return (
    <div className={style.categoryNavigationContainer}>
      {categories.map(({ icon, label }) => (
        <div
          key={icon}
          className={`${style.categoryNavigationItem} ${
            icon === params.category ? style.active : ''
          }`}
          onClick={() => handleItemClick(icon)}
        >
          <AssetIcon
            icon={icon as IconType}
            size="big"
            color={icon === params.category ? 'white' : '#4C4B4B'}
          />
          <span className={style.categoryLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryNavigation;
