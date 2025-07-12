interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  componentStack?: string;
  extra?: Record<string, any>;
}

interface ErrorReportingConfig {
  apiKey?: string;
  projectId?: string;
  environment: string;
  userId?: string;
  userEmail?: string;
  enableConsoleLogging: boolean;
  enableRemoteLogging: boolean;
}

class ErrorReportingService {
  private config: ErrorReportingConfig;
  private errorQueue: ErrorReport[] = [];
  private isOnline = navigator.onLine;

  constructor(config: ErrorReportingConfig) {
    this.config = config;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(new Error(event.reason), {
        type: 'unhandledrejection',
        promise: event.promise
      });
    });

    // Listen for global errors
    window.addEventListener('error', (event) => {
      this.reportError(new Error(event.message), {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  }

  public reportError(error: Error, extra?: Record<string, any>) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.config.userId || localStorage.getItem('userId') || undefined,
      extra: {
        ...extra,
        userEmail: this.config.userEmail,
        environment: this.config.environment,
        buildVersion: import.meta.env.VITE_APP_VERSION || 'unknown'
      }
    };

    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      console.error('Error Report:', errorReport);
    }

    // Send to remote service if enabled
    if (this.config.enableRemoteLogging) {
      this.sendErrorReport(errorReport);
    }

    // Store in localStorage for analytics
    this.storeErrorLocally(errorReport);
  }

  private async sendErrorReport(errorReport: ErrorReport) {
    if (!this.isOnline) {
      this.errorQueue.push(errorReport);
      return;
    }

    try {
      // Example: Send to your own error reporting endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (error) {
      // If sending fails, add to queue
      this.errorQueue.push(errorReport);
      console.error('Failed to send error report:', error);
    }
  }

  private storeErrorLocally(errorReport: ErrorReport) {
    try {
      const existingErrors = JSON.parse(localStorage.getItem('errorReports') || '[]');
      existingErrors.push(errorReport);
      
      // Keep only last 50 errors
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      
      localStorage.setItem('errorReports', JSON.stringify(existingErrors));
    } catch (error) {
      console.error('Failed to store error locally:', error);
    }
  }

  private async flushErrorQueue() {
    const errors = [...this.errorQueue];
    this.errorQueue = [];
    
    for (const errorReport of errors) {
      await this.sendErrorReport(errorReport);
    }
  }

  public getStoredErrors(): ErrorReport[] {
    try {
      return JSON.parse(localStorage.getItem('errorReports') || '[]');
    } catch (error) {
      console.error('Failed to retrieve stored errors:', error);
      return [];
    }
  }

  public clearStoredErrors() {
    localStorage.removeItem('errorReports');
  }

  public updateConfig(config: Partial<ErrorReportingConfig>) {
    this.config = { ...this.config, ...config };
  }
}

// Create a singleton instance
const errorReporting = new ErrorReportingService({
  environment: import.meta.env.MODE || 'development',
  enableConsoleLogging: import.meta.env.MODE === 'development',
  enableRemoteLogging: import.meta.env.MODE === 'production',
  projectId: import.meta.env.VITE_PROJECT_ID,
  apiKey: import.meta.env.VITE_ERROR_REPORTING_API_KEY,
});

// Export functions for easy use
export const reportError = (error: Error, extra?: Record<string, any>) => {
  errorReporting.reportError(error, extra);
};

export const updateErrorReportingConfig = (config: Partial<ErrorReportingConfig>) => {
  errorReporting.updateConfig(config);
};

export const getStoredErrors = () => {
  return errorReporting.getStoredErrors();
};

export const clearStoredErrors = () => {
  errorReporting.clearStoredErrors();
};

// Set up global error reporting
export const setupGlobalErrorReporting = (userId?: string, userEmail?: string) => {
  errorReporting.updateConfig({ userId, userEmail });
};

export default errorReporting; 