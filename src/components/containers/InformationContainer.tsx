'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import ImprintContainer from '@/components/section/legal/ImprintContainer';
import PrivacyContainer from '@/components/section/legal/PrivacyContainer';
import ReturnsContainer from '@/components/section/legal/ReturnsContainer';
import ShippingContainer from '@/components/section/legal/ShippingContainer';
import TermsContainer from '@/components/section/legal/TermsContainer';
import ContactContainer from '@/components/section/legal/ContactContainer';
import CustomerServiceContainer from '@/components/section/legal/CustomerServiceContainer';
import FAQContainer from '@/components/section/legal/FAQContainer';
import AboutContainer from '@/components/containers/AboutContainer';
interface LegalInformationContainerProps {
  view:
    | 'imprint'
    | 'privacy'
    | 'returns'
    | 'shipping'
    | 'terms'
    | 'contact'
    | 'customerService'
    | 'faq'
    | 'about';
}

const InformationContainer: FC<LegalInformationContainerProps> = ({ view }) => (
  <Container padding={false} flow={'column'}>
    <InformationContent view={view} />
  </Container>
);

const InformationContent: React.FC<LegalInformationContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'imprint':
        return <ImprintContainer />;
      case 'privacy':
        return <PrivacyContainer />;
      case 'returns':
        return <ReturnsContainer />;
      case 'shipping':
        return <ShippingContainer />;
      case 'terms':
        return <TermsContainer />;
      case 'contact':
        return <ContactContainer />;
      case 'customerService':
        return <CustomerServiceContainer />;
      case 'faq':
        return <FAQContainer />;
      case 'about':
        return <AboutContainer />;
      default:
        return <></>;
    }
  };
  return <Container justifyContent={'center'}>{getCurrentView()}</Container>;
};

export default InformationContainer;
