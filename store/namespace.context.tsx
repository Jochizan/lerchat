import { INamespaceContext } from '@interfaces/context.interfaces';
import { INamespace } from '@interfaces/store.interfaces';
import { createContext, useState, FC } from 'react';
import { EXPRESS } from '@services/enviroments';
import { useRouter } from 'next/router';

const defaultState = {} as INamespaceContext;

const NamespaceContext = createContext(defaultState);

export const NamespaceProvider: FC = ({ children }) => {
  const { push } = useRouter();
  const [namespaces, setNamespaces] = useState<INamespace[]>([]);
  const [mapNamespaces, setMapNamespaces] = useState({});

  const getNamespaces = async (server: string | null, click: boolean) => {
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

      if (data.docs && mapNamespaces) {
        setNamespaces(data.docs);
        setMapNamespaces(mapNamespaces);
        if (click) push(`/namespaces/${data.docs[0]._id}`);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // console.log(namespaces, mapNamespaces);

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
