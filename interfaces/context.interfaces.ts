import { INamespace, IServer } from './store.interfaces';

interface IServerContext {
  servers: IServer[];
  idServer: string | null;
  mapServers: { [key: string]: IServer };
  handleIdServer: (id: string) => void;
  getServers: (id: string | null | undefined) => void;
}

interface INamespaceContext {
  namespaces: INamespace[];
  mapNamespaces: { [key: string]: INamespace };
  getNamespaces: (server: string | null, click: boolean) => void;
}

export type { IServerContext, INamespaceContext };
