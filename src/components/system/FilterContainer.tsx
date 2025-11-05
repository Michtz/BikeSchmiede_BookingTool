'use client';
import { FC, useState, useEffect, useMemo } from 'react';
import style from '@/styles/system/FilterContainer.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import { IProduct } from '@/types/product.types';
import { useTranslation } from 'react-i18next';
import { useContentTranslate } from '@/hooks/ContentTranslationHook';
import useProducts from '@/hooks/ProductsHook';

export type FilterType = { value: string; code: FilterOptionCode };

export type FilterOptionCode = 'relevance' | 'down' | 'up' | 'abc' | 'cba';

interface FilterContainerProps {
  setItems: (items: IProduct[]) => void;
  sortCode: FilterOptionCode;
  setSortCode: (code: FilterOptionCode) => void;
}

const FilterContainer: FC<FilterContainerProps> = ({
  setItems,
  sortCode,
  setSortCode,
}) => {
  const { t } = useTranslation();
  const { products } = useProducts();
  const { translate } = useContentTranslate();
  const [wasSortTriggert, setWasSortTriggert] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [activeMinPrice, setActiveMinPrice] = useState<number>(0);
  const [activeMaxPrice, setActiveMaxPrice] = useState<number>(0);
  const [tempMinPrice, setTempMinPrice] = useState<number>(0);
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(0);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);

  const { minPrice, maxPrice } = useMemo(() => {
    if (!products || products.length === 0) {
      return { minPrice: 0, maxPrice: 1000 };
    }

    const prices = products.map((p) => p.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  useEffect(() => {
    setActiveMinPrice(minPrice);
    setActiveMaxPrice(maxPrice);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const applyFiltersAndSort = (
    productsToProcess: IProduct[],
    priceMin: number,
    priceMax: number,
    sortBy: FilterOptionCode,
    filterActive: boolean,
  ) => {
    let result = [...productsToProcess];

    if (filterActive) {
      result = result.filter(
        (product) => product.price >= priceMin && product.price <= priceMax,
      );
    }

    const sorters: Record<string, (a: IProduct, b: IProduct) => number> = {
      up: (a, b) => a.price - b.price,
      down: (a, b) => b.price - a.price,
      abc: (a, b) => translate(a?.name).localeCompare(translate(b?.name)),
      cba: (a, b) => translate(b?.name).localeCompare(translate(a?.name)),
    };

    if (sortBy !== 'relevance' && sorters[sortBy]) {
      result.sort(sorters[sortBy]);
    }

    return result;
  };

  const handleSort = (opt: FilterType) => {
    setSortCode(opt.code);
    setIsSortOpen(false);

    if (!wasSortTriggert) setWasSortTriggert(true);

    const result = applyFiltersAndSort(
      products,
      activeMinPrice,
      activeMaxPrice,
      opt.code,
      isPriceFilterActive,
    );
    setItems(result);
  };

  const handlePriceFilter = () => {
    setActiveMinPrice(tempMinPrice);
    setActiveMaxPrice(tempMaxPrice);
    setIsPriceFilterActive(true);
    setIsPriceOpen(false);

    const result = applyFiltersAndSort(
      products,
      tempMinPrice,
      tempMaxPrice,
      sortCode,
      true,
    );
    setItems(result);
  };

  const handleResetPrice = () => {
    setActiveMinPrice(minPrice);
    setActiveMaxPrice(maxPrice);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setIsPriceFilterActive(false);
    setIsPriceOpen(false);

    const result = applyFiltersAndSort(
      products,
      minPrice,
      maxPrice,
      sortCode,
      false,
    );
    setItems(result);
  };

  const handleOpenPriceDropdown = () => {
    if (!isPriceOpen) {
      setTempMinPrice(activeMinPrice);
      setTempMaxPrice(activeMaxPrice);
    }
    setIsPriceOpen(!isPriceOpen);
  };

  const filterTypes: FilterType[] = [
    { value: t('common.relevance'), code: 'relevance' },
    { value: t('common.down'), code: 'down' },
    { value: t('common.up'), code: 'up' },
    { value: t('common.abc'), code: 'abc' },
    { value: t('common.cba'), code: 'cba' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div className={style.optionContainer}>
        <span>
          <span
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsPriceOpen(false);
            }}
            className={style.sortIcon}
          >
            <Button
              className={style.sortButton}
              appearance={'button'}
              value={'ghost'}
              icon={'filter_list'}
            >
              {wasSortTriggert
                ? filterTypes.find((type) => type.code === sortCode)?.value
                : t('common.sort')}
            </Button>
          </span>
          {isSortOpen && (
            <div className={style.dropdownMenu}>
              {filterTypes.map((opt) => (
                <span
                  key={opt.code}
                  className={`${style.dropdownItem} ${sortCode === opt.code ? style.activeLanguage : ''}`}
                  onClick={() => handleSort(opt)}
                >
                  {opt.value}
                </span>
              ))}
            </div>
          )}
        </span>

        <span>
          <span
            onClick={() => {
              handleOpenPriceDropdown();
              setIsSortOpen(false);
            }}
            className={style.sortIcon}
          >
            <Button
              className={`${style.sortButton} ${isPriceFilterActive ? style.activeFilter : ''}`}
              appearance={'button'}
              value={'ghost'}
              icon={'attach_money'}
            >
              {isPriceFilterActive
                ? `${formatPrice(activeMinPrice)} - ${formatPrice(activeMaxPrice)}`
                : t('common.priceRange')}
            </Button>
          </span>
          {isPriceOpen && (
            <div className={`${style.dropdownMenu} ${style.priceDropdown}`}>
              <div className={style.priceRangeContainer}>
                <div className={style.sliderContainer}>
                  <div className={style.sliderWrapper}>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={tempMinPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= tempMaxPrice - 1) {
                          setTempMinPrice(val);
                        }
                      }}
                      className={`${style.slider} ${style.sliderMin}`}
                      style={{ zIndex: tempMinPrice > maxPrice - 100 ? 5 : 3 }}
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={tempMaxPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= tempMinPrice + 1) {
                          setTempMaxPrice(val);
                        }
                      }}
                      className={`${style.slider} ${style.sliderMax}`}
                      style={{ zIndex: 4 }}
                    />
                    <div
                      className={style.sliderTrack}
                      style={{
                        left: `${((tempMinPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        width: `${((tempMaxPrice - tempMinPrice) / (maxPrice - minPrice)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className={style.priceDisplay}>
                  <span className={style.priceValue}>
                    {formatPrice(tempMinPrice)}
                  </span>
                  <span className={style.priceValue}>
                    {formatPrice(tempMaxPrice)}
                  </span>
                </div>

                <ButtonContainer className={style.priceActions}>
                  <Button
                    value="ghost"
                    appearance="button"
                    className={style.resetButton}
                    onClick={handleResetPrice}
                    disabled={!isPriceFilterActive}
                  >
                    {t('common.reset')}
                  </Button>
                  <Button
                    value="primary"
                    appearance="button"
                    className={style.applyButton}
                    onClick={handlePriceFilter}
                    disabled={
                      tempMinPrice === activeMinPrice &&
                      tempMaxPrice === activeMaxPrice &&
                      isPriceFilterActive
                    }
                  >
                    {t('common.apply')}
                  </Button>
                </ButtonContainer>
              </div>
            </div>
          )}
        </span>
      </div>
    </>
  );
};

export default FilterContainer;
