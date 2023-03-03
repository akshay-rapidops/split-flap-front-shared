// export * from '../utils/env/development';

export const emailValidation = /^$|^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const AuthPath = [
  '/login',
  '/reset-password',
  '/password-reset-success',
  '/password-email-reset-success',
  '/signup',
  '/forgot-password',
  '/reset-password-link-expired',
];

export const TextAlign = {
  LEFT: 'L',
  RIGHT: 'R',
  CENTER: 'C',
  AUTO:'A',
};

export const BoardMode = {
  TEXT: 'text',
  COLOR: 'color',
  RESET: 'reset',
  Emoji: 'emoji',
  ZoomIn:'zoomin',
  ZoomOut:'zoomout',
  ZoomReset:'zoomreset',
  Widget:'widget',
};

export const CSRFTOKEN_KEY = 'csrftoken';
export const SESSIONID_KEY = 'sessionid';
export const FillColorKeyIdPrefix = 'fillColor';
export const InputColumnIdPrefix = 'flipInput-column';
export const TRANSPARENT = 'transparent';
export const ERASE_EMOJI = 'eraseEmoji';
export const InputColorColumnPrefix = 'flipColor-column';
export const EmojiKeyIdPreFix = 'fillEmoji';
export const DEFAULT_VALUE = '--';
export const BoardItem = 'boardItem';
export const IsOverRideDialogDontAsk = 'isOverRideDialogDontAsk';
export const IsInstaMessageDialogAskAgain = 'isInstaMessageDialogAskAgain';
export const IsShoeGetStartedWDialog =  'isShoeGetStartedWDialog';

export const AnimationStyle = {
  LEFT_TO_RIGHT: 'L-to-R',
  RIGHT_TO_LEFT: 'R-to-L',

};

export const LocalStorageKeys = [
  CSRFTOKEN_KEY,
  SESSIONID_KEY,
  BoardItem,
  IsOverRideDialogDontAsk,
  IsInstaMessageDialogAskAgain,
];

export const PasswordRegex =   /^(?=.{8,})(?=.*[a-zA-Z])(?=.*[@#$%^_&+=])(?=.*[0-9]).*$/;

export const BoardGridSize = {
  WIDTH:33,
  HEIGHT: 58,
};

export const  eventColors = [
  '#EF9A9A',
  // '#EF9A9A',
  '#9575CD',
  '#7986CB',
  '#00BCD4',
  '#42A5F5',
  '#4CAF50',
  '#4DB6AC',
  '#8BC34A',
  '#AFB42B',
  '#FF8A65',
  '#FFB300',
  '#A1887F',
  '#90A4AE'];
