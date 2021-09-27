import { INamespace, IServer } from './store.interfaces';

interface IServerContext {
  servers: IServer[];
}

interface INamespaceContext {
  namespaces: INamespace[];
  getNamespaces: (server: string) => Promise<void>;
}

export type { IServerContext, INamespaceContext };
