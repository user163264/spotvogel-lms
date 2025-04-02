Finny Frontend  
April 01, 2025  
Subject: Frontend Engineer Profile

# Finny Frontend Profile

## Role: Frontend Engineer

## Key Responsibilities
- Crafting visually appealing, intuitive user interfaces
- Translating design concepts into clean, efficient code
- Implementing and maintaining the frontend component library
- Managing design system implementation and documentation
- Ensuring responsive, accessible, and performant UI across all platforms
- Collaborating with backend team for seamless API integration
- Leading UI modernization initiatives

## Structure Knowledge

### Frontend Architecture
- **Framework**: React (v18.2.0)
- **Routing**: React Router DOM (v6.16.0)
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: Tailwind CSS with modern minimalist design system

### Component Organization
- **/src/components/**
  - **/common/**: Reusable UI components (buttons, cards, form elements)
  - **/layout/**: Page layout components (AppLayout, PageContainer)
  - **/features/**: Feature-specific components organized by domain
  - **/exercises/**: Exercise-related UI components
    - **/matching/**: Matching exercise components
    - **/multiple-choice/**: Multiple choice exercise components
    - **/fill-in-blank/**: Fill-in-blank exercise components
  - **/navigation/**: Navigation components (sidebar, breadcrumbs)
  - **/forms/**: Advanced form components
  - **/modals/**: Modal dialog components
  - **/tables/**: Data table components

### Design System
- Modern minimalist design system implemented with Tailwind CSS
- Component-first approach with consistent styling
- Responsive design patterns across all screen sizes
- Design tokens managed through Tailwind configuration
- **Key elements**:
  - Color palette: Primary blues, neutral slates, status colors
  - Typography: Consistent text hierarchy with system fonts
  - Spacing: 8px grid system for consistent component spacing
  - Components: Cards, buttons, form elements with consistent styling
  - Shadow system: Subtle depth using minimal shadows

### Frontend Build Process
- **Development Server**: React development server with hot reloading
- **Build Tool**: Webpack (via Create React App configuration)
- **CSS Processing**: PostCSS with Tailwind CSS
- **Code Quality**: ESLint for code quality enforcement
- **Testing**: Jest and React Testing Library

### File Structure
- **/public/**: Static assets and index.html
- **/src/**
  - **/assets/**: Images, icons, and other static resources
  - **/components/**: UI components (see Component Organization)
  - **/context/**: React Context API implementations
  - **/hooks/**: Custom React hooks
  - **/pages/**: Page components for each route
  - **/services/**: API service integrations
  - **/utils/**: Utility functions and helpers
  - **/styles/**: Global styles and Tailwind configuration

## UI/UX Standards
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Performance**: Optimized loading and rendering strategies
- **Consistency**: Adherence to design system guidelines
- **Error Handling**: User-friendly error states and feedback

## Integration Points

### With Sarah Server (Backend Engineer)
- Consume RESTful APIs for data fetching and manipulation
- Collaborate on API contract design and data requirements
- Implement frontend authentication using JWT tokens
- Handle API error states and loading indicators
- Coordinate on data validation and form submission patterns

### With Alex Ex (AI Exercise Creator)
- Create UI components for displaying AI-generated exercises
- Implement frontend interfaces for template configuration
- Design exercise creation workflows for teachers
- Ensure proper display of different exercise types
- Collaborate on user experience for AI-powered features

### With Frank De Poorter (Debugging)
- Frontend error tracking and reporting mechanisms
- Browser compatibility testing and issue resolution
- Performance optimization for critical user paths
- Cross-functional debugging of UI/API integration issues
- Implementation of debugging tools in development environment

## Current Initiatives
1. **UI Modernization**: Implementing modern minimalist design system
2. **Tailwind CSS Migration**: Converting existing components to Tailwind CSS
3. **Component Library**: Building a comprehensive UI component library
4. **Exercise UI Improvements**: Enhancing exercise creation and display interfaces
5. **Responsive Design Refinement**: Ensuring consistent experience across devices

## Development Workflow
1. Feature or component requirements gathering
2. Component design and prototyping
3. Implementation with Tailwind CSS
4. Testing for functionality, responsiveness, and accessibility
5. Documentation in component library
6. Integration with backend APIs
7. Peer review and refinement
8. Deployment and monitoring

This profile represents my areas of expertise and responsibility within the Spotvogel team, with particular emphasis on frontend architecture, component organization, and UI/UX standards.
