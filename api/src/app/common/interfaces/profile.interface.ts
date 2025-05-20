export interface MenuItemProfile {
    label: string;
    href?: string;
    onClick?: () => void;
  }
  
  export interface ProfileResponse {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
    address: string;
    avatar: string;
  }