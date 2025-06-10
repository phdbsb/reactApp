import { useLoginMutation } from "@/api/endpoints/auth";
import { ILogin } from "@/api/endpoints/auth/types";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import styles from "./style.module.css";
import { useNavigate } from "react-router";
import { useState } from "react";
import { FetchError } from "@/models/error";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const onSubmit = async (data: ILogin) => {
    setLoginError("");
    try {
      const response = await login(data);
      if ("error" in response) {
        const errorData = response.error as FetchError;
        setLoginError(errorData.data);
        toast.error("Login failed: " + errorData.data);
        return;
      }
      toast.success(t("logRegText.login"));
      navigate("/");
    } catch (err) {
      console.log("Error", err);
    }
  };

  const LoginFields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: "Email is required",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: "Password is required",
    },
  ];

  const formVariants = {
    hidden: { opacity: 0, y: -20 }, 
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <div className={styles["pageContainer"]}>
      <div className={styles["logRegCard"]}>
        <div className={styles["leftPane"]}>
          <img src="/assets/login2.svg" alt="Login illustration" className={styles["loginImage"]} />
        </div>
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={styles["rightPane"]}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={styles["formBox"]}
          >
            <Typography variant="h5" className={styles["formTitle"]}>
              {t('logRegForm.welcomeBack')}
            </Typography>
            {LoginFields.map((field) => (
              <TextField
                key={field.name}
                type={
                  field.type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : field.type
                }
                label={t(`logRegForm.${field.label.toLowerCase()}`)}
                sx={{
                  "& input": { fontSize: "0.875rem" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--disabled)",
                    },
                  },
                }}
                size="small"
                className={styles["inputField"]}
                {...register(field.name as keyof ILogin, {
                  required: t(`logRegForm.${field.required.toLowerCase()}`),
                  ...(field.name === "email" && {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('logRegForm.invalidEmail'),
                    },
                  }),
                  ...(field.name === "password" && {
                    minLength: {
                      value: 8,
                      message: t('logRegForm.passwordMinLength'),
                    },
                  }),
                })}
                error={!!errors[field.name as keyof ILogin]}
                helperText={errors[field.name as keyof ILogin]?.message}
                slotProps={{
                  input: {
                    endAdornment: field.type === "password" && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            ))}
            {loginError && (
              <Typography color="error" className={styles["errorText"]}>
                {loginError}
              </Typography>
            )}
            <Button
              variant="contained"
              type="submit"
              className={styles["submitButton"]}
              sx={{ marginTop: "1.25rem" }}
            >
              {t('logRegForm.login')}
            </Button>
            <Typography
              className={styles["switchText"]}
              sx={{ fontSize: "0.85rem", marginTop: "3rem" }}
            >
              {t('logRegForm.noAccount')}{" "}
              <span
                className={styles["signLink"]}
                onClick={() => navigate("/register")}
              >
                {t('logRegForm.signUp')}
              </span>
            </Typography>
          </Box>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
