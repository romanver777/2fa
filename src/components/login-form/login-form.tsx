import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import styles from "./login-form.module.css";
import { authApiMocks } from "../../api";
import type { ApiError, LoginData } from "../../types";
import { NumberAuthForm } from "../number-auth-form";
import { PassIcon, UserIcon } from "../ui";
import { Brand } from "../brand";
import { Button } from "../ui";

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [show2FA, setShow2FA] = useState(false);

  const loginMutation = useMutation({
    mutationFn: authApiMocks.login,
    onSuccess: (data) => {
      if (data.requires2FA) {
        setShow2FA(true);
      }
    },
    onError: (error: ApiError) => {
      setLoginError(error.message);
    },
  });

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const isFormValid =
    isValidEmail(formData.email) && isValidPassword(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loginError) setLoginError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      loginMutation.mutate(formData);
    }
  };

  if (show2FA) {
    return <NumberAuthForm onBack={() => setShow2FA(false)} />;
  }

  const emailIsInvalid = formData.email && !isValidEmail(formData.email);
  const passwordIsInvalid =
    formData.password && !isValidPassword(formData.password);

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <div className={styles.titleWrapper}>
          <Brand />
          <h3 className={styles.title}>Sign in to your account to continue</h3>
        </div>
        <div className={styles.groupWrapper}>
          {loginError && (
            <div className={styles.errorMessage}>{loginError}</div>
          )}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <UserIcon classname={styles.inputIcon} />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`
                ${styles.input} 
                ${(emailIsInvalid || loginError) && styles.inputInvalid}
              `}
                placeholder="Email"
                disabled={loginMutation.isPending}
              />
            </div>
            {emailIsInvalid && (
              <span className={styles.fieldError}>Invalid email format</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <PassIcon classname={styles.inputIcon} />
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`
                ${styles.input}
                ${(passwordIsInvalid || loginError) && styles.inputInvalid}
              `}
                placeholder="Password"
                disabled={loginMutation.isPending}
              />
            </div>
            {passwordIsInvalid && (
              <span className={styles.fieldError}>
                Password must be at least 6 characters
              </span>
            )}
          </div>
          <Button
            type="submit"
            disabled={!isFormValid || loginMutation.isPending}
            text={loginMutation.isPending ? "Loading.." : "Log in"}
          />
        </div>
      </form>
    </div>
  );
};
