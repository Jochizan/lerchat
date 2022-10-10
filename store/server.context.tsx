import { createContext, useState, FC, useEffect } from 'react';
import { IServerContext } from '@interfaces/context.interfaces';
import { IServer } from '@interfaces/store.interfaces';
import { EXPRESS } from '@services/enviroments';
import { useSession } from 'next-auth/client';

const defaultState = {} as IServerContext;
const ServerContext = createContext(defaultState);

export const ServerProvider: FC = ({ children }) => {
  const [session] = useSession();
  const [servers, setServers] = useState<IServer[]>([]);
  const [mapServers, setMapServers] = useState({});
  const [idServer, setIdServer] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('idServer') : ''
  );

  const handleIdServer = (id: string) => {
    localStorage.setItem('idServer', id);
    setIdServer(id);
  };

  const getServers = async (_id: string | null | undefined) => {
    if (!_id) return;

    try {
      const res = await fetch(`${EXPRESS}/api/servers/@me/${_id}`);
      const data: { msg: string; _servers: IServer[] } = await res.json();

      const mapServers = data._servers.reduce<{ [key: string]: IServer }>(
        (acc, el) => {
          acc[el._id] = el;
          return acc;
        },
        {}
      );

      // console.log(data);
      if (data._servers) {
        setMapServers(mapServers);
        setServers(data._servers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (session) getServers(session.user._id);
  }, [session]);

  return (
    <ServerContext.Provider
      value={{ idServer, servers, mapServers, handleIdServer, getServers }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerContext;
