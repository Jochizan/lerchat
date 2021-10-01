import { createContext, useState, FC, useEffect } from 'react';
import { IServerContext } from '@interfaces/context.interfaces';
import { IServer } from '@interfaces/store.interfaces';
import { EXPRESS } from '@services/enviroments';

const defaultState = {} as IServerContext;
const ServerContext = createContext(defaultState);

export const ServerProvider: FC = ({ children }) => {
  const [servers, setServers] = useState<IServer[]>([]);
  const [mapServers, setMapServers] = useState({});
  const [idServer, setIdServer] = useState('');

  const handleIdServer = (id: string) => setIdServer(id);

  const getServers = async () => {
    try {
      const res = await fetch(
        `${EXPRESS}/api/servers/@me/615622f2f60fa527ebca8778`
      );
      const data: { msg: string; _servers: IServer[] } = await res.json();

      const mapServers = data._servers.reduce<{ [key: string]: IServer }>(
        (acc, el) => {
          acc[el._id] = el;
          return acc;
        },
        {}
      );

      setServers(data._servers);
      setMapServers(mapServers);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(idServer);

  useEffect(() => {
    getServers();
  }, []);

  return (
    <ServerContext.Provider
      value={{ idServer, servers, mapServers, handleIdServer }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerContext;
