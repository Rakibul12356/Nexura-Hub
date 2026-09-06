import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime crash error boundary:", error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-2xl border bg-card shadow-sm m-4">
          <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              An unexpected error occurred in this section. Our telemetry log has recorded this incident.
            </p>
          </div>
          <Button onClick={this.handleReload} className="gap-2 bg-sky-600 hover:bg-sky-700">
            <RefreshCw className="h-4 w-4" />
            Reload Component
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
