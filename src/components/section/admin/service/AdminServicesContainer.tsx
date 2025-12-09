'use client';

import React, { useState } from 'react';
import { Container } from '@/components/system/Container';
import AdminServiceList from './AdminServiceList';
import ServiceForm from './ServiceForm';
import { IService } from '@/types/service.types';

const AdminServicesContainer = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingService, setEditingService] = useState<IService | undefined>(
    undefined,
  );

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingService(undefined);
  };

  const handleEditClick = (service: IService) => {
    setEditingService(service);
    setIsCreating(true);
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setEditingService(undefined);
  };

  return (
    <Container padding={false} justifyContent={'center'} maxWidth="100%">
      {isCreating ? (
        <ServiceForm onClose={handleCloseForm} service={editingService} />
      ) : (
        <AdminServiceList
          onCreateService={handleCreateClick}
          onEditService={handleEditClick}
        />
      )}
    </Container>
  );
};

export default AdminServicesContainer;
