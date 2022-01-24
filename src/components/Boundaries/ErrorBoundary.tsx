import { Component, ErrorInfo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
}

type State = {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { children } = this.props

    if (this.state.hasError) {
      return <h1>エラーの発生は想定されていません！</h1>;
    } else {
      return children;
    }
 
  }
}

export default ErrorBoundary
