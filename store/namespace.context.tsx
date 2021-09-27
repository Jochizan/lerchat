import { INamespaceContext } from '@interfaces/context.interfaces';
import { createContext, useState, FC, useEffect } from 'react';
import { EXPRESS } from '@services/enviroments';

const defaultState = {} as INamespaceContext;

const NamespaceContext = createContext(defaultState);

export const NamespaceProvider: FC = ({ children }) => {
  const [namespaces, setNamespaces] = useState([]);

  const getNamespaces = async (server: string) => {
    try {
      const res = await fetch(`${EXPRESS}/api/namespaces/${server}`);
      const data = await res.json();
      setNamespaces(data.docs);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <NamespaceContext.Provider value={{ namespaces, getNamespaces }}>
      {children}
    </NamespaceContext.Provider>
  );
};

export default NamespaceContext;
