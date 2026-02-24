'use client';

import React, { FC, useState, useRef, useEffect, ReactNode } from 'react';
import style from '@/components/system/accordion/Accordion.module.scss';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion: FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [height, setHeight] = useState<string>('0px');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultOpen) {
      setHeight(`${contentRef.current?.scrollHeight}px`);
    }
  }, [defaultOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    setHeight(isOpen ? '0px' : `${contentRef.current?.scrollHeight}px`);
  };

  return (
    <div
      className={`${style.accordion} ${isOpen ? style.open : ''} ${className}`}
    >
      <button
        className={style.accordionHeader}
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span className={style.title}>{title}</span>
        <span className={style.icon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      <div
        className={style.accordionContentWrapper}
        style={{ maxHeight: isOpen ? height : '0px' }}
        ref={contentRef}
      >
        <div className={style.accordionContent}>{children}</div>
      </div>
    </div>
  );
};
