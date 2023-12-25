import { useState, createContext } from "react";

export const AppContext = createContext({
  tokenValue: "",
  setTokenValue: (tokenValue: string): void => {},
  setTokenCookie: (cookieName: string, value: any): void => {},
  getTokenCookie: (cookieName: string): string => {
    return "";
  },
  deleteTokenCookie: (cookieName: string): void => {},
});

export default function ContextProvider(props: any) {
  // TODO refactor
  const [tokenValue, setTokenValue] = useState("");

  const setTokenCookie = (
    cookieName: string,
    value: any,
    cookieLifetimeMinutes: number = 1440,
    path: string = "/",
  ): void => {
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() + cookieLifetimeMinutes);
    const expires = dt.toUTCString();
    document.cookie = `${cookieName}=${encodeURIComponent(
      value,
    )}; expires=${expires}; path=${path}`;
  };

  // https://www.w3schools.com/js/js_cookies.asp
  const getTokenCookie = (cookieName: string): string => {
    let name = `${cookieName}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
  };

  // * set negative cookie lifetime to delete cookie
  const deleteTokenCookie = (cookieName: string, path: string = "/"): void =>
    setTokenCookie(cookieName, "", -1, path);

  return (
    <AppContext.Provider
      value={{
        tokenValue,
        setTokenValue,

        setTokenCookie,
        deleteTokenCookie,
        getTokenCookie,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
