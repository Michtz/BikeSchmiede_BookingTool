import React from 'react';
import { IProduct } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';
import { ProductTableHead } from './ProductTableHead';
import { ProductTableRow } from '@/components/section/admin/product/ProductTaleRow';

interface ProductTableProps {
  products: IProduct[];
  handleSort: (column: keyof IProduct) => void;
  getSortIcon: (column: keyof IProduct) => string;
  onEditProduct: (product: IProduct) => void;
  onDeleteProduct: (product: IProduct) => Promise<void>;
  getStockStatus: (stock: number) => { text: string; class: string };
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleSort,
  getSortIcon,
  onEditProduct,
  onDeleteProduct,
  getStockStatus,
}) => {
  return (
    <table className={style.productTable}>
      <ProductTableHead handleSort={handleSort} getSortIcon={getSortIcon} />
      <tbody>
        {products.map((product) => (
          <ProductTableRow
            key={product._id}
            product={product}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            getStockStatus={getStockStatus}
          />
        ))}
      </tbody>
    </table>
  );
};
