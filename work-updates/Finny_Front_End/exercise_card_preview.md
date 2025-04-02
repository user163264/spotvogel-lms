# ExerciseCard Component Visual Preview

Finny Frontend  
March 30, 2025

## Component Overview

The ExerciseCard component provides a consistent way to display exercise information across our LMS platform. Below is a visual representation of the component in various states.

## Basic Card Layout

```
┌────────────────────────────────────────┐
│ ┌────────┐  ┌─────────────┐            │▲
│ │ Type   │  │ Difficulty  │            ││
│ └────────┘  └─────────────┘            ││
│                                        ││
│ Exercise Title                         ││
│                                        ││
│ Exercise description text that may     ││
│ span multiple lines and will be        ││
│ truncated after two lines...           ││
│                                        ││
│ ┌──────┐ ┌──────┐ ┌──────┐            ││
│ │ Tag1 │ │ Tag2 │ │ Tag3 │            ││
│ └──────┘ └──────┘ └──────┘            ││
│                                        ││
│ ─────────────────────────────────────  ││
│                                        ││
│ Author Name • Mar 30, 2025    10 mins  ││
│                                        ││
└────────────────────────────────────────┘▼
```

## Status Indicator Variants

```
┌─┬──────────────────────────────────────┐  ┌─┬──────────────────────────────────────┐  ┌─┬──────────────────────────────────────┐
│█│                                      │  │▒│                                      │  │░│                                      │
├─┘                                      │  ├─┘                                      │  ├─┘                                      │
│  Completed                             │  │  In Progress                           │  │  Not Started                           │
│                                        │  │                                        │  │                                        │
│  (Green corner indicator)              │  │  (Yellow corner indicator)             │  │  (Gray corner indicator)               │
└────────────────────────────────────────┘  └────────────────────────────────────────┘  └────────────────────────────────────────┘
```

## Type Badge Variants

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  matching      │  │ multiple-choice│  │ fill-in-blank  │  │  essay         │  │  coding        │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
   Yellow bg           Pink bg             Indigo bg           Emerald bg          Cyan bg
```

## Difficulty Badge Variants

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  beginner      │  │  intermediate  │  │  advanced      │  │  expert        │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
   Green bg           Blue bg             Purple bg           Red bg
```

## Responsive Behavior

```
Desktop View (lg: 3 columns)
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Card 1     │ │ Card 2     │ │ Card 3     │
└────────────┘ └────────────┘ └────────────┘
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Card 4     │ │ Card 5     │ │ Card 6     │
└────────────┘ └────────────┘ └────────────┘

Tablet View (md: 2 columns)
┌────────────┐ ┌────────────┐
│ Card 1     │ │ Card 2     │
└────────────┘ └────────────┘
┌────────────┐ ┌────────────┐
│ Card 3     │ │ Card 4     │
└────────────┘ └────────────┘
┌────────────┐ ┌────────────┐
│ Card 5     │ │ Card 6     │
└────────────┘ └────────────┘

Mobile View (1 column)
┌────────────┐
│ Card 1     │
└────────────┘
┌────────────┐
│ Card 2     │
└────────────┘
┌────────────┐
│ Card 3     │
└────────────┘
┌────────────┐
│ Card 4     │
└────────────┘
┌────────────┐
│ Card 5     │
└────────────┘
┌────────────┐
│ Card 6     │
└────────────┘
```

## Interactive States

```
Default State
┌────────────────────────────────────────┐
│                                        │
│               (shadow-sm)              │
│                                        │
└────────────────────────────────────────┘

Hover State
┌────────────────────────────────────────┐
│                                        │
│               (shadow-md)              │
│                                        │
└────────────────────────────────────────┘
```

## Sample Implementation

When implemented on a page with real data, the cards would look approximately like this:

```
┌────────────────────────────────────────┐ ┌────────────────────────────────────────┐ ┌────────────────────────────────────────┐
│▲┌────────┐  ┌─────────────┐            │ │ ┌─────────────────┐ ┌──────────────┐   │ │ ┌────────┐  ┌───────────┐              │
│││matching│  │ beginner    │            │ │ │multiple-choice  │ │ intermediate │   │ │ │essay   │  │ advanced  │              │
││└────────┘  └─────────────┘            │ │ └─────────────────┘ └──────────────┘   │ │ └────────┘  └───────────┘              │
││                                        │ │                                        │ │                                        │
││Matching Parts of Speech                │ │Multiple Choice Vocabulary Quiz         │ │Essay Writing: Argumentation            │
││                                        │ │                                        │ │                                        │
││Match the words with their correct      │ │Test your vocabulary knowledge with     │ │Practice your persuasive writing skills  │
││parts of speech in this interactive...  │ │this multiple-choice quiz covering...   │ │by writing an essay on a controversial...│
││                                        │ │                                        │ │                                        │
││┌────────┐ ┌──────────────┐ ┌────────┐ │ │┌──────────┐ ┌────┐ ┌────────┐          │ │┌────────┐ ┌─────┐ ┌─────────────┐     │
│││grammar │ │parts of speech│ │english│ │ ││vocabulary│ │quiz│ │english │          │ ││writing │ │essay│ │argumentation│     │
││└────────┘ └──────────────┘ └────────┘ │ │└──────────┘ └────┘ └────────┘          │ │└────────┘ └─────┘ └─────────────┘     │
││                                        │ │                                        │ │                                        │
││─────────────────────────────────────── │ │─────────────────────────────────────── │ │───────────────────────────────────────│
││                                        │ │                                        │ │                                        │
││Alex Ex • Mar 15, 2025         5 mins  │ │Sarah Server • Mar 18, 2025    10 mins  │ │Finny Frontend • Mar 20, 2025  45 mins  │
││                                        │ │                                        │ │                                        │
│└────────────────────────────────────────┘ └────────────────────────────────────────┘ └────────────────────────────────────────┘
```

This visual representation helps illustrate the component's structure, variants, and responsive behavior using plain text. The actual component will use Tailwind CSS utilities to achieve this design with proper spacing, colors, and typography.
