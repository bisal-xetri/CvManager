import { useAppSelector } from "@/store";

export const useAuth = (): {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
} => {
  const { user, loading, error } = useAppSelector((state) => state.auth);

  return {
    loading,
    error,
    isAuthenticated: !!user,
  };
};
