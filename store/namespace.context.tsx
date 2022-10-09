import { INamespaceContext } from '@interfaces/context.interfaces';
import { INamespace } from '@interfaces/store.interfaces';
import { createContext, useState, FC } from 'react';
import { EXPRESS } from '@services/enviroments';

const defaultState = {} as INamespaceContext;

const NamespaceContext = createContext(defaultState);

export const NamespaceProvider: FC = ({ children }) => {
  const [namespaces, setNamespaces] = useState<INamespace[]>([]);
  const [mapNamespaces, setMapNamespaces] = useState({});

  const getNamespaces = async (server: string) => {
    if (!server) return;
    try {
      const res = await fetch(`${EXPRESS}/api/namespaces/@server/${server}`);
      const data: { msg: string; docs: INamespace[] } = await res.json();

      const mapNamespaces = data.docs.reduce<{ [key: string]: INamespace }>(
        (acc, el) => {
          acc[el._id] = el;
          return acc;
        },
        {}
      );

      setNamespaces(data.docs);
      setMapNamespaces(mapNamespaces);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <NamespaceContext.Provider
      value={{
        namespaces,
        mapNamespaces,
        getNamespaces
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
};

export default NamespaceContext;
