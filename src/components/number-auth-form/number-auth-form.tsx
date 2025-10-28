import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import styles from "./number-auth-form.module.css";
import { authApiMocks } from "../../api";
import type { ApiError } from "../../types";
import { Brand } from "../brand";
import { ButtonBack } from "../button-back";
import { Button } from "../ui";

export const NumberAuthForm = ({ onBack }: { onBack?: () => void }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isInvalidCode, setIsInvalidCode] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const verifyMutation = useMutation({
    mutationFn: authApiMocks.verifyNumbers,
    onSuccess: (data) => {
      if (data.success) {
        setLoginSuccess(true);
      }
    },
    onError: (error: ApiError) => {
      setIsInvalidCode(error.message);
      if (error.message === "Code expired") {
        setIsExpired(true);
        setCode(Array(6).fill(""));
      }
    },
  });

  const requestNewCodeMutation = useMutation({
    mutationFn: authApiMocks.requestNewNumbers,
    onSuccess: () => {
      setCode(Array(6).fill(""));
      setIsInvalidCode("");
      setIsExpired(false);
    },
    onError: (error: ApiError) => {
      setIsInvalidCode(error.message);
    },
  });

  const isCodeComplete = code.every((digit) => digit !== "");

  const handleCodeChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!/^\d*$/.test(value)) return;

      if (isInvalidCode) {
        setIsInvalidCode("");
        setIsExpired(false);
      }

      const newCode = [...code];

      if (value.length > 1) {
        const digits = value.split("").slice(0, 6);
        digits.forEach((digit, digitIndex) => {
          if (index + digitIndex < 6) {
            newCode[index + digitIndex] = digit;
          }
        });
      } else {
        newCode[index] = value;
      }

      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        const prevInput = document.getElementById(`code-${index - 1}`);
        prevInput?.focus();
      }
    };

  const handleSubmit = () => {
    verifyMutation.mutate({ code: code.join("") });
  };

  const handleRequestNewCode = () => {
    requestNewCodeMutation.mutate();
  };

  return (
    <div className={styles.authContainer}>
      {loginSuccess ? (
        <h3 className={styles.title}>Login successful!</h3>
      ) : (
        <form className={styles.authForm}>
          <ButtonBack onClick={onBack} classname="numberAuth" />
          <Brand />
          <h3 className={styles.title}>Two-Factor Authentication</h3>
          <p className={styles.twofaDescription}>
            Enter the 6-digit code from the Google Authenticator app
          </p>
          <div
            className={`
          ${styles.codeInputs} 
          ${isInvalidCode && styles.codeInputsInvalid}
        `}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={6}
                value={digit}
                onChange={handleCodeChange(index)}
                onKeyDown={handleKeyDown(index)}
                className={`
                ${styles.codeInput} 
                ${isInvalidCode && !isExpired && styles.codeInputInvalid}
              `}
                disabled={verifyMutation.isPending}
              />
            ))}
          </div>

          {isInvalidCode && !isExpired && (
            <div className={styles.codeError}>{isInvalidCode}</div>
          )}

          {isCodeComplete && (
            <Button
              onClick={handleSubmit}
              disabled={
                verifyMutation.isPending || (!!isInvalidCode && !isExpired)
              }
              text={
                verifyMutation.isPending
                  ? "Loading..."
                  : !verifyMutation.isPending && !isExpired
                  ? "Continue"
                  : ""
              }
            />
          )}
          {!isCodeComplete && isExpired && (
            <Button
              onClick={handleRequestNewCode}
              disabled={
                requestNewCodeMutation.isPending || (!!isInvalidCode && !isExpired)
              }
              text={
                requestNewCodeMutation.isPending
                  ? "Loading..."
                  : !requestNewCodeMutation.isPending && isExpired
                  ? "Get new"
                  : ""
              }
            />
          )}
        </form>
      )}
    </div>
  );
};
