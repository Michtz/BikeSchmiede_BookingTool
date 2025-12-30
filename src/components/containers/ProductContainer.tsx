'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import ProductPageContainer from '@/components/section/product/ProductPageContainer';

type View = 'gravity' | 'flow' | 'reaction' | 'slide';

interface ProductContainerProps {
  view: View;
}

const ProductContainer: FC<ProductContainerProps> = ({ view }) => {
  return (
    <Container padding={false} alignItems={'center'} flow={'column'}>
      <ProductContent view={view} />
    </Container>
  );
};

const ProductContent: React.FC<ProductContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'gravity':
        return <ProductPageContainer />;
      default:
        return <></>;
    }
  };
  return (
    <Container justifyContent={'center'} flow={'column'} padding={false}>
      {getCurrentView()}
    </Container>
  );
};

export default ProductContainer;
