import React from 'react';
import './css/Modal.css';

const ModalAlerta = ({ isOpen, message, onConfirm }) => {
  
  return (
    isOpen && (
      <div className="modal-container">
        <div className="modal-content">
          <p dangerouslySetInnerHTML={{ __html: message }}></p>
          <div className="modal-buttons">
            <button onClick={onConfirm}>Ok</button>
          </div>
        </div>
      </div>
    )
  );
};

export default ModalAlerta;


