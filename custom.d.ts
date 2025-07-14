import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    slot?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'md-fab': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
        label?: string;
      };


      'md-icon-button': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      toggle?: boolean; 
      selected?: boolean;
    };

      'md-checkbox': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { checked?: boolean };
      'md-circular-progress': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { indeterminate?: boolean };
    }
  }
}