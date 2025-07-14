declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    slot?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'md-fab': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
          label?: string;
        },
        HTMLElement
      >;

      'md-icon-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          toggle?: boolean;
          selected?: boolean;
        },
        HTMLElement
      >;

      'md-checkbox': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          checked?: boolean;
        },
        HTMLElement
      >;

      'md-circular-progress': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          indeterminate?: boolean;
        },
        HTMLElement
      >;
    }
  }
}


 export {};