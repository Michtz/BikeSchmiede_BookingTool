import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import style from '@/styles/ProductCard.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  image?: string;
  title?: string;
  description?: string;
  price?: string | number;
  disabled?: boolean;
  onCardClick: (id: string) => void;
  onIconClick?: (id: string) => Promise<void>;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  image,
  description,
  title,
  price,
  disabled,
  onCardClick,
  onIconClick,
}) => {
  const { t } = useTranslation();
  return (
    <div onClick={() => onCardClick(id)} className={style.cardContainer}>
      <div className={style.imageContainer}>
        {image && (
          <Image
            src={image}
            alt={title || 'Product image'}
            fill
            className={style.productImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        )}
      </div>
      <h1 className={style.title}>{title}</h1>
      <p className={style.description}>{description}</p>
      <span className={style.priceContainer}>
        {onIconClick && (
          <ButtonContainer>
            <Button
              variant={'ghost'}
              appearance={'icon'}
              visability={!disabled}
              onClick={() => onIconClick(id)}
            >
              <MaterialIcon icon={'shopping_basket'} />
            </Button>
          </ButtonContainer>
        )}

        <p className={style.price}>
          {t('units.currency-per-piece', { price })}
        </p>
      </span>
    </div>
  );
};

export const CartsContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className={style.cardsContainer}>{children}</div>
);
export default ProductCard;
