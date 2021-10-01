import { INamespace, IServer } from './store.interfaces';

interface IServerContext {
  servers: IServer[];
  idServer: string;
  mapServers: { [key: string]: IServer };
  handleIdServer: (id: string) => void;
}

interface INamespaceContext {
  namespaces: INamespace[];
  mapNamespaces: { [key: string]: INamespace };
  getNamespaces: (server: string) => void;
}

export type { IServerContext, INamespaceContext };
