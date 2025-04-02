/**
 * Tailwind Components Demo Page
 * 
 * A showcase of the new Tailwind-based UI components with minimalist design.
 * 
 * @author Finny Frontend
 * @date March 30, 2025
 */

import React, { useState } from 'react';
import { 
  Badge, 
  Button, 
  Card, 
  Container, 
  Input 
} from '../../components/ui';

const TailwindComponentsDemo = () => {
  const [inputValue, setInputValue] = useState('');
  
  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Tailwind UI Components</h1>
        <p className="text-neutral-600 max-w-3xl">
          This page showcases our new minimalist UI components built with Tailwind CSS.
          These components follow modern design principles with clean aesthetics and functional simplicity.
        </p>
      </div>
      
      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Buttons</h2>
        <Card>
          <Card.Header>
            <h3 className="text-xl font-medium">Button Variants</h3>
          </Card.Header>
          <Card.Body className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="danger">Danger Button</Button>
          </Card.Body>
          <Card.Footer className="text-sm text-neutral-500">
            Multiple button styles for different contexts and hierarchy
          </Card.Footer>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <Card.Header>
              <h3 className="text-xl font-medium">Button Sizes</h3>
            </Card.Header>
            <Card.Body className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h3 className="text-xl font-medium">Button States</h3>
            </Card.Header>
            <Card.Body className="flex flex-wrap gap-4">
              <Button variant="primary">Normal</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" fullWidth>Full Width</Button>
            </Card.Body>
          </Card>
        </div>
      </section>
      
      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-xl font-medium mb-2">Basic Card</h3>
            <p className="text-neutral-600">
              A simple card with default styling for content display.
            </p>
          </Card>
          
          <Card variant="primary" border>
            <h3 className="text-xl font-medium mb-2">Primary Card</h3>
            <p className="text-neutral-600">
              A card with primary accent and border styling.
            </p>
          </Card>
          
          <Card hover shadow="md">
            <h3 className="text-xl font-medium mb-2">Hover Card</h3>
            <p className="text-neutral-600">
              This card has hover effects and medium shadow.
            </p>
          </Card>
        </div>
        
        <Card className="mt-6">
          <Card.Header>
            <h3 className="text-xl font-medium">Card with Sections</h3>
          </Card.Header>
          <Card.Body>
            <p className="text-neutral-600">
              This card demonstrates using Card.Header, Card.Body, and Card.Footer components
              for structured content. This approach helps maintain consistent spacing and borders.
            </p>
          </Card.Body>
          <Card.Footer className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">Last updated: March 30, 2025</span>
            <Button size="sm" variant="outline">More Info</Button>
          </Card.Footer>
        </Card>
      </section>
      
      {/* Badges Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Badges</h2>
        <Card>
          <Card.Body>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <Badge size="sm" variant="primary">Small</Badge>
              <Badge size="md" variant="primary">Medium</Badge>
              <Badge size="lg" variant="primary">Large</Badge>
            </div>
          </Card.Body>
        </Card>
      </section>
      
      {/* Form Elements Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <h3 className="text-xl font-medium">Input Fields</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <Input
                id="default-input"
                label="Default Input"
                placeholder="Enter some text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <Input
                id="with-helper"
                label="Input with Helper Text"
                placeholder="Enter your email"
                type="email"
                helper="We'll never share your email with anyone else."
              />
              
              <Input
                id="with-error"
                label="Input with Error"
                placeholder="Enter valid data"
                error="This field is required"
              />
              
              <Input
                id="disabled-input"
                label="Disabled Input"
                placeholder="Disabled field"
                value="Disabled value"
                disabled
              />
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h3 className="text-xl font-medium">Form Layout Example</h3>
            </Card.Header>
            <Card.Body>
              <form className="space-y-4">
                <Input
                  id="name"
                  label="Full Name"
                  placeholder="John Doe"
                  required
                />
                
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
                
                <div className="pt-2">
                  <Button type="submit" variant="primary">Submit Form</Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </section>
      
      {/* Component Composition Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Component Composition</h2>
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">Exercise Card Example</h3>
              <Badge variant="success">New</Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col">
              {/* Status indicator - minimalist dot approach */}
              <div className="h-2 w-2 rounded-full bg-green-500 mb-4"></div>
              
              {/* Title with improved spacing and typography */}
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Matching Words Exercise</h3>
              
              {/* Description with proper line height */}
              <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                Match the vocabulary words with their correct definitions in this interactive exercise.
              </p>
              
              {/* Clean metadata display */}
              <div className="mt-auto pt-4 border-t border-neutral-100 flex justify-between text-xs text-neutral-500">
                <span>Vocabulary</span>
                <span>10 min</span>
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <p className="text-sm text-neutral-500">
              This example shows how our minimalist components can be composed to create more complex UI elements.
              The exercise card uses subtle styling with careful spacing and typography.
            </p>
          </Card.Footer>
        </Card>
      </section>
    </Container>
  );
};

export default TailwindComponentsDemo;
