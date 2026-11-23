import type { AccessibilityProps, AccessibilityState } from 'react-native';
 
interface ButtonA11yOptions {
  hint?: string;
  disabled?: boolean;
  busy?: boolean;
  selected?: boolean;
  checked?: boolean;
}
 
export function buttonA11y(label: string, options: ButtonA11yOptions = {}): AccessibilityProps {
  const state: AccessibilityState = {
    disabled: options.disabled,
    busy: options.busy,
    selected: options.selected,
    checked: options.checked,
  };
  return {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityHint: options.hint,
    accessibilityState: state,
  };
}
 
export function headerA11y(label?: string): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'header',
    accessibilityLabel: label,
  };
}
 
export function imageA11y(label: string): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  };
}
 
export function checkboxA11y(label: string, checked: boolean, disabled = false): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'checkbox',
    accessibilityLabel: label,
    accessibilityState: { checked, disabled },
  };
}
 
export function switchA11y(label: string, value: boolean, disabled = false): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'switch',
    accessibilityLabel: label,
    accessibilityState: { checked: value, disabled },
  };
}
 
export function tabA11y(label: string, selected: boolean): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'tab',
    accessibilityLabel: label,
    accessibilityState: { selected },
  };
}
 
export function progressA11y(label: string, value: number): AccessibilityProps {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return {
    accessible: true,
    accessibilityRole: 'progressbar',
    accessibilityLabel: label,
    accessibilityValue: { min: 0, max: 100, now: percent, text: `${percent}%` },
  };
}
 
export function alertA11y(label: string): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'alert',
    accessibilityLabel: label,
    accessibilityLiveRegion: 'assertive',
  };
}
