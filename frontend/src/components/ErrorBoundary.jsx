import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Top decorative glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
            
            {/* Graphical warning icon */}
            <div className="mx-auto h-16 w-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center rounded-2xl shadow-lg shadow-rose-900/10 animate-bounce">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">Portal Crash Shield</h1>
              <p className="text-sm text-slate-400">
                The security containment layer intercepted a runtime script exception to prevent session corruption.
              </p>
            </div>

            {/* Error detail container */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-left">
              <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block mb-1">
                Crash Signature
              </span>
              <p className="text-xs text-rose-400 font-mono break-all line-clamp-3">
                {this.state.error?.toString() || 'Unknown Javascript Exception'}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-md transition-all text-xs cursor-pointer"
              >
                <RefreshCw size={14} className="animate-spin-slow" />
                Reload Portal Page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-xs text-slate-500 hover:text-slate-350 underline transition-colors cursor-pointer"
              >
                Attempt Recovery Live
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
