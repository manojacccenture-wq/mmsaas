import React, { type ErrorInfo, type ReactNode } from "react";

interface LogService {
  captureException?: (
    error: Error,
    context?: {
      contexts?: {
        react?: {
          componentStack?: string;
        };
      };
    }
  ) => void;
}

interface FallbackProps {
  error: Error | null;
  resetError: () => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  logService?: LogService;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.logError(error, errorInfo);
  }

  logError = (error: Error, errorInfo: ErrorInfo) => {
    const logService = this.props.logService;

    if (logService && typeof logService.captureException === "function") {
      logService.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack ?? undefined,
          },
        },
      });
    }
  };

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleNavigateDashboard = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      const CustomFallback = this.props.fallback;
      const isDev = import.meta.env.DEV;

      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error}
            resetError={this.handleReset}
          />
        );
      }

      const technicalMessage =
        this.state.error?.stack || this.state.error?.message;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center">

            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isDev ? "Application Error (Development)" : "Technical Error"}
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {isDev
                ? "An unhandled error occurred in the application."
                : "Something went wrong. Please try again later or contact support if the issue persists."}
            </p>

            {/* DEV ONLY FULL ERROR */}
            {isDev && (
              <div className="bg-gray-900 text-green-400 text-left rounded-lg p-4 mb-6 overflow-auto max-h-64">
                <pre className="text-xs whitespace-pre-wrap break-words">
                  {technicalMessage}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>

              <button
                onClick={this.handleNavigateDashboard}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Go to Dashboard
              </button>
            </div>

            {!isDev && (
              <p className="mt-6 text-sm text-gray-500">
                Error Reference ID: {Date.now()}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export { ErrorBoundary };