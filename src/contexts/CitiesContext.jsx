import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "cities/loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "cities/current":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/added":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((c) => c.id !== action.payload),
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Action type is not found!");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "cities/loading" });
      fetch(`${BASE_URL}/cities`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("There was an error loading data...");
        })
        .then((data) => dispatch({ type: "cities/loaded", payload: data }))
        .catch((err) => alert(err));
    }
    fetchCities();
  }, []);

  const fetchCity = useCallback(
    async function fetchCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "cities/loading", payload: true });
      fetch(`${BASE_URL}/cities/${id}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("There was an error loading data...");
        })
        .then((data) => dispatch({ type: "cities/current", payload: data }))
        .catch((err) => dispatch({ type: "rejected", payload: err }));
    },
    [currentCity.id]
  );

  async function addCity(newCity) {
    dispatch({ type: "cities/loading" });
    fetch(`${BASE_URL}/cities/`, {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("There was an error adding the city...");
      })
      .then((data) => dispatch({ type: "cities/added", payload: data }))
      .catch((err) => dispatch({ type: "rejected", payload: err }));
  }

  async function deleteCity(id) {
    dispatch({ type: "cities/loading" });
    fetch(`${BASE_URL}/cities/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("There was an error deleting the city...");
      })
      .then(() => dispatch({ type: "cities/deleted", payload: id }))
      .catch((err) => dispatch({ type: "rejected", payload: err }));
  }
  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, fetchCity, addCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("Cities context is used outside the Cities Provider!");
  }
  return context;
}

export { CitiesProvider, useCities };
