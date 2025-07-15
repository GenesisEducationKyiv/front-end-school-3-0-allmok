import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'md-fab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
        size?: 'small' | 'medium' | 'large';
        lowered?: boolean;
        disabled?: boolean;
      };
      'md-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        slot?: string;
      };
      'md-filled-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        disabled?: boolean;
        type?: 'button' | 'submit' | 'reset';
      };
      'md-outlined-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        disabled?: boolean;
        type?: 'button' | 'submit' | 'reset';
      };
      'md-text-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        disabled?: boolean;
        type?: 'button' | 'submit' | 'reset';
      };
      'md-outlined-text-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        type?: string;
      };
      'md-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        checked?: boolean;
        disabled?: boolean;
        indeterminate?: boolean;
      };
      'md-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        open?: boolean;
      };
      'md-circular-progress': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: number;
        max?: number;
        indeterminate?: boolean;
      };
      'md-linear-progress': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: number;
        max?: number;
        indeterminate?: boolean;
      };
      'md-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        disabled?: boolean;
        toggle?: boolean;
        selected?: boolean;
      };
    }
  }
}