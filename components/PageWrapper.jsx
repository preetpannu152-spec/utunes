import styles from './PageWrapper.module.css';

export default function PageWrapper({ children }) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
