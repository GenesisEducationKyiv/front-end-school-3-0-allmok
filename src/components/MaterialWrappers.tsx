import React, { useRef, useEffect, useLayoutEffect, forwardRef } from 'react';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

function useCombinedRefs<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  const targetRef = useRef<T>(null);
  useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);
  return targetRef;
}

type EventName<T> = T extends `on${infer E}` ? Lowercase<E> : never;

const Mdc = <T extends { children?: React.ReactNode }, E extends HTMLElement>(
  tag: keyof React.JSX.IntrinsicElements,
  eventMap: Partial<Record<keyof T, EventName<keyof T>>> = {}
) => {
  const Component = forwardRef<E, T>((props, ref) => {
    const { children, ...rest } = props;
    const elementRef = useRef<E>(null);
    const combinedRef = useCombinedRefs(ref, elementRef);

    useLayoutEffect(() => {
      const element = elementRef.current;
      if (!element) return;
      
      Object.entries(props).forEach(([name, value]) => {
        if (!(name in eventMap) && name !== 'children' && name !== 'ref') {
          (element as Record<string, unknown>)[name] = value;
        }
      });
    }, [props]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const listeners: (() => void)[] = [];

      Object.entries(eventMap).forEach(([propName, eventName]) => {
        const handler = (props as Record<string, unknown>)[propName];
        
        if (typeof eventName === 'string' && typeof handler === 'function') {
          element.addEventListener(eventName, handler as EventListenerOrEventListenerObject);
          listeners.push(() => element.removeEventListener(eventName, handler as EventListenerOrEventListenerObject));
        }
      });

      return () => listeners.forEach(remove => remove());
    }, [props]);

    return React.createElement(tag, { ref: combinedRef, ...rest }, children);
  });

  Component.displayName = `Mdc(${tag})`;
  
  return Component;
};

type MdOutlinedSelectProps = Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, 'onChange'> & {
  label?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (event: Event) => void; 
};

type MdOutlinedTextFieldProps = Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, 'onInput'> & {
    label?: string;
    value?: string;
    disabled?: boolean;
    onInput?: (event: Event) => void;
};

type MdMenuItemProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  value?: string;
};

export const MdOutlinedSelect = Mdc<MdOutlinedSelectProps, HTMLElement>('md-outlined-select', { onChange: 'change' });
export const MdMenuItem = Mdc<MdMenuItemProps, HTMLElement>('md-menu-item');
export const MdOutlinedTextField = Mdc<MdOutlinedTextFieldProps, HTMLElement>('md-outlined-text-field', { onInput: 'input' });