import LoginForm from '@/components/Auth/LoginForm';
import styles from '@/components/Auth/style.module.css';

const AuthLogin = () => {
    return (
        <div className={styles["pageWrapper"]}>
            <LoginForm />
        </div>
    )
}

export default AuthLogin;