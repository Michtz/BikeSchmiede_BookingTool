import React from 'react';
import MaterialIcon from '@/components/system/MaterialIcon';
import { Container } from '@/components/system/Container';
import { IProduct } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';
import { useTranslation } from 'react-i18next';

interface ProductTableHeadProps {
  handleSort: (column: keyof IProduct) => void;
  getSortIcon: (column: keyof IProduct) => string;
}

export const ProductTableHead: React.FC<ProductTableHeadProps> = ({
  handleSort,
  getSortIcon,
}) => {
  const { t } = useTranslation();

  return (
    <thead>
      <tr>
        <th>
          <span>{t('table.headers.image')}</span>
        </th>
        <th className={style.sortableHeader} onClick={() => handleSort('name')}>
          <Container padding={false}>
            {t('table.headers.name')}
            <MaterialIcon icon={getSortIcon('name')} iconSize="small" />
          </Container>
        </th>
        <th>{t('table.headers.category')}</th>
        <th
          className={style.sortableHeader}
          onClick={() => handleSort('price')}
        >
          <Container padding={false}>
            {t('table.headers.price')}
            <MaterialIcon icon={getSortIcon('price')} iconSize="small" />
          </Container>
        </th>
        <th
          className={style.sortableHeader}
          onClick={() => handleSort('stockQuantity')}
        >
          <Container padding={false}>
            {t('table.headers.stock')}
            <MaterialIcon
              icon={getSortIcon('stockQuantity')}
              iconSize="small"
            />
          </Container>
        </th>
        <th>{t('table.headers.status')}</th>
        <th>{t('table.headers.actions')}</th>
      </tr>
    </thead>
  );
};
