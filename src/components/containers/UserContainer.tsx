'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import Login from '@/components/section/user/Login';
import Register from '@/components/section/user/Register';
import UserInformationForm from '@/components/section/user/UserInformationForm';
import PasswordChange from '@/components/section/user/PasswordChange';
import { useAuth } from '@/hooks/AuthHook';

interface ProfileContainerProps {
  view: 'login' | 'register' | 'profile' | 'changePw';
}

const UserContainer: FC<ProfileContainerProps> = ({ view }) => {
  const { userInformation } = useAuth();
  if (!userInformation) view = 'login';
  return (
    <Container padding={false} flow={'column'}>
      <UserContent view={view} />
    </Container>
  );
};

const UserContent: React.FC<ProfileContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'changePw':
        return <PasswordChange />;
      case 'profile':
        return <UserInformationForm />;
      default:
        return <></>;
    }
  };
  return <Container justifyContent={'center'}>{getCurrentView()}</Container>;
};

export default UserContainer;
