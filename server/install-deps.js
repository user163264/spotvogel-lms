const { execSync } = require('child_process');

console.log('Installing missing dependencies...');

try {
  // Install express-async-handler
  console.log('Installing express-async-handler...');
  execSync('npm install express-async-handler', { stdio: 'inherit' });
  
  console.log('All dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}
