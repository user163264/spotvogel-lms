// This is a temporary fix for the source-map-loader error
// Create empty modules to satisfy the imports that are causing errors
window.SourceMapConsumer = {};
window.SourceNode = {};

// Mock react-dom modules that are causing issues
if (!window.ReactDOM) {
  window.ReactDOM = {}; 
}
