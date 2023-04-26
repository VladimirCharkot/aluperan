import { createContext, Dispatch, SetStateAction } from "react";

interface LoginContextInterface{
  loggedIn: boolean,
  setLoggedIn: Dispatch<SetStateAction<boolean>>
}

export const LoginContext = createContext<LoginContextInterface>({
  loggedIn: false,
  setLoggedIn: () => {}
})