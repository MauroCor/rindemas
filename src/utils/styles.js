export const CARD_STYLES = {
  background: '#1F2937',
  color: '#F3F4F6'
};

export const CARD_CLASSES = {
  base: 'w-60 rounded-xl p-4 shadow-lg text-center',
  current: 'border border-teal-500',
  default: 'border border-gray-700'
};

export const getCardClassName = (isCurrent) => 
  `${CARD_CLASSES.base} ${isCurrent ? CARD_CLASSES.current : CARD_CLASSES.default}`;

export const getCardStyle = () => CARD_STYLES;

export const MODAL_STYLES = {
  background: '#0F172A',
  color: '#F3F4F6',
  border: '1px solid #1F2937'
};

export const MODAL_BORDER_STYLES = {
  borderColor: '#1F2937'
};

export const DROPDOWN_STYLES = {
  background: '#1F2937',
  borderColor: '#374151'
};

export const INPUT_STYLES = {
  background: '#2D3748',
  color: '#F3F4F6',
  border: '1px solid #1F2937'
};

export const LABEL_STYLES = {
  color: '#FFFFFF'
};

export const TEXT_COLORS = {
  primary: '#F3F4F6',
  secondary: '#9CA3AF',
  accent: '#14B8A6',
  muted: '#D1D5DB'
};

export const BACKGROUND_COLORS = {
  primary: '#111827',
  secondary: '#1F2937',
  modal: '#0F172A',
  input: '#2D3748'
};
