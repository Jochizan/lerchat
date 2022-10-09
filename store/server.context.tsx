import { createContext, useState, FC, useEffect } from 'react';
import { IServerContext } from '@interfaces/context.interfaces';
import { IServer, IUser } from '@interfaces/store.interfaces';
import { EXPRESS } from '@services/enviroments';
import { useSession } from 'next-auth/client';

const defaultState = {} as IServerContext;
const ServerContext = createContext(defaultState);

export const ServerProvider: FC = ({ children }) => {
  const [session] = useSession();
  const [servers, setServers] = useState<IServer[]>([]);
  const [mapServers, setMapServers] = useState({});
  const [idServer, setIdServer] = useState('');

  const handleIdServer = (id: string) => setIdServer(id);

  const getServers = async (_id: string | null | undefined) => {
    if (!_id) return;

    try {
      const res = await fetch(`${EXPRESS}/api/servers/${_id}`);
      const data: { msg: string; _server: IServer } = await res.json();

      // const mapServers = data._servers.reduce<{ [key: string]: IServer }>(
      //   (acc, el) => {
      //     acc[el._id] = el;
      //     return acc;
      //   },
      //   {}
      // );

      console.log(data);
      if (data._server) {
        setServers([data._server]);
        setMapServers({ [data._server._id]: data._server });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(idServer);

  useEffect(() => {
    if (session) getServers(session?.user._id);
  }, [session]);

  return (
    <ServerContext.Provider
      value={{ idServer, servers, mapServers, handleIdServer }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerContext;
