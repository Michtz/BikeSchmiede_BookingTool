import React from 'react';
import style from '@/styles/admin/AdminProductList.module.scss'; // Reuse styles
import { IService } from '@/types/service.types';
import MaterialIcon from '@/components/system/MaterialIcon';
import Button from '@/components/system/Button';

interface ServiceTableProps {
  services: IService[];
  handleSort: (key: keyof IService) => void;
  getSortIcon: (key: keyof IService) => string;
  onEdit: (service: IService) => void;
  onDelete: (service: IService) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  handleSort,
  getSortIcon,
  onEdit,
  onDelete,
}) => {
  return (
    <table className={style.productTable}>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>
            <div className={style.thContent}>
              Name <MaterialIcon icon={getSortIcon('name')} />
            </div>
          </th>
          <th>Kategorie</th>
          <th onClick={() => handleSort('durationTotalMinutes')}>
            <div className={style.thContent}>
              Dauer <MaterialIcon icon={getSortIcon('durationTotalMinutes')} />
            </div>
          </th>
          <th onClick={() => handleSort('price')}>
            <div className={style.thContent}>
              Preis <MaterialIcon icon={getSortIcon('price')} />
            </div>
          </th>
          <th>Status</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service._id}>
            <td className={style.nameColumn}>
              <div style={{ fontWeight: 'bold' }}>{service.name}</div>
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                {service.description}
              </div>
            </td>
            <td>{service.category || '-'}</td>
            <td>
              {service.durationTotalMinutes} min
              {service.durationCustomerMinutes > 0 && (
                <span
                  style={{ fontSize: '0.8em', color: '#888', display: 'block' }}
                >
                  (Kunde: {service.durationCustomerMinutes} min)
                </span>
              )}
            </td>
            <td>CHF {service.price.toFixed(2)}</td>
            <td>
              <span
                className={`${style.stockStatus} ${service.isActive ? style.available : style.out}`}
              >
                {service.isActive ? 'Aktiv' : 'Inaktiv'}
              </span>
            </td>
            <td>
              <div className={style.actions}>
                <Button
                  appearance="icon"
                  variant="ghost"
                  icon="edit"
                  onClick={() => onEdit(service)}
                />
                <Button
                  appearance="icon"
                  variant="ghost"
                  icon="delete"
                  onClick={() => onDelete(service)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
