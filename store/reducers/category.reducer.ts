import {
  ICategory,
  CategoryTypes,
  CategoryActions
} from '../types/category.types';

export const categoryReducer = (
  state: {
    categories: ICategory[];
    mapCategories: { [key: string]: ICategory };
  },
  action: CategoryActions
) => {
  const { type, payload }: { type: any; payload: any } = action;

  switch (type) {
    case CategoryTypes.CREATE:
      return {
        ...state,
        categories: [...state.categories, payload],
        mapCategories: { ...state.mapCategories, [payload._id]: payload }
      };

    case CategoryTypes.READ:
      const mapCategories: { [key: string]: ICategory } = {};
      payload.forEach((el: any) => {
        mapCategories[el._id] = el;
      });

      return {
        ...state,
        categories: payload,
        mapCategories
      };

    case CategoryTypes.UPDATE:
      return {
        ...state,
        categories: state.categories.map((el) =>
          el._id === payload._id ? payload : el
        ),
        mapCategories: { ...state.mapCategories, [payload._id]: payload }
      };

    case CategoryTypes.DELETE: {
      const newMapCategories = state.mapCategories;
      delete newMapCategories[payload as string];

      return {
        ...state,
        categories: state.categories.filter((el) => el._id !== payload),
        mapCategories: newMapCategories
      };
    }

    case CategoryTypes.LOADING:
      return {
        ...state,
        ...payload
      };

    case CategoryTypes.ERROR:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
};
