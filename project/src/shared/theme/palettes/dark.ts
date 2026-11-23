export interface Palette {
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  inputBackground: string;
  inputBorder: string;
  border: string;
  divider: string;
  overlay: string;
  scrim: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  star: string;
  skeleton: string;
  disabled: string;
  disabledText: string;
  tabBar: string;
  statusBar: 'light' | 'dark';
}
 
export const darkPalette: Palette = {
  background: '#0B0B0F',
  surface: '#15151B',
  surfaceElevated: '#1E1E26',
  card: '#1A1A22',
  inputBackground: '#1E1E26',
  inputBorder: '#33333F',
  border: '#2A2A34',
  divider: '#23232C',
  overlay: 'rgba(0,0,0,0.6)',
  scrim: 'rgba(0,0,0,0.75)',
  text: '#FFFFFF',
  textSecondary: '#B8B8C4',
  textMuted: '#80808E',
  textOnPrimary: '#FFFFFF',
  primary: '#E50914',
  primaryPressed: '#B20710',
  primarySoft: 'rgba(229,9,20,0.16)',
  success: '#2ECC71',
  warning: '#F5B041',
  danger: '#FF4D4F',
  info: '#4DA3FF',
  star: '#FFC107',
  skeleton: '#26262F',
  disabled: '#2A2A34',
  disabledText: '#6B6B78',
  tabBar: '#101015',
  statusBar: 'light',
};
