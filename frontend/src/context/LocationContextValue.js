import { createContext, useContext } from 'react';

export const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);
