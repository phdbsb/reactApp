import { useRegisterMutation } from "@/api/endpoints/auth";
import { IReg } from "@/api/endpoints/auth/types";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import styles from "./style.module.css";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FetchError } from "@/models/error";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface RegisterFormData extends IReg {
  confirmPassword: string;
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const [logError, setlogError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword =
    (field: "password" | "confirmPassword") =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (field === "password") {
        setShowPassword((prev) => !prev);
      } else {
        setShowConfirmPassword((prev) => !prev);
      }
    };

  const onSubmit = async (data: RegisterFormData) => {
    setlogError("");
    try {
      const response = await registerUser(data);
      if ("error" in response) {
        const errorData = response.error as FetchError;
        setlogError(errorData.data);
        toast.error("Registration failed: " + errorData.data);
        return;
      }
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      console.log("Error", err);
    }
  };

  const registerFields = [
    {
      name: "firstName",
      label: "First name",
      type: "text",
      required: "Name is required",
    },
    {
      name: "lastName",
      label: "Last name",
      type: "text",
      required: "Last Name is required",
    },
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
      showIcon: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      type: "password",
      required: "Confirm Password is required",
      validate: (value: string) =>
        value === watch("password") || "Passwords don't match",
      showIcon: true,
    },
  ];

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  return (
    <div className={styles["pageContainer"]}>
      <div className={styles["logRegCard"]}>
        <div className={styles["leftPane"]}>
          <img src="/assets/register2.svg" alt="Register illustration" className={styles["loginImage"]} />
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
              Create an Account
            </Typography>
            {registerFields.map((field) => (
              <TextField
                key={field.name}
                size="small"
                sx={{
                  "& input": { fontSize: "0.875rem" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--disabled)",
                    },
                  },
                }}
                type={
                  field.name === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : field.name === "confirmPassword"
                    ? showConfirmPassword
                      ? "text"
                      : "password"
                    : field.type
                }
                label={field.label}
                className={styles["inputField"]}
                {...register(field.name as keyof RegisterFormData, {
                  required: field.required,
                  validate: field.validate,
                  ...(field.name === "email" && {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  }),
                  ...(field.name === "password" && {
                    minLength: {
                      value: 8,
                      message: "Password must have minimum 8 characters",
                    },
                  }),
                })}
                error={!!errors[field.name as keyof RegisterFormData]}
                helperText={
                  errors[field.name as keyof RegisterFormData]?.message
                }
                slotProps={{
                  input: {
                    endAdornment: field.showIcon && (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleTogglePassword(
                            field.name as "password" | "confirmPassword"
                          )}
                        >
                          {field.name === "password" ? (
                            showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )
                          ) : showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            ))}
            {logError && (
              <Typography color="error" className={styles["errorText"]}>
                {logError}
              </Typography>
            )}
            <Button
              variant="contained"
              type="submit"
              className={styles["submitButton"]}
              sx={{ marginTop: "1.25rem" }}
            >
              Sign up
            </Button>
            <Typography
              className={styles["switchText"]}
              sx={{ fontSize: "0.85rem", marginTop: "3rem" }}
            >
              Already have an account?{" "}
              <span
                className={styles["signLink"]}
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
            </Typography>
          </Box>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterForm;
