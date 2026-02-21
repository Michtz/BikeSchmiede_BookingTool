import React, { FC, forwardRef, PropsWithChildren, ReactNode } from 'react';
import style from './Containers.module.scss';

interface BrandIntroProps extends PropsWithChildren {}

const OverlayContainer = forwardRef<HTMLDivElement, BrandIntroProps>(
  ({ children }, ref) => {
    return (
      <div className={style.contentBelow} ref={ref}>
        {children}
      </div>
    );
  },
);

OverlayContainer.displayName = 'Overlay....'; // SEO muesi de no ergänze

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
  backgroundColor?: boolean | 'white';
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

export const Title: FC<ContainerProps> = ({ children }) => (
  <h2 className={style.title}>{children}</h2>
);

interface ContentContainerProps {
  title?: string;
  text?: string;
}
export const ContentContainer: FC<ContentContainerProps> = ({
  title,
  text,
}) => (
  <div className={style.contentContainer}>
    <h2>{title}</h2>
    <p>{text}</p>
  </div>
);

export default OverlayContainer;
