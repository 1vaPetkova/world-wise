import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { lat, lng } = useUrlPosition();

  useEffect(
    function () {
      async function fetchCityData() {
        setIsLoadingGeocoding(true);
        fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("There was an error loading data...");
          })
          .then((data) => {
            setCityName(data.city);
          })
          .catch((err) => alert(err))
          .finally(() => setIsLoadingGeocoding(false));
      }
      fetchCityData();
    },
    [lat, lng]
  );

  const navigate = useNavigate();

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
