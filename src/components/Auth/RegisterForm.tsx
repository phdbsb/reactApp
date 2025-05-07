import { useRegisterMutation } from "@/api/endpoints/auth";
import { IReg } from "@/api/endpoints/auth/types";
import { Box, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form"
import styles from './style.module.css';
import { useNavigate } from "react-router";

interface RegisterFormData extends IReg {
    confirmPassword: string;
}

const RegisterForm = () => {
    const { register, handleSubmit, formState: {errors}, watch } = useForm<RegisterFormData>();
    const [registerUser] = useRegisterMutation();
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data);
            navigate("/");
        }
        catch(err) {
            console.log("Error", err);
        }
    }

    const registerFields = [
        { name: "firstName", label: "Name", type: "text", required: "Name is required"},
        { name: "lastName", label: "Last Name", type: "text", required: "Last Name is required"},
        { name: "email", label: "Email", type: "email", required: "Email is required"},
        { name: "password", label: "Password", type: "password", required: "Password is required"},
        { name: "confirmPassword", label: "Confirm password", type: "password", required: "Confirm Password is required", validate: (value: string) => value === watch("password") || "Passwords don't match"},
    ];

    return (
        <div className={styles["formContainer"]}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} className={`${styles["formBox"]} ${styles["registerForm"]}`}>
                {registerFields.map((field) => (
                    <TextField
                        key={field.name}
                        type={field.type}
                        label={field.label}
                        className={styles["inputField"]}
                        {...register(field.name as keyof RegisterFormData, {
                            required: field.required,
                            validate: field.validate,
                        })}
                        error={!!errors[field.name as keyof RegisterFormData]}
                        helperText={errors[field.name as keyof RegisterFormData]?.message}
                    />
                ))}
                <Button variant="contained" type="submit" className={styles["submitButton"]}>Sign up</Button>
            </Box>
        </div>
    );

}

export default RegisterForm;