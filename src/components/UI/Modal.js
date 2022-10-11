import { useContext } from 'react';
//Icon & Styles
import { FiX } from 'react-icons/fi';
import styles from './Modal.module.scss';
//React Components
import { TodoContext } from '../../store/TodoContextProvider';

////////////////////////////////////////////////////////////////////

const Modal = ({ children }) => {
  const { closeModal, modal, isEditing } = useContext(TodoContext);

  const closeOverlay = (e) => {
    if (e.currentTarget === e.target || e.target.matches(`.${styles.xmark}`)) {
      closeModal();
    }
  };

  return (
    <div className={styles.overlay} onClick={closeOverlay}>
      <div className={styles.modal}>
        <div className={styles.card}>
          <div className={styles.title}>
            <h3>
              {modal === 'detail'
                ? 'Details'
                : isEditing
                ? 'Edit the Todo'
                : 'Create a new Todo'}
            </h3>
            <button className={styles.closeBtn}>
              <FiX className={styles.xmark} onClick={closeModal} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
