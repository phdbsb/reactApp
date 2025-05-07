import { useLoginMutation } from "@/api/endpoints/auth";
import { ILogin } from "@/api/endpoints/auth/types";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import styles from './style.module.css';
import { useNavigate } from "react-router";
import { useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FetchError } from "@/models/error";

const LoginForm = () => {
    const { register, handleSubmit, formState: {errors}} = useForm<ILogin>();
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState("");

    const onSubmit = async (data: ILogin) => {
        setLoginError("");
        try {
            const response = await login(data);
            if ("error" in response) {
                const errorData = response.error as FetchError;
                setLoginError(errorData.data);
                return;
            }
            navigate("/");
        }
        catch(err) {
            console.log("Error", err);
        }
    }

    const LoginFields = [
        { name: "email", label: "Email", type: "email", required: "Email is required" },
        { name: "password", label: "Password", type: "password", required: "Password is required" },
    ];

    return (
        <div className={styles["formContainer"]}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} className={`${styles["formBox"]} ${styles["loginForm"]}`}>
                {LoginFields.map((field) => (
                    <TextField
                        key={field.name}
                        type={field.type}
                        label={field.label}
                        className={styles["inputField"]}
                        {...register(field.name as keyof ILogin, {
                            required: field.required,
                        })}
                        error={!!errors[field.name as keyof ILogin]}
                        helperText={errors[field.name as keyof ILogin]?.message}
                    />
                ))}
                {loginError && (
                    <Typography color="error" className={styles["errorText"]}>
                        {loginError}
                    </Typography>
                )}
                <Button variant="contained" type="submit" className={styles["submitButton"]}>Login</Button>
            </Box>
        </div>
    );
}

export default LoginForm;