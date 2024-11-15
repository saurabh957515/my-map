import React from 'react';
function logErrorToMyService(error, errorInfo) {
  console.error('ErrorBoundary caught:', error, errorInfo);
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-lg font-semibold">Something went wrong.</div>;
    }

    return this.props.children;
  }
}
