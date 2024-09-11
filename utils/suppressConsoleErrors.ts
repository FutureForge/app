;(function suppressConsoleErrors() {
  const originalConsoleError = console.error
  console.error = function (...args) {
    // Uncomment the next line if you want to log suppressed errors during development
    // originalConsoleError.apply(console, ['Suppressed error:', ...args]);
  }
})()
