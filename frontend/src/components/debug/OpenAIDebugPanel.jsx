/**
 * OpenAIDebugPanel Component
 * 
 * A comprehensive debug panel for OpenAI API interactions
 * that provides detailed visibility into requests and responses
 * 
 * Created by: Alex Ex (AI Exercise Generation Specialist)
 * Date: April 1, 2025
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../config/config'; // Import for FEATURES.DEBUG_MODE access

/**
 * OpenAIDebugPanel - Component for displaying detailed API debugging information
 * for exercise generation with OpenAI
 * 
 * @param {Object} props - Component props
 * @param {Object} props.debugInfo - The debug information object
 * @param {boolean} props.isVisible - Whether the debug panel is visible
 */
const OpenAIDebugPanel = ({ debugInfo, isVisible }) => {
  const [activeTab, setActiveTab] = useState('request');
  const [expanded, setExpanded] = useState(true);

  if (!isVisible || !debugInfo) {
    return null;
  }

  const { request, response, performance, errors = [], processingSteps = [] } = debugInfo;
  
  // Format JSON for display
  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  // Format time in ms
  const formatTime = (timeMs) => {
    return `${timeMs}ms (${(timeMs / 1000).toFixed(2)}s)`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };
  
  return (
    <div className="p-4 mt-6 border rounded-lg bg-gray-50 text-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">OpenAI API Debug Information</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {expanded && (
        <>
          {/* Performance Summary */}
          <div className="mb-4 p-2 bg-blue-50 rounded border border-blue-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="font-semibold">Total Time:</span> {formatTime(performance?.totalTime || 0)}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {errors.length > 0 ? 
                  <span className="text-red-500">Error</span> : 
                  <span className="text-green-500">Success</span>}
              </div>
              <div>
                <span className="font-semibold">Model:</span> {request?.parameters?.model || 'N/A'}
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`py-2 px-4 ${activeTab === 'request' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('request')}
            >
              Request
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'response' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('response')}
            >
              Response
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'timeline' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'errors' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('errors')}
            >
              Errors {errors.length > 0 && `(${errors.length})`}
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="tab-content">
            {/* Request Tab */}
            {activeTab === 'request' && (
              <div>
                <div className="mb-4">
                  <h4 className="font-bold mb-2">HTTP Request Details</h4>
                  <div className="p-2 bg-white border rounded">
                    <p><strong>URL:</strong> {request?.url || 'N/A'}</p>
                    <p><strong>Method:</strong> {request?.method || 'N/A'}</p>
                    <p><strong>Headers:</strong></p>
                    <pre className="p-2 bg-gray-50 text-xs overflow-auto">
                      {formatJSON(request?.headers || {})}
                    </pre>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Input</h4>
                  <div className="p-2 bg-white border rounded">
                    <p><strong>Exercise Type:</strong> {request?.exerciseType || 'N/A'}</p>
                    <p><strong>Input Text:</strong> {request?.input || 'N/A'}</p>
                    <p><strong>Timestamp:</strong> {formatTimestamp(request?.timestamp)}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Prompt Template</h4>
                  <pre className="p-3 bg-white border rounded overflow-auto max-h-40">
                    {request?.prompt || 'No prompt template available'}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Full Prompt (Sent to API)</h4>
                  <pre className="p-3 bg-white border rounded overflow-auto max-h-60">
                    {request?.fullPrompt || 'No full prompt available'}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">API Parameters</h4>
                  <pre className="p-3 bg-white border rounded overflow-auto max-h-40">
                    {formatJSON(request?.parameters || {})}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Complete API Request Payload (Object)</h4>
                  <pre className="p-3 bg-white border rounded overflow-auto max-h-60 bg-gray-50">
                    {formatJSON(request?.completeApiRequest || { note: "No complete API request payload available" })}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Raw API Request Body (JSON String)</h4>
                  <div className="flex justify-end mb-1">
                    <button
                      onClick={() => {
                        if (request?.rawRequestBody) {
                          navigator.clipboard.writeText(request.rawRequestBody)
                            .then(() => alert('Request body copied to clipboard!'))
                            .catch(err => console.error('Failed to copy: ', err));
                        }
                      }}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      disabled={!request?.rawRequestBody}
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  <pre className="p-3 bg-white border rounded overflow-auto max-h-60 bg-gray-50 text-xs">
                    {request?.rawRequestBody || "No raw request body available"}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Response Tab */}
            {activeTab === 'response' && (
              <div>
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Raw API Response</h4>
                  <pre className="p-3 bg-white border rounded overflow-auto max-h-60">
                    {formatJSON(response?.rawResponse || { message: 'No raw response available' })}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Processed Response</h4>
                  <pre className="p-3 bg-white border rounded overflow-auto max-h-60">
                    {formatJSON(response?.processedResponse || { message: 'No processed response available' })}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">Response Information</h4>
                  <div className="p-2 bg-white border rounded">
                    <p><strong>Timestamp:</strong> {formatTimestamp(response?.timestamp)}</p>
                    <p><strong>Content Type:</strong> {response?.rawResponse?.choices?.[0]?.message?.content ? 'JSON' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Performance</h4>
                  <div className="p-2 bg-white border rounded">
                    <p><strong>Start Time:</strong> {formatTimestamp(new Date(performance?.startTime))}</p>
                    <p><strong>End Time:</strong> {formatTimestamp(new Date(performance?.endTime))}</p>
                    <p><strong>Total Time:</strong> {formatTime(performance?.totalTime || 0)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">Processing Steps</h4>
                  <div className="border rounded">
                    {processingSteps.length > 0 ? (
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 text-left">Step</th>
                            <th className="p-2 text-left">Timestamp</th>
                            <th className="p-2 text-left">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processingSteps.map((step, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="p-2 border-t">{step.step}</td>
                              <td className="p-2 border-t">{formatTimestamp(step.timestamp)}</td>
                              <td className="p-2 border-t">{step.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No processing steps recorded</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Errors Tab */}
            {activeTab === 'errors' && (
              <div>
                {errors.length > 0 ? (
                  <div className="border rounded">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">Stage</th>
                          <th className="p-2 text-left">Timestamp</th>
                          <th className="p-2 text-left">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {errors.map((error, index) => (
                          <tr key={index} className="bg-red-50">
                            <td className="p-2 border-t">{error.stage}</td>
                            <td className="p-2 border-t">{formatTimestamp(error.timestamp)}</td>
                            <td className="p-2 border-t text-red-600">{error.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center bg-green-50 border rounded">
                    <p className="text-green-600">No errors detected during processing</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

OpenAIDebugPanel.propTypes = {
  debugInfo: PropTypes.object,
  isVisible: PropTypes.bool
};

export default OpenAIDebugPanel;
