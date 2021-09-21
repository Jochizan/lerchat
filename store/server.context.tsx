import { IServerContext } from '@interfaces/context.interfaces';
import { createContext, useState, FC, useEffect } from 'react';

const defaultState = {} as IServerContext;

const ServerContext = createContext(defaultState);

export const ServerProvider: FC = ({ children }) => {
  const [servers, setServers] = useState([]);

  const getServers = async () => {
    const res = await fetch(
      'http://localhost:5000/api/servers/614263ff66b38891263bb846'
    );
    const data = await res.json();
    setServers(data._servers);
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
