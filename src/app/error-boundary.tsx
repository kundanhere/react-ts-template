import { Component, ReactNode } from "react";

export interface IErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

export interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: unknown) {
    // You can log error info here or send to a monitoring service
    // console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      if (typeof fallback === "function") {
        return fallback(error, this.resetError);
      }
      if (fallback) {
        return fallback;
      }
      // Default fallback UI
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-red-600">
            Something went wrong
          </h2>
          <p className="mb-4 text-gray-700">{error.message}</p>
          <button
            type="button"
            onClick={this.resetError}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}
