import { useCallback, useEffect, useState } from "react";
import { AUTH_KEY } from "@/constants/defaultData";

export function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(localStorage.getItem(AUTH_KEY) === "true");
  }, []);

  const login = useCallback(() => {
    localStorage.setItem(AUTH_KEY, "true");
    setIsAuthed(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
  }, []);

  return { isAuthed, login, logout };
}
