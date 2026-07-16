interface GsiButtonConfiguration {
  type: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'square' | 'circle';
  logo_alignment?: 'left' | 'center';
  width?: number;
  local?: string;
}

interface CredentialResponse {
  credential: string;
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'btn_add_session'
    | 'btn_confirm_add_session';
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
}

interface IdConfiguration {
  client_id: string;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
  ux_mode?: 'popup' | 'redirect';
  redirect_uri?: string;
  nonce?: string;
  login_uri?: string;
  native_login_uri?: string;
  prompt_parent_id?: string;
  state_cookie_domain?: string;
  callback: (response: CredentialResponse) => void;
  native_callback?: (response: CredentialResponse) => void;
}

interface GoogleAccountsId {
  initialize: (config: IdConfiguration) => void;
  prompt: (momentListener?: (notification: PromptMomentNotification) => void) => void;
  renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
  disableAutoSelect: () => void;
  cancel: () => void;
  storeCredential: (credential: CredentialResponse, callback?: () => void) => void;
  revoke: (hint: string, callback?: (response: { successful: boolean }) => void) => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface Window {
  google?: {
    accounts: GoogleAccounts;
  };
}