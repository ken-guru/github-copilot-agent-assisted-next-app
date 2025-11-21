import Image from 'next/image';
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.logoWrapper}>
                <Image
                    src="/icons/app-icon.png"
                    alt="Mr. Timely Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                />
            </div>
            <div className={styles.title}>Mr. Timely</div>
        </div>
    );
}
