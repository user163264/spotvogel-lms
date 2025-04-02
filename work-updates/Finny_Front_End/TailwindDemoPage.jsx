import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Import our example components
// Note: In a real implementation, these would be imported from your component library
// This is a standalone example for demonstration purposes

/**
 * Button component implementation with Tailwind
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button', 
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  // Base classes for all buttons
  const baseClasses = 'rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Disabled class
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${widthClass} 
    ${disabledClass}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

/**
 * Card component implementation with Tailwind
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  className = '',
}) => {
  // Base classes for all cards
  const baseClasses = 'rounded-lg overflow-hidden shadow';
  
  // Variant specific classes
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    primary: 'bg-blue-50 border border-blue-200',
    secondary: 'bg-green-50 border border-green-200',
    accent: 'bg-purple-50 border border-purple-200',
  };
  
  // Header classes based on variant
  const headerClasses = {
    default: 'px-6 py-4 border-b border-gray-200',
    primary: 'px-6 py-4 bg-blue-100 border-b border-blue-200 text-blue-800',
    secondary: 'px-6 py-4 bg-green-100 border-b border-green-200 text-green-800',
    accent: 'px-6 py-4 bg-purple-100 border-b border-purple-200 text-purple-800',
  };
  
  // Footer classes
  const footerClass = 'px-6 py-4 bg-gray-50 border-t border-gray-200';
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {(title || subtitle) && (
        <div className={headerClasses[variant]}>
          {title && <h3 className="text-xl font-semibold">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className="px-6 py-4">
        {children}
      </div>
      
      {footer && (
        <div className={footerClass}>
          {footer}
        </div>
      )}
    </div>
  );
};

// Form elements with Tailwind
const Input = ({ label, id, type = 'text', placeholder, required = false, className = '' }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
    </div>
  );
};

const TextArea = ({ label, id, placeholder, rows = 4, required = false, className = '' }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
    </div>
  );
};

// Badge component with Tailwind
const Badge = ({ children, color = 'gray', className = '' }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Main Demo Page Component
 */
const TailwindDemoPage = () => {
  const [activeTab, setActiveTab] = useState('components');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-900">LMS Tailwind Demo</h1>
            </div>
            <div>
              <Button variant="primary" size="sm">Sign In</Button>
              <Button variant="outline" size="sm" className="ml-2">Register</Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button 
              onClick={() => setActiveTab('components')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'components' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              UI Components
            </button>
            <button 
              onClick={() => setActiveTab('forms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'forms' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Forms
            </button>
            <button 
              onClick={() => setActiveTab('layouts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'layouts' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Layouts
            </button>
          </nav>
        </div>
        
        {/* Components Tab */}
        {activeTab === 'components' && (
          <div className="space-y-10">
            {/* Buttons Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Buttons</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="space-y-4">
                  <div className="space-x-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                  <div className="space-x-4">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                  </div>
                  <div>
                    <Button variant="primary" fullWidth>Full Width Button</Button>
                  </div>
                  <div className="space-x-4">
                    <Button variant="primary" disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Cards Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card 
                  title="Default Card" 
                  subtitle="Basic card example"
                  footer={<Button variant="outline" size="sm">Learn More</Button>}
                >
                  <p className="text-gray-600">This is a standard card with header, content and footer.</p>
                </Card>
                
                <Card 
                  title="Primary Card" 
                  variant="primary"
                  footer={<div className="flex justify-between"><span className="text-sm text-gray-500">Updated: Today</span><Button variant="primary" size="sm">Action</Button></div>}
                >
                  <p className="text-gray-600">Cards can have different color variants to indicate importance.</p>
                </Card>
                
                <Card 
                  title="Secondary Card" 
                  variant="secondary"
                >
                  <p className="text-gray-600">Simple card with just header and content.</p>
                  <div className="mt-4 flex space-x-2">
                    <Badge color="green">Complete</Badge>
                    <Badge color="blue">Important</Badge>
                  </div>
                </Card>
                
                <Card variant="default">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-bold">JS</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Card without header</h3>
                      <p className="text-sm text-gray-500">You can also skip the header and footer</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
            
            {/* Badges Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Badges</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-wrap gap-3">
                  <Badge color="gray">Default</Badge>
                  <Badge color="red">Error</Badge>
                  <Badge color="green">Success</Badge>
                  <Badge color="blue">Info</Badge>
                  <Badge color="yellow">Warning</Badge>
                  <Badge color="purple">New</Badge>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {/* Forms Tab */}
        {activeTab === 'forms' && (
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Elements</h2>
              <Card title="Registration Form" className="max-w-2xl">
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" id="firstName" placeholder="John" required />
                    <Input label="Last Name" id="lastName" placeholder="Doe" required />
                  </div>
                  <Input label="Email Address" id="email" type="email" placeholder="john@example.com" required />
                  <Input label="Password" id="password" type="password" required />
                  <TextArea label="Bio" id="bio" placeholder="Tell us about yourself" />
                  
                  <div className="mt-6">
                    <div className="flex items-start mb-4">
                      <div className="flex items-center h-5">
                        <input id="terms" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">I agree to the terms and conditions</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-end gap-x-4">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="primary" type="submit">Register</Button>
                  </div>
                </form>
              </Card>
            </section>
          </div>
        )}
        
        {/* Layouts Tab */}
        {activeTab === 'layouts' && (
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Layout</h2>
              <div className="bg-white shadow rounded-lg">
                {/* Dashboard Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Course Dashboard</h3>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">Export</Button>
                      <Button variant="primary" size="sm">New Course</Button>
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-500">Total Students</div>
                      <div className="mt-1 text-3xl font-semibold">1,284</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-500">Active Courses</div>
                      <div className="mt-1 text-3xl font-semibold">24</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-sm font-medium text-purple-500">Completion Rate</div>
                      <div className="mt-1 text-3xl font-semibold">87%</div>
                    </div>
                  </div>
                  
                  {/* Recent Activity Table */}
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-3">Recent Activity</h4>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">JD</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                                  <div className="text-sm text-gray-500">john@example.com</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Web Development Basics</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Completed Exercise 5</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              2 hours ago
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge color="green">Completed</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                  <span className="text-purple-600 font-medium">AS</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">Alice Smith</div>
                                  <div className="text-sm text-gray-500">alice@example.com</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">React Fundamentals</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Started Module 3</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              5 hours ago
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge color="blue">In Progress</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">&copy; 2025 LMS System. All rights reserved.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex justify-center md:justify-end space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Help Center</span>
                  <span className="text-sm">Help</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Documentation</span>
                  <span className="text-sm">Docs</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Privacy</span>
                  <span className="text-sm">Privacy</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Terms</span>
                  <span className="text-sm">Terms</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Add PropTypes
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent']),
  className: PropTypes.string,
};

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

TextArea.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  className: PropTypes.string,
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['gray', 'red', 'green', 'blue', 'yellow', 'purple']),
  className: PropTypes.string,
};

export default TailwindDemoPage;
