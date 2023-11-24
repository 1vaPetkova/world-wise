import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoding] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      setIsLoding(true);
      fetch(`${BASE_URL}/cities`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("There was an error loading data...");
        })
        .then((data) => setCities(data))
        .catch((err) => alert(err))
        .finally(() => setIsLoding(false));
    }
    fetchCities();
  }, []);

  async function fetchCity(id) {
    setIsLoding(true);
    fetch(`${BASE_URL}/cities/${id}`)
      .then((response) => {
        if (response.ok) {
          console.log(response);
          return response.json();
        }
        throw new Error("There was an error loading data...");
      })
      .then((data) => setCurrentCity(data))
      .catch((err) => alert(err))
      .finally(() => setIsLoding(false));
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, fetchCity }}
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
