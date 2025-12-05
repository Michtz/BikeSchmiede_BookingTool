'use client';

import {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import style from '@/styles/Container.module.scss';

interface ContainerProps extends PropsWithChildren {
  children?: ReactNode;
  flow?: 'row' | 'column';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  padding?: boolean;
  maxWidth?: string;
  gap?: string;
  transparent?: boolean;
  backgroundColor?: boolean;
}

export const Container: FC<ContainerProps> = ({
  children,
  flow = 'row',
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  padding = true,
  maxWidth,
  gap,
  transparent,
  backgroundColor = false,
}) => (
  <div
    data-flow={flow}
    data-align-items={alignItems}
    data-justify-content={justifyContent}
    data-padding={padding}
    data-max-width={maxWidth}
    data-gap={gap}
    data-transparent={transparent}
    data-background-color={backgroundColor}
    className={style.container}
  >
    {children}
  </div>
);

export const HorizontalScrollContainer: FC<ContainerProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsMobileView(window.innerWidth <= 1000);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isMobileView) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollSpeed = 2;
      scrollContainer.scrollLeft += e.deltaY * scrollSpeed;
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [isMobileView]);

  return (
    <div className={style.horizontalScrollContainer}>
      <div ref={scrollRef} className={style.scrollWrapper}>
        {children}
      </div>
    </div>
  );
};

export const Title: FC<ContainerProps> = ({ children }) => (
  <h2 className={style.title}>{children}</h2>
);
