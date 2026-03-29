import React, { useEffect } from "react";

import AppRouter from "@/app/routes/router";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary/ErrorBoundary";
import Toast from "@/shared/components/Toast/Toast";
import {
  selectToastMessage,
  selectToastType,
  selectToastDuration,
  clearToast,
} from "@/shared/components/Toast/api/toastSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { restoreSessionAsync } from "@/features/auth/authThunk";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const toastMessage = useAppSelector((state) => selectToastMessage(state));
  const toastType = useAppSelector((state) => selectToastType(state));
  const toastDuration = useAppSelector((state) => selectToastDuration(state));

  const handleToastClose = (): void => {
    dispatch(clearToast());
  };

  useEffect(() => {
    dispatch(restoreSessionAsync());
  }, [dispatch]);


  return (
    <>
      <ErrorBoundary>

        <AppRouter />
        <Toast
          message={toastMessage}
          type={toastType}
          duration={toastDuration}
          onClose={handleToastClose}
        />
      </ErrorBoundary>
    </>
  );
};

export default App;