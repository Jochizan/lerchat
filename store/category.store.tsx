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
import { EXPRESS } from '@services/enviroments';
import { useSession } from 'next-auth/react';
import axios from 'axios';
// import { CategoryEvents, UserID } from '@events/events';
import { categoryReducer } from './reducers/category.reducer';
import { SocketContext } from './socket.store';
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
  const { socket } = useContext(SocketContext);
  const { data: session } = useSession();

  const readCategories = async () => {
    const _id = session?.user._id;
    if (!_id || state.categories.length !== 0) return;

    try {
      const res = await axios.get(`${EXPRESS}/api/categories/@me/${_id}`);
      const data: { msg: string; _categories: ICategory[] } = res.data;

      if (data._categories)
        dispatch({ type: CategoryTypes.READ, payload: data._categories });
    } catch (err) {
      console.error(err);
    }
  };

  const createCategory = async (data: ICategory) => {
    const newCategory = { ...session?.user, name: data.name };
    try {
      const { data }: { data: { msg: string; _server: ICategory } } =
        await axios.post(`${EXPRESS}/api/categories`, newCategory);

      socket.emit('category:create', newCategory as ICategory, (res) => {
        console.log(res);
        dispatch({ type: CategoryTypes.CREATE, payload: data._server });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateCategory = async (_id: string, server: ICategory) => {
    try {
      const { data }: { data: { msg: string; _category: ICategory } } =
        await axios.patch(`${EXPRESS}/api/categories/${_id}`, server);

      socket.emit('category:update', data._category, (res) => {
        console.log(res);
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
        console.log(res);
        dispatch({ type: CategoryTypes.DELETE, payload: _id });
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
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
    if (state.categories.length !== 0) return;

    readCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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
