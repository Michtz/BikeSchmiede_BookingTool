import React from 'react';
import Button from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';
import { IProduct } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface ProductTableRowProps {
  product: IProduct;
  onEditProduct: (product: IProduct) => void;
  onDeleteProduct: (product: IProduct) => Promise<void>;
  getStockStatus: (stock: number) => { text: string; class: string };
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onEditProduct,
  onDeleteProduct,
  getStockStatus,
}) => {
  const { t } = useTranslation();
  const stockStatus = getStockStatus(product.stockQuantity);

  return (
    <tr key={product._id}>
      <td className={style.imageCell}>
        <div className={style.productImage}>
          {product?.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name.inv}
              width={50}
              height={50}
            />
          ) : (
            <div className={style.imagePlaceholder}>
              <MaterialIcon icon="image" />
            </div>
          )}
        </div>
      </td>
      <td className={style.nameCell}>
        <div>
          <div className={style.productName}>{product.name.inv}</div>
          <div className={style.productDescription}>
            {product.description.inv && product?.description.inv.length > 60
              ? `${product.description.inv.substring(0, 60)}...`
              : product.description.inv}
          </div>
        </div>
      </td>
      <td>
        <span className={style.categoryBadge}>{product.category}</span>
      </td>
      <td className={style.priceCell}>CHF {product.price.toFixed(2)}</td>
      <td className={style.stockCell}>
        <div className={style.stockInfo}>
          <span className={style.stockNumber}>{product.stockQuantity}</span>
          <span className={`${style.stockStatus} ${style[stockStatus.class]}`}>
            {stockStatus.text}
          </span>
        </div>
      </td>
      <td>
        <span
          className={`${style.statusBadge} ${product?.isActive ? style.active : style.inactive}`}
        >
          {product.isActive
            ? t('adminProducts.activeStatus')
            : t('adminProducts.inactiveStatus')}
        </span>
      </td>
      <td className={style.actionsCell}>
        <div className={style.actionButtons}>
          <Button
            appearance="icon"
            variant="ghost"
            icon="edit"
            onClick={() => onEditProduct(product)}
            title={t('adminProducts.editButton')}
          />
          <Button
            appearance="icon"
            variant="ghost"
            icon="delete"
            onClick={() => onDeleteProduct(product)}
            title={t('adminProducts.deleteButton')}
          />
        </div>
      </td>
    </tr>
  );
};
