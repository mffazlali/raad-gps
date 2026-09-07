import React from 'react';
import styles from './Toolbar.module.css';
import cls from 'classnames';

interface ToolbarProps {
  id?:string
  children: React.ReactNode;
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ children,id, className }) => {
  return (
    <div id={id} className={cls(styles.toolbar, className)}>
      {children}
    </div>
  );
};

export default Toolbar;
