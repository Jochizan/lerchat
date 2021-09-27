import { IServerContext } from '@interfaces/context.interfaces';
import { createContext, useState, FC, useEffect } from 'react';
import { EXPRESS } from '@services/enviroments';

const defaultState = {} as IServerContext;

const ServerContext = createContext(defaultState);

export const ServerProvider: FC = ({ children }) => {
  const [servers, setServers] = useState([]);

  const getServers = async () => {
    try {
      const res = await fetch(`${EXPRESS}/api/servers`);
      const data = await res.json();
      setServers(data._servers);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    getServers();
  }, []);

  return (
    <ServerContext.Provider value={{ servers }}>
      {children}
    </ServerContext.Provider>
  );
};

export default ServerContext;
