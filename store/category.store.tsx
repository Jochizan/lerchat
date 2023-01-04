import {
  createContext,
  FC,
  useEffect,
  Dispatch,
  useReducer,
  useContext
} from 'react';
import {
  ICategory,
  CategoryActions,
  CategoryTypes
} from './types/category.types';
import { EXPRESS, SOCKET } from '@services/enviroments';
import { useSession } from 'next-auth/react';
import axios from 'axios';
// import { CategoryEvents, UserID } from '@events/events';
import { categoryReducer } from './reducers/category.reducer';
import { useRouter } from 'next/router';
import ServerContext from './server.store';
// import { IUser } from './types/user.types';

export type InitialCategoryState = {
  categories: ICategory[];
  mapCategories: { [key: string]: ICategory };
  loading?: boolean;
  error?: boolean;
  msg?: string;
};

export const initialState = {
  categories: [] as ICategory[],
  mapCategories: {} as { [key: string]: ICategory },
  loading: false,
  error: false,
  msg: ''
};

const CategoryContext = createContext<{
  state: InitialCategoryState;
  dispatch: Dispatch<CategoryActions>;
  createCategory: (server: ICategory) => void;
  updateCategory: (_id: string, server: ICategory) => void;
  deleteCategory: (_id: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  createCategory: () => null,
  updateCategory: () => null,
  deleteCategory: () => null
});

export const CategoryProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);
  const { server } = useRouter().query;
  const { socket } = useContext(ServerContext);

  const readCategories = async () => {
    if (!server) return;

    try {
      const res = await axios.get(`${EXPRESS}/api/categories/${server}`);
      const data: { msg: string; _categories: ICategory[] } = res.data;

      if (data._categories)
        dispatch({ type: CategoryTypes.READ, payload: data._categories });
    } catch (err) {
      console.error(err);
    }
  };

  const createCategory = async (category: ICategory) => {
    try {
      const { data }: { data: { msg: string; _category: ICategory } } =
        await axios.post(`${EXPRESS}/api/categories`, category);

      socket.emit('category:create', category as ICategory, (res) => {
        // console.log(res);
        dispatch({ type: CategoryTypes.CREATE, payload: data._category });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateCategory = async (_id: string, category: ICategory) => {
    try {
      const { data }: { data: { msg: string; _category: ICategory } } =
        await axios.patch(`${EXPRESS}/api/categories/${_id}`, category);

      socket.emit('category:update', data._category, (res) => {
        // console.log(res);
        dispatch({ type: CategoryTypes.UPDATE, payload: data._category });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (_id: string) => {
    try {
      const { data }: { data: { msg: string; _id: string } } =
        await axios.delete(`${EXPRESS}/api/categories/${_id}`);

      socket.emit('category:delete', _id, (res) => {
        // console.log(res);
        dispatch({ type: CategoryTypes.DELETE, payload: _id });
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('category:created', (message) => {
      dispatch({ type: CategoryTypes.CREATE, payload: message });
    });

    socket.on('category:updated', (message) => {
      dispatch({ type: CategoryTypes.UPDATE, payload: message });
    });

    socket.on('category:deleted', (_id) => {
      dispatch({ type: CategoryTypes.DELETE, payload: _id });
    });

    return () => {
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    readCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server]);

  return (
    <CategoryContext.Provider
      value={{
        state,
        dispatch,
        createCategory,
        updateCategory,
        deleteCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
