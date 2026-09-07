import React from 'react';
import styles from './PreferencesInputsWrapper.module.css';
import cls from 'classnames';

interface PreferencesInputsWrapperProps {
  children: React.ReactNode;
  className?: string;
  containerId?: string;
}

const PreferencesInputsWrapper: React.FC<PreferencesInputsWrapperProps> = ({ 
  children, 
  className, 
  containerId 
}) => {
  return (
    <div className={cls(styles.inputsWrapper, className)} id={containerId}>
      <div className={styles.inputsContent}>
        {children}
      </div>
    </div>
  );
};

export default PreferencesInputsWrapper;
