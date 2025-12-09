'use client';

import React, { useState } from 'react';
import { Container } from '@/components/system/Container';
import AdminScheduleList from './AdminScheduleList';
import ScheduleForm from './ScheduleForm';
import { ISchedule } from '@/types/schedule.types';

const AdminScheduleContainer = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ISchedule | undefined>(
    undefined,
  );

  const handleCreateClick = () => {
    setEditingSchedule(undefined);
    setIsCreating(true);
  };

  const handleEditClick = (schedule: ISchedule) => {
    setEditingSchedule(schedule);
    setIsCreating(true);
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setEditingSchedule(undefined);
  };

  return (
    <Container padding={false} justifyContent={'center'} maxWidth="100%">
      {isCreating ? (
        <ScheduleForm onClose={handleCloseForm} schedule={editingSchedule} />
      ) : (
        <AdminScheduleList
          onCreateSchedule={handleCreateClick}
          onEditSchedule={handleEditClick}
        />
      )}
    </Container>
  );
};

export default AdminScheduleContainer;
