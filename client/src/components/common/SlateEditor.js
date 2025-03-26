import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Transforms, Editor } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';

// Define the initial editor content
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

// Custom button component for the toolbar
const ToolbarButton = ({ format, icon, active, onToggle }) => {
  return (
    <button
      className={`toolbar-button ${active ? 'active' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle(format);
      }}
    >
      {icon}
    </button>
  );
};

// Toolbar component with formatting options
const Toolbar = () => {
  const editor = useSlate();

  // Check if a format is active in the current selection
  const isFormatActive = (format) => {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === format,
      mode: 'highest',
    });
    return !!match;
  };

  // Check if a mark is active in the current selection
  const isMarkActive = (format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  // Toggle a block format
  const toggleBlock = (format) => {
    const isActive = isFormatActive(format);
    
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : format },
      { match: n => Editor.isBlock(editor, n) }
    );
  };

  // Toggle a mark format
  const toggleMark = (format) => {
    const isActive = isMarkActive(format);
    
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  return (
    <div className="editor-toolbar">
      <ToolbarButton 
        format="bold" 
        icon="B" 
        active={isMarkActive('bold')} 
        onToggle={toggleMark} 
      />
      <ToolbarButton 
        format="italic" 
        icon="I" 
        active={isMarkActive('italic')} 
        onToggle={toggleMark} 
      />
      <ToolbarButton 
        format="underline" 
        icon="U" 
        active={isMarkActive('underline')} 
        onToggle={toggleMark} 
      />
      <span className="toolbar-divider"></span>
      <ToolbarButton 
        format="heading-one" 
        icon="H1" 
        active={isFormatActive('heading-one')} 
        onToggle={toggleBlock} 
      />
      <ToolbarButton 
        format="heading-two" 
        icon="H2" 
        active={isFormatActive('heading-two')} 
        onToggle={toggleBlock} 
      />
      <ToolbarButton 
        format="block-quote" 
        icon="❝" 
        active={isFormatActive('block-quote')} 
        onToggle={toggleBlock} 
      />
      <ToolbarButton 
        format="numbered-list" 
        icon="1." 
        active={isFormatActive('numbered-list')} 
        onToggle={toggleBlock} 
      />
      <ToolbarButton 
        format="bulleted-list" 
        icon="•" 
        active={isFormatActive('bulleted-list')} 
        onToggle={toggleBlock} 
      />
    </div>
  );
};

// Custom element rendering
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

// Custom leaf rendering for text formatting
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  
  return <span {...attributes}>{children}</span>;
};

// Main SlateEditor component
const SlateEditor = ({ value, onChange, label, error, required = false }) => {
  // Initialize the Slate editor object
  const editor = useMemo(() => withReact(createEditor()), []);
  
  // Convert the string value to Slate value and vice versa
  const [editorValue, setEditorValue] = useState(() => {
    try {
      return value && value.trim() !== '' 
        ? JSON.parse(value) 
        : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Handle editor changes
  const handleChange = useCallback(
    newValue => {
      setEditorValue(newValue);
      // Convert the Slate value to a string for the form
      onChange({
        target: {
          name: 'prompt',
          value: JSON.stringify(newValue)
        }
      });
    },
    [onChange]
  );

  // Return the JSX for the editor
  return (
    <div className={`slate-editor-container ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div className={`slate-editor ${error ? 'is-invalid' : ''}`}>
        <Slate editor={editor} value={editorValue} onChange={handleChange}>
          <Toolbar />
          <div className="editor-content">
            <Editable
              renderElement={props => <Element {...props} />}
              renderLeaf={props => <Leaf {...props} />}
              placeholder="Enter text here..."
              spellCheck
            />
          </div>
        </Slate>
      </div>
      
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SlateEditor;
