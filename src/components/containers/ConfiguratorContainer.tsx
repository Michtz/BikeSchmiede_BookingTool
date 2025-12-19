// 'use client';
//
// import React, { FC } from 'react';
// import { Container } from '@/components/system/Container';
// import style from '@/styles/new/ConfiguratorContainer.module.scss';
//
// // types/configurator.types.ts (Empfohlen)
//
// export interface ConfiguratorOption {
//   id: string;
//   name: string;
//   price: number;
//   image?: string; // Optional: Bild für das spezifische Teil
//   description?: string;
// }
//
// export interface ConfiguratorGroup {
//   id: string;
//   title: string;
//   items: ConfiguratorOption[];
// }
//
// export interface ConfiguratorData {
//   basePrice: number;
//   defaultImage: string; // Basisbild des Bikes
//   groups: ConfiguratorGroup[];
// }
// interface ConfiguratorContainerProps {}
//
// const ConfiguratorContainer: FC<ConfiguratorContainerProps> = () => {
//   return (
//     <Container padding={false} flow={'column'}>
//       <SummeryContainer />
//       <ContentContainer />
//     </Container>
//   );
// };
//
// const SummeryContainer = () => {
//   return <span className={style.summeryContainer}></span>;
// };
//
// const ContentContainer = () => {
//   return (
//     <span className={style.contentContainer}>
//       <PictureContainer />
//       <SelectionContainer />
//     </span>
//   );
// };
// const PictureContainer = () => {
//   return <span className={style.pictureContainer}></span>;
// };
// const SelectionContainer = () => {
//   return <span className={style.selectionContainer}></span>;
// };
//
// export default ConfiguratorContainer;

'use client';

import React, { FC, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Container } from '@/components/system/Container';
import style from '@/styles/new/ConfiguratorContainer.module.scss';
import Button from '@/components/system/Button';
import { dummyBikeData } from '@/data/ConfiguratorData';
import { Accordion } from '@/components/system/Accordion';

interface ConfiguratorOption {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface ConfiguratorGroup {
  id: string;
  title: string;
  items: ConfiguratorOption[];
}

export interface ConfiguratorData {
  basePrice: number;
  defaultImage: string;
  groups: ConfiguratorGroup[];
}

interface ConfiguratorContainerProps {}

const ConfiguratorContainer: FC<ConfiguratorContainerProps> = () => {
  const [selections, setSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialSelections: Record<string, string> = {};
    dummyBikeData.groups.forEach((group) => {
      if (group.items.length > 0) {
        initialSelections[group.id] = group.items[0].id;
      }
    });
    setSelections(initialSelections);
  }, [dummyBikeData]);

  const handleSelectionChange = (groupId: string, optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  const handleReset = () => {
    const resetSelections: Record<string, string> = {};
    dummyBikeData.groups.forEach((group) => {
      if (group.items.length > 0) {
        resetSelections[group.id] = group.items[0].id;
      }
    });
    setSelections(resetSelections);
  };

  const selectedOptionsList = useMemo(() => {
    return dummyBikeData?.groups.map((group) => {
      const selectedId = selections[group.id];
      const selectedOption = group.items.find((item) => item.id === selectedId);
      return {
        groupTitle: group.title,
        option: selectedOption,
      };
    });
  }, [dummyBikeData, selections]);

  const totalPrice = useMemo(() => {
    const optionsPrice = selectedOptionsList.reduce((acc, curr) => {
      return acc + (curr.option?.price || 0);
    }, 0);
    return dummyBikeData.basePrice + optionsPrice;
  }, [dummyBikeData.basePrice, selectedOptionsList]);

  return (
    <Container padding={false} flow={'column'}>
      <div className={style.configuratorWrapper}>
        <ContentContainer
          data={dummyBikeData}
          selections={selections}
          onSelectionChange={handleSelectionChange}
          onReset={handleReset}
        />
        <SummaryContainer
          selectedOptions={selectedOptionsList}
          totalPrice={totalPrice}
        />
      </div>
    </Container>
  );
};

// --- Sub Components ---

interface ContentContainerProps {
  data: ConfiguratorData;
  selections: Record<string, string>;
  onSelectionChange: (groupId: string, optionId: string) => void;
  onReset: () => void;
}

const ContentContainer: FC<ContentContainerProps> = ({
  data,
  selections,
  onSelectionChange,
  onReset,
}) => {
  return (
    <div className={style.contentContainer}>
      <PictureContainer image={data.defaultImage} />
      <SelectionContainer
        groups={data.groups}
        selections={selections}
        onChange={onSelectionChange}
        onReset={onReset}
      />
    </div>
  );
};

const PictureContainer: FC<{ image: string }> = ({ image }) => {
  return (
    <div className={style.pictureContainer}>
      <div className={style.imageWrapper}>
        <Image
          src={image}
          alt="Bike Configuration"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>
  );
};

interface SelectionContainerProps {
  groups: ConfiguratorGroup[];
  selections: Record<string, string>;
  onChange: (groupId: string, optionId: string) => void;
  onReset: () => void;
}

const SelectionContainer: FC<SelectionContainerProps> = ({
  groups,
  selections,
  onChange,
  onReset,
}) => {
  return (
    <div className={style.selectionContainer}>
      <div className={style.selectionHeader}>
        <h3>Konfiguration</h3>
        <button
          onClick={onReset}
          className={style.resetButton}
          aria-label="Reset Selection"
        >
          <span>Reset</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      <div className={style.groupsList}>
        {groups.map((group, i) => (
          <Accordion title={group.title} defaultOpen={i === 1}>
            <div key={group.id} className={style.groupItem}>
              <div className={style.optionsGrid}>
                {group.items.map((item) => {
                  const isSelected = selections[group.id] === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`${style.optionCard} ${isSelected ? style.active : ''}`}
                      onClick={() => onChange(group.id, item.id)}
                    >
                      <div className={style.optionInfo}>
                        <span className={style.optionName}>{item.name}</span>
                        <span className={style.optionPrice}>
                          {item.price > 0
                            ? `+ ${item.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`
                            : 'Inklusive'}
                        </span>
                      </div>
                      <div className={style.radioButton}>
                        <div className={style.radioInner} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

interface SummaryContainerProps {
  selectedOptions: {
    groupTitle: string;
    option: ConfiguratorOption | undefined;
  }[];
  totalPrice: number;
}

const SummaryContainer: FC<SummaryContainerProps> = ({
  selectedOptions,
  totalPrice,
}) => {
  return (
    <div className={style.summaryContainer}>
      <div className={style.summaryCard}>
        <h3 className={style.summaryTitle}>Zusammenfassung</h3>

        <div className={style.summaryList}>
          {selectedOptions.map(
            (item, index) =>
              item.option && (
                <div key={index} className={style.summaryItem}>
                  <div className={style.summaryItemInfo}>
                    <span className={style.itemGroup}>{item.groupTitle}:</span>
                    <span className={style.itemName}>{item.option.name}</span>
                  </div>
                  <span className={style.itemPrice}>
                    {item.option.price.toLocaleString('de-DE', {
                      minimumFractionDigits: 2,
                    })}{' '}
                    €
                  </span>
                </div>
              ),
          )}
        </div>

        <div className={style.divider} />

        <div className={style.totalRow}>
          <span>Gesamtpreis</span>
          <span className={style.totalPrice}>
            {totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
          </span>
        </div>

        <div className={style.actionButtons}>
          <Button>In den Warenkorb</Button>
          <Button>Konfiguration Speichern</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguratorContainer;
