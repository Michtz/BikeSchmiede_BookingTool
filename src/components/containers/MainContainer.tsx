import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useProducts from '@/hooks/ProductsHook';
import { useParams, useRouter } from 'next/navigation';
import CategoryNavigation from '@/components/system/CategoryNavigation';
import Carousel, { CarouselItem } from '@/components/system/Carousel';
import { getCategoryIndex, getCategoryName } from '@/functions/common';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import {
  Container,
  HorizontalScrollContainer,
  Title,
} from '@/components/system/Container';
import { getCart, updateCartItem } from '@/requests/cart.request';
import { IProduct } from '@/types/product.types';
import { Params } from 'next/dist/server/request/params';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useAuth } from '@/hooks/AuthHook';
import MainImage from '@/assets/Slide2_Homepage.webp';
import CleaningImage from '@/assets/Homepage_Wellness2.webp';
import CoffeeCupsImage from '@/assets/CoffeCupsMainImage.webp';
import ScalesImage from '@/assets/ScalesMainImage.webp';
import MichJugsImage from '@/assets/MilchJugsMainImage.webp';
import ToolsMainImage from '@/assets/ToolsMainImage.webp';
import TamperImage from '@/assets/TamperMainImages.webp';

import FilterContainer, {
  FilterOptionCode,
} from '@/components/system/FilterContainer';
import { useContentTranslate } from '@/hooks/ContentTranslationHook';
import useCart, { CartItem } from '@/hooks/CartHook';
import { useSideCart } from '@/hooks/SideCartHook';

const MainContainer: React.FC = () => {
  const { products, isLoading } = useProducts();
  const { cartItems, mutate } = useCart();
  const { showFeedback } = useFeedback();
  const { openSideCart } = useSideCart();
  const { t } = useTranslation();
  const params: Params = useParams();
  const { translate } = useContentTranslate();
  const { sessionData, isSessionReady, userSessionData } = useAuth();
  const [activeSort, setActiveSort] = useState<FilterOptionCode>('relevance');

  const category: string | undefined = getCategoryName(
    params?.category as string,
  );

  const [articles, setArticles] = useState<IProduct[]>(products);
  const [sortedArticles, setSortedArticles] = useState<IProduct[]>(products);

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    setSortedArticles(products);
    setArticles(products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, category]);

  const slides: CarouselItem[] = [
    {
      image: MainImage,
      alt: 'vf',
      title: '',
      description: '',
    },
    {
      image: TamperImage,
      alt: 'abcd',
      title: '',
      description: '',
    },
    {
      image: MichJugsImage,
      alt: 'abcd',
      title: '',
      description: '',
    },
    {
      image: ToolsMainImage,
      alt: 'abcd',
      title: '',
      description: '',
    },
    {
      image: CoffeeCupsImage,
      alt: 'abcd',
      title: '',
      description: '',
    },
    {
      image: CleaningImage,
      alt: 'def',
      title: '',
      description: '',
    },

    {
      image: ScalesImage,
      alt: 'abcd',
      title: '',
      description: '',
    },
  ];

  // const slides: CarouselItem[] =
  //   products?.map((product) => ({
  //     id: product._id,
  //     image: product.imageUrl || '/placeholder.jpg',
  //     alt: product.name,
  //     title: product.name,
  //     description: `${product.description} - CHF ${product.price}`,
  //   })) || [];

  const handleAddToCart = async (id: string) => {
    try {
      if (!isSessionReady || !sessionData?.sessionId) {
        showFeedback(t('feedback.session-not-ready'), 'error');
        return;
      }

      let quantity: number = 1;
      let cartItem: CartItem | undefined = cartItems?.find(
        (item) => item.productId === id,
      );

      if (!cartItem) {
        const response = await getCart(
          sessionData.sessionId,
          userSessionData?.user.id,
        );
        cartItem = response?.data.data.items?.find(
          (item: CartItem) => item.productId === id,
        );
      }
      if (cartItem) quantity = cartItem.quantity + 1;
      await updateCartItem(
        sessionData.sessionId,
        id,
        quantity,
        userSessionData?.user?.id || '',
      );
      mutate('cart');
      openSideCart();
      // showFeedback(t('feedback.add-to-cart-success'), 'success');
    } catch {
      showFeedback(t('feedback.data-saved-error'), 'error');
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  let previewItemsCount: number = 3;
  return (
    <Container
      flow={'column'}
      alignItems={'center'}
      justifyContent={'flex-end'}
      padding={false}
      maxWidth={'1150'}
      gap={'2'}
    >
      {category && <Title>{category}</Title>}
      {!category && (
        <Carousel items={slides} controls={false} interval={7000} indicators />
      )}
      {!category && (
        <HorizontalScrollContainer>
          {articles?.map((product, i: number) => {
            if (i > previewItemsCount) return;
            if (product.stockQuantity === 0) {
              previewItemsCount = previewItemsCount++;
            }
            const matchingItem = cartItems?.find(
              (item) => item?.productId === product._id,
            );
            const disabled = matchingItem
              ? matchingItem.quantity >= product.stockQuantity
              : false;
            return (
              <ProductCard
                key={product._id}
                id={product._id}
                title={translate(product.name)}
                description={translate(product.description)}
                image={product.imageUrl}
                price={product.price}
                disabled={disabled}
                onCardClick={() => handleCardClick(product._id)}
                onIconClick={() => handleAddToCart(product._id)}
              />
            );
          })}
        </HorizontalScrollContainer>
      )}
      {category && (
        <Carousel
          startIndex={getCategoryIndex(params?.category as string)}
          items={slides}
          controls={false}
          interval={7000}
          indicators
        />
      )}
      <CategoryNavigation activeCategory={category} />

      <FilterContainer
        setItems={setSortedArticles}
        sortCode={activeSort}
        setSortCode={(newCode: FilterOptionCode) => setActiveSort(newCode)}
      />
      <CartsContainer>
        {sortedArticles?.map((product: IProduct, i: number) => {
          const matchingItem = cartItems?.find(
            // todo: move to hook
            (item) => item?.productId === product._id,
          );
          const disabled = matchingItem
            ? matchingItem.quantity >= product.stockQuantity
            : false;

          return (
            <React.Fragment key={product._id}>
              <ProductCard
                id={product._id}
                title={translate(product.name)}
                description={translate(product.description)}
                image={product.imageUrl}
                price={product.price}
                disabled={disabled}
                onCardClick={() => handleCardClick(product._id)}
                onIconClick={() => handleAddToCart(product._id)}
              />
              {/* show after 15 items */}
              {(i + 1) % 15 === 0 && (
                <Carousel
                  key={`carousel-${i}`}
                  items={slides} // Todo: add more pictures for the slides
                  controls={false} // Todo: add a link for the fotos (maybe for categories or brands some times)
                  interval={7000}
                  indicators
                  startIndex={i * 0.1}
                />
              )}
            </React.Fragment>
          );
        })}
      </CartsContainer>
    </Container>
  );
};

export default MainContainer;
