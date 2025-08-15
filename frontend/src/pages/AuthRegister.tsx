import RegisterForm from '@/components/Auth/RegisterForm';
import styles from '@/components/Auth/style.module.css';

const AuthRegister = () => {
    return (
        <div className={styles["pageWrapper"]}>
            <RegisterForm />
        </div>
    )
}

export default AuthRegister;