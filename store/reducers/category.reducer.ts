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
  const { type, payload } = action;
  console.log(state, action);

  if (!payload) {
    return state;
  }
  switch (type) {
    case CategoryTypes.CREATE:
      if (!payload.hasOwnProperty('_id')) return state;

      return {
        ...state,
        categories: [...state.categories, payload],
        mapCategories: { ...state.mapCategories, [payload._id]: payload }
      };

    case CategoryTypes.READ:
      // if (!payload.hasOwnProperty('_id')) return state;
      const mapCategories: { [key: string]: ICategory } = {};
      payload.forEach((el) => {
        mapCategories[el._id] = el;
      });

      return {
        ...state,
        categories: payload,
        mapCategories
      };

    case CategoryTypes.UPDATE:
      // if (!(payload instanceof Object)) return;
      return {
        ...state,
        categories: state.categories.map((el) =>
          el._id === payload._id ? payload : el
        ),
        mapCategories: { ...state.mapCategories, [payload._id]: payload }
      };

    case CategoryTypes.DELETE: {
      if (!(typeof payload === 'string')) return;
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
