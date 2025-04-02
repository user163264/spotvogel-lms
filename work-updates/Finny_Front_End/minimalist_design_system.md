# Modern Minimalist Design System

Finny Frontend  
March 30, 2025

## Design Principles

Our modern minimalist design system follows these core principles:

1. **Simplicity**: Reduce visual noise and focus on essential elements
2. **Whitespace**: Use generous spacing to create visual hierarchy and improve readability
3. **Typography**: Clear type hierarchy with limited variations
4. **Color Restraint**: Limited color palette with intentional use of color
5. **Visual Consistency**: Unified components and patterns throughout the application

## Color System

### Primary Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#3B82F6` | Primary actions, key UI elements, links |
| Primary Dark | `#2563eb` | Hover states, active states |
| Primary Light | `#6b8afc` | Backgrounds, subtle indicators |
| Secondary | `#10B981` | Secondary actions, success states |
| Secondary Dark | `#059669` | Secondary hover/active states |
| Secondary Light | `#34d399` | Secondary backgrounds |

### Neutrals

| Color | Hex | Usage |
|-------|-----|-------|
| Neutral 50 | `#f9fafb` | Page backgrounds |
| Neutral 100 | `#f3f4f6` | Card backgrounds, subtle backgrounds |
| Neutral 200 | `#e5e7eb` | Borders, dividers |
| Neutral 300 | `#d1d5db` | Disabled backgrounds |
| Neutral 400 | `#9ca3af` | Disabled text, placeholders |
| Neutral 500 | `#6b7280` | Secondary text |
| Neutral 600 | `#4b5563` | Body text |
| Neutral 700 | `#374151` | Subtle headings |
| Neutral 800 | `#1f2937` | Headings |
| Neutral 900 | `#111827` | Heavy text, icons |

### Feedback Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Success | `#22c55e` | Success messages, completion |
| Warning | `#f59e0b` | Warnings, alerts |
| Error | `#ef4444` | Error states, destructive actions |
| Info | `#3b82f6` | Information messages |

## Typography

We use a simple type scale with clear hierarchy:

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| h1 | 1.875rem (30px) | 700 | 1.2 | Page titles |
| h2 | 1.5rem (24px) | 600 | 1.25 | Section headings |
| h3 | 1.25rem (20px) | 500 | 1.3 | Subsections, card titles |
| h4 | 1.125rem (18px) | 500 | 1.4 | Minor headings |
| Body | 1rem (16px) | 400 | 1.5 | Main content |
| Small | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| XSmall | 0.75rem (12px) | 400 | 1.5 | Metadata, captions |

## Spacing

We follow Tailwind's default spacing scale for consistency:

| Token | Size | Usage |
|-------|------|-------|
| 0 | 0px | No spacing |
| 1 | 0.25rem (4px) | Tiny gap, icon padding |
| 2 | 0.5rem (8px) | Small spacing, tight components |
| 3 | 0.75rem (12px) | Compact elements |
| 4 | 1rem (16px) | Standard spacing |
| 6 | 1.5rem (24px) | Medium spacing |
| 8 | 2rem (32px) | Section spacing |
| 12 | 3rem (48px) | Large section breaks |
| 16 | 4rem (64px) | Page section spacing |

## Shadows

Limited shadow variations for depth:

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle elevation |
| shadow | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)` | Default elevation |
| shadow-md | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Medium elevation |
| shadow-lg | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Major elevation |

## Border Radius

Consistent rounding for UI elements:

| Token | Value | Usage |
|-------|-------|-------|
| rounded-sm | 0.25rem (4px) | Minor rounding |
| rounded | 0.375rem (6px) | Default rounding |
| rounded-md | 0.5rem (8px) | Medium rounding |
| rounded-lg | 0.75rem (12px) | Large rounding |
| rounded-xl | 1rem (16px) | Extra large rounding |
| rounded-full | 9999px | Circular elements, badges |

## Core Components

### Button

The Button component is used for actions and navigation:

```jsx
<Button 
  variant="primary" // primary, secondary, outline, ghost, link, danger
  size="md"        // sm, md, lg
  disabled={false}
  fullWidth={false}
>
  Button Text
</Button>
```

### Card

Cards are used to group related content:

```jsx
<Card 
  variant="default"  // default, primary, secondary
  hover={true}
  shadow="sm"       // none, sm, default, md, lg
>
  <Card.Header>Card Header</Card.Header>
  <Card.Body>Card Content</Card.Body>
  <Card.Footer>Card Footer</Card.Footer>
</Card>
```

### Badge

Badges are used for status indicators and labels:

```jsx
<Badge 
  variant="primary" // default, primary, secondary, success, warning, error, info
  size="md"        // sm, md, lg
>
  Status Text
</Badge>
```

### Input

Input fields for forms and data entry:

```jsx
<Input
  id="input-id"
  label="Input Label"
  placeholder="Placeholder text"
  error="Error message"
  helper="Helper text"
  required={true}
/>
```

### Container

Containers for consistent layout:

```jsx
<Container
  maxWidth="default" // sm, md, lg, xl, default, full
  padding={true}
  centered={true}
>
  Content
</Container>
```

## Design Tokens in Tailwind

Our design tokens are implemented in Tailwind config:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6b8afc',
          DEFAULT: '#3B82F6',
          dark: '#2563eb',
        },
        // Other colors...
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Other tokens...
    }
  }
}
```

## Usage Guidelines

### Whitespace

- Use consistent spacing between elements
- Create clear separation between sections
- Allow content to breathe with generous margins
- Use padding consistently within components

### Color Usage

- Use primary colors sparingly for emphasis
- Stick to neutrals for most UI elements
- Use feedback colors only for their intended purpose
- Maintain sufficient contrast for accessibility

### Typography

- Follow the type scale consistently
- Use proper heading levels for document structure
- Limit font styles and weights
- Maintain proper line length and line height

## Implementation Examples

### Modern Card Example

```jsx
<div className="bg-white rounded-lg shadow-sm p-6">
  <h3 className="text-lg font-medium text-neutral-900 mb-2">Card Title</h3>
  <p className="text-neutral-600 text-sm">Card content with clean typography and spacing.</p>
  <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between">
    <span className="text-sm text-neutral-500">Metadata</span>
    <button className="text-primary text-sm font-medium">Action</button>
  </div>
</div>
```

### Form Example

```jsx
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-1">
      Label
    </label>
    <input 
      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary" 
      type="text"
    />
  </div>
  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
    Submit
  </button>
</form>
```

## Conclusion

This modern minimalist design system provides a comprehensive foundation for our UI development with Tailwind CSS. By following these guidelines, we can create a cohesive, clean, and user-friendly interface that emphasizes content and functionality while maintaining visual consistency throughout the application.
