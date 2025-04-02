# OpenAI Debug Panel Test Script

**Date:** April 1, 2025  
**Author:** Alex Ex (AI Exercise Generation Specialist)  

## Purpose

This test script ensures that all aspects of the enhanced OpenAI Debug Panel are functioning properly, with particular focus on the newly implemented request visualization features.

## Prerequisites

1. Local development environment running
2. An OpenAI API key (in .env file or ready to provide temporarily)
3. Access to the AI Matching Exercise demo page

## Test Procedure

### 1. Basic Functionality Test

1. Navigate to `http://localhost:3000/exercises/ai-matching-demo`
2. Verify the debug toggle is visible in the top-right corner
3. Toggle "Show API Debug Info" to ON
4. Enter sample text in the input field (e.g., "Famous paintings from art history")
5. Click "Generate Exercise"

**Expected Result:** Exercise generates and the debug panel appears below it

### 2. Request Tab Verification

1. In the debug panel, click on the "Request" tab
2. Verify that the following sections are present and populated:
   - HTTP Request Details (URL, method, headers)
   - Input (exercise type, input text, timestamp)
   - Prompt Template (the template used for generation)
   - Full Prompt (the complete prompt sent to API)
   - API Parameters (model, temperature, etc.)
   - Complete API Request Payload (the full object)
   - Raw API Request Body (the exact JSON string sent)

**Expected Result:** All sections are present and contain appropriate data

### 3. Complete Request Payload Test

1. Examine the "Complete API Request Payload" section
2. Verify it contains:
   - `model` parameter
   - `messages` array with system and user messages
   - `temperature` and other parameters

**Expected Result:** The complete request object is visible and formatted correctly

### 4. Raw Request Body Test

1. Examine the "Raw API Request Body" section
2. Click the "Copy to Clipboard" button
3. Paste into a text editor

**Expected Result:** A valid JSON string containing the complete request

### 5. HTTP Details Test

1. Examine the "HTTP Request Details" section
2. Verify that:
   - URL shows `https://api.openai.com/v1/chat/completions`
   - Method shows `POST`
   - Headers show `Content-Type` and masked `Authorization`

**Expected Result:** All HTTP details are correctly displayed with API key masked

### 6. Response Correlation Test

1. Compare the request shown in the "Request" tab with the response shown in the "Response" tab
2. Verify that the prompt in the request corresponds logically to the response content

**Expected Result:** The request and response clearly relate to each other

## Additional Tests

### Security Test

1. Verify that the actual API key is not displayed in full anywhere in the debug panel
2. Check that the masked key shows only the first and last 3 characters

**Expected Result:** API key is appropriately masked for security

### Performance Test

1. Generate several exercises in succession
2. Check if the debug panel updates correctly each time

**Expected Result:** Debug panel updates with new information for each request without requiring page refresh

## Issues and Observations

Record any issues discovered during testing here:

1. [Issue description]
2. [Issue description]

## Conclusion

This test script verifies that the OpenAI Debug Panel enhancements provide complete visibility into the API requests being sent, addressing the previous limitation where only responses were visible.
