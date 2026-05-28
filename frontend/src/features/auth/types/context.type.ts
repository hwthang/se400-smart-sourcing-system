export interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
}