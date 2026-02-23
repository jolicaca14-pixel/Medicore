import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MediCore Error Boundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-red-500">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Algo salió mal</h1>
            <p className="text-slate-600 text-sm mb-6">
              La aplicación encontró un error inesperado. Por favor, intente recargar la página.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                Recargar MediCore
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-6 p-4 bg-red-50 text-red-700 text-[10px] text-left overflow-auto rounded">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
