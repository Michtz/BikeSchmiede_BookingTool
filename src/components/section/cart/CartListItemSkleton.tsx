import React from 'react';
import Skeleton from '@/components/system/Skeleton';
import style from '@/styles/CartList.module.scss';

export const CartItemSkeleton: React.FC = () => {
  return (
    <>
      <div className={style.skeletonAccordionHeader}>
        <Skeleton variant="circular" width="24px" height="24px" />

        <div className={style.skeletonProductInfo}>
          <Skeleton
            variant="rectangular"
            width="80px"
            height="80px"
            borderRadius="8px"
          />

          <div className={style.skeletonProductDetails}>
            <Skeleton width="60px" height="12px" />
            <Skeleton width="180px" height="16px" />
            <Skeleton width="80px" height="14px" />
          </div>
        </div>

        <div className={style.skeletonControls}>
          <Skeleton
            variant="rectangular"
            width="160px"
            height="40px"
            borderRadius="8px"
          />
          <Skeleton width="100px" height="18px" />
        </div>
      </div>
    </>
  );
};

export default CartItemSkeleton;
