'use client';

import React, { useState } from 'react';
import style from '@/styles/admin/AdminProduct.module.scss';
import AdminProductList from '@/components/section/admin/product/AdminProductList';
import { Container } from '@/components/system/Container';
import { ModalProvider } from '@/hooks/ModalProvide';
import ProductForm from '@/components/section/admin/product/ProductFormComponent';
import { IProduct } from '@/types/product.types';
import { useTranslation } from 'react-i18next';

const AdminProductsContent: React.FC = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct>();

  const handleCreateProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: IProduct) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  if (showForm) {
    return (
      <div className={style.adminContainer}>
        <ProductForm product={editingProduct} onClose={handleCloseForm} />
      </div>
    );
  }

  return (
    <>
      <div className={style.pageHeader}>
        <h1>{t('adminProducts.productManagement')}</h1>
      </div>
      <AdminProductList
        onEditProduct={handleEditProduct}
        onCreateProduct={handleCreateProduct}
      />
    </>
  );
};

const AdminProductsContainer: React.FC = () => {
  return (
    <ModalProvider>
      <Container flow="column" alignItems="center">
        <AdminProductsContent />
      </Container>
    </ModalProvider>
  );
};

export default AdminProductsContainer;
