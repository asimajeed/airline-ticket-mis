import React, { useState, createContext, useContext } from "react";
import { airportType } from "@/utils/types";

// Define the UserInfoType interface
export interface globalContextType {
  first_name: string | null;
  last_name: string | null;
  start_date: Date | null;
  end_date: Date | null;
  departure_airport: airportType | null;
  arrival_airport: airportType | null;
  airport_list: string[] | null;
  adminAccess: boolean;
}

interface UserContextType {
  user: globalContextType;
  setUserInfo: React.Dispatch<React.SetStateAction<globalContextType>>;
}

const defaultUser: globalContextType = {
  first_name: null,
  last_name: null,
  start_date: null,
  end_date: null,
  departure_airport: null,
  arrival_airport: null,
  airport_list: null,
  adminAccess: false,
};

const GlobalContext = createContext<UserContextType>({
  user: defaultUser,
  setUserInfo: () => {},
});

const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<globalContextType>(defaultUser);

  return (
    <GlobalContext.Provider value={{ user, setUserInfo: setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = (): UserContextType => {
  return useContext(GlobalContext);
};

export { GlobalContextProvider, useGlobalContext };