import React, { useRef, useEffect } from 'react';

export default function EditableBlock({ value, onChange, className, placeholder, ...props }) {
  const elementRef = useRef(null);

  // Sync DOM value with state value ONLY if the user is not currently focusing/editing it
  useEffect(() => {
    if (elementRef.current && document.activeElement !== elementRef.current) {
      elementRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (elementRef.current) {
      onChange(elementRef.current.innerHTML);
    }
  };

  return (
    <div
      ref={elementRef}
      contentEditable
      onInput={handleInput}
      className={`${className} outline-none cursor-text`}
      style={{ minHeight: props.style?.minHeight || '1em' }}
      placeholder={placeholder}
      {...props}
    />
  );
}
