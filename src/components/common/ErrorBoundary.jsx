import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          background: 'var(--bg-body)'
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#fee2e2', color: '#ef4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <AlertTriangle size={32} />
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            Noma'lum Xatolik Yuz Berdi
          </h2>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: '1.25rem' }}>
            Kechirasiz, kutilmagan tizim xatosi aniqlandi. Ilovani qayta yuklash uchun quyidagi tugmani bosing.
          </p>

          {this.state.error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              maxWidth: '500px',
              marginBottom: '1.5rem',
              wordBreak: 'break-word',
              fontFamily: 'monospace'
            }}>
              {this.state.error.toString()}
            </div>
          )}

          <button
            onClick={this.handleReload}
            style={{
              background: 'var(--primary-blue)',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.75rem',
              borderRadius: '50px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RefreshCw size={18} />
            <span>Sahifani Yangilash</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
