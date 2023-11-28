import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      setIsLoading(true);
      fetch(`${BASE_URL}/cities`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("There was an error loading data...");
        })
        .then((data) => setCities(data))
        .catch((err) => alert(err))
        .finally(() => setIsLoading(false));
    }
    fetchCities();
  }, []);

  async function fetchCity(id) {
    setIsLoading(true);
    fetch(`${BASE_URL}/cities/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("There was an error loading data...");
      })
      .then((data) => setCurrentCity(data))
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  }

  async function addCity(newCity) {
    setIsLoading(true);
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
        throw new Error("There was an error saving data...");
      })
      .then((data) => setCities((cities) => [...cities, data]))
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, fetchCity, addCity }}
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
