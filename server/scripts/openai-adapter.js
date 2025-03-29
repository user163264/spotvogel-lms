#!/usr/bin/env node

/**
 * OpenAI Adapter Script
 * 
 * This script checks and resolves compatibility issues between your current OpenAI implementation
 * and the diagnostic scripts. It creates appropriate wrapper or adapter code based on your
 * installed OpenAI SDK version.
 */

require('dotenv').config();
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Script paths
const scriptsDir = __dirname;
const serverDir = path.join(scriptsDir, '..');

// Check OpenAI version
function checkOpenAIVersion() {
  console.log(`${colors.blue}Checking OpenAI SDK version...${colors.reset}`);
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(serverDir, 'package.json'), 'utf8'));
    const openaiVersion = packageJson.dependencies.openai;
    
    console.log(`Found OpenAI version: ${openaiVersion}`);
    
    // Parse version number
    const versionNumber = openaiVersion.replace(/[^0-9.]/g, '');
    const majorVersion = parseInt(versionNumber.split('.')[0]);
    
    return {
      version: versionNumber,
      majorVersion
    };
  } catch (error) {
    console.log(`${colors.red}Error checking OpenAI version: ${error.message}${colors.reset}`);
    return null;
  }
}

// Create adapter for OpenAI v4
function createV4Adapter() {
  console.log(`${colors.green}Creating adapter for OpenAI v4...${colors.reset}`);
  
  // No need for an adapter in v4 as the scripts are already compatible
  console.log(`${colors.green}No adapter needed for OpenAI v4.${colors.reset}`);
  
  return true;
}

// Create adapter for OpenAI v3
function createV3Adapter() {
  console.log(`${colors.yellow}Creating adapter for OpenAI v3...${colors.reset}`);
  
  const adapterContent = `
/**
 * OpenAI v3 Compatibility Adapter
 * 
 * This file provides a compatibility layer for the OpenAI API v3
 * to work with the diagnostic and verification scripts.
 */

const { Configuration, OpenAIApi } = require('openai');

/**
 * OpenAI API v3 Adapter
 * Wrapper for the OpenAI API to maintain compatibility
 */
class OpenAI {
  constructor(options) {
    const configuration = new Configuration({
      apiKey: options.apiKey
    });
    this._api = new OpenAIApi(configuration);
    
    // Create API method wrappers
    this.completions = {
      create: this._createCompletion.bind(this)
    };
    
    this.models = {
      list: this._listModels.bind(this)
    };
  }
  
  /**
   * Wrapper for createCompletion
   */
  async _createCompletion(options) {
    const response = await this._api.createCompletion(options);
    // Transform response to match v4 structure
    return {
      choices: response.data.choices,
      id: response.data.id,
      model: response.data.model,
      object: response.data.object,
      usage: response.data.usage
    };
  }
  
  /**
   * Wrapper for listModels
   */
  async _listModels() {
    const response = await this._api.listModels();
    // Transform response to match v4 structure
    return {
      data: response.data.data,
      object: response.data.object
    };
  }
}

module.exports = OpenAI;
`;

  try {
    fs.writeFileSync(path.join(scriptsDir, 'openai-v3-adapter.js'), adapterContent);
    console.log(`${colors.green}Created OpenAI v3 adapter at ${path.join(scriptsDir, 'openai-v3-adapter.js')}${colors.reset}`);
    
    // Update the scripts to use the adapter
    updateScriptsForV3Adapter();
    
    return true;
  } catch (error) {
    console.log(`${colors.red}Error creating OpenAI v3 adapter: ${error.message}${colors.reset}`);
    return false;
  }
}

// Update scripts to use the V3 adapter
function updateScriptsForV3Adapter() {
  console.log(`${colors.yellow}Updating scripts to use v3 adapter...${colors.reset}`);
  
  const scriptPaths = [
    path.join(scriptsDir, 'verify-openai-key.js'),
    path.join(scriptsDir, 'openai-diagnostic.js'),
    path.join(scriptsDir, 'improved-aiService.js')
  ];
  
  scriptPaths.forEach(scriptPath => {
    try {
      let content = fs.readFileSync(scriptPath, 'utf8');
      
      // Replace the require statements
      content = content.replace(
        "const OpenAI = require('openai');",
        "const OpenAI = require('./openai-v3-adapter');"
      );
      
      fs.writeFileSync(scriptPath, content);
      console.log(`${colors.green}Updated ${scriptPath}${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}Error updating ${scriptPath}: ${error.message}${colors.reset}`);
    }
  });
}

// Main function
async function main() {
  console.log(`${colors.cyan}=== OpenAI Adapter Tool ====${colors.reset}`);
  
  // Check OpenAI version
  const versionInfo = checkOpenAIVersion();
  
  if (!versionInfo) {
    console.log(`${colors.red}Unable to determine OpenAI version. Cannot create adapter.${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.blue}Detected OpenAI v${versionInfo.majorVersion}.x${colors.reset}`);
  
  // Create appropriate adapter based on version
  if (versionInfo.majorVersion >= 4) {
    return createV4Adapter();
  } else if (versionInfo.majorVersion === 3) {
    return createV3Adapter();
  } else {
    console.log(`${colors.red}Unsupported OpenAI version: ${versionInfo.version}${colors.reset}`);
    console.log(`Please update to OpenAI SDK v3.x or v4.x`);
    return false;
  }
}

// Run the script
main()
  .then(success => {
    if (success) {
      console.log(`${colors.green}\nOpenAI adapter setup complete!${colors.reset}`);
      console.log(`You can now run the diagnostic scripts.`);
    } else {
      console.log(`${colors.red}\nOpenAI adapter setup failed.${colors.reset}`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.log(`${colors.red}\nAn unexpected error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  });
