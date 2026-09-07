import React from 'react';
import styles from './PreferencesActionsWrapper.module.css';
import cls from 'classnames';

interface PreferencesActionsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PreferencesActionsWrapper: React.FC<PreferencesActionsWrapperProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cls(styles.actionsWrapper, className)}>
      {children}
    </div>
  );
};

export default PreferencesActionsWrapper;
