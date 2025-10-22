// In a real Node.js environment, this would use a library like 'winston' or 'pino'
// to write to a file, console, or a logging service like Datadog or Sentry.
// For this simulation, we'll just log to the browser console and provide an example log file.

const log = (level: 'INFO' | 'WARN' | 'ERROR', message: string, context: object = {}) => {
  const timestamp = new Date().toISOString();
  // Styling console output for better readability during development
  const style = {
      INFO: 'color: blue',
      WARN: 'color: orange',
      ERROR: 'color: red; font-weight: bold;',
  };

  console.log(
    `%c${timestamp} [${level}]%c - ${message}`,
    style[level],
    'color: black',
    context
  );
  // In a real backend, you'd append a structured log message (e.g., as JSON)
  // to a file or send it to a logging service.
};

export const logger = {
  info: (message: string, context?: object) => log('INFO', message, context),
  warn: (message: string, context?: object) => log('WARN', message, context),
  error: (message: string, context?: object) => log('ERROR', message, context),
};
