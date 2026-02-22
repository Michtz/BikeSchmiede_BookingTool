import React, { FC } from 'react';
import { ContentContainer } from '@/components/system/containers/Containers';

interface HomeIntroProps {
  title: string;
  text: string;
}

/**
 * HomeIntro component that displays a title and a descriptive text.
 * It uses the existing ContentContainer styles to maintain design consistency.
 */
const HomeIntro: FC<HomeIntroProps> = ({ title, text }) => {
  return <ContentContainer title={title} text={text} />;
};

export default HomeIntro;
