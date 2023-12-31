import React from 'react';
import { Toast } from 'react-bootstrap';

interface CustomToastProps {
  show: boolean;
  onClose: () => void;
  message: string;
  variant: 'success' | 'error';
}

const CustomToast: React.FC<CustomToastProps> = ({ show, onClose, message, variant }) => {
  return (
    <Toast show={show} onClose={onClose} delay={3000} autohide className={variant}>
      <Toast.Header>
        <strong className="me-auto">{variant === 'success' ? 'Success' : 'Error'}</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default CustomToast;