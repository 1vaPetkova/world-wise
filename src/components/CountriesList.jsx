import styles from "./CountriesList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countries = [
    ...new Set(
      cities.map((city) => ({
        name: city.country,
        emoji: city.emoji,
      }))
    ),
  ];
  return (
    <ul className={styles.countriesList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.name} />
      ))}
    </ul>
  );
}

export default CountryList;
