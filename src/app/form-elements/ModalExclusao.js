import React from 'react';
import './css/Modal.css';

const ModalExclusao = ({ isOpen, message, onCancel, onConfirm }) => {
  
  return (
    isOpen && (
      <div className="modal-container">
        <div className="modal-content">
          <p dangerouslySetInnerHTML={{ __html: message }}></p>
          <div className="modal-buttons">
            <button onClick={onCancel}>Cancelar</button>
            <button onClick={onConfirm}>Confirmar</button>
          </div>
        </div>
      </div>
    )
  );
};

export default ModalExclusao;


