import PageNav from "../components/PageNav";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <PageNav />
      <h1> welcome home!</h1>
      <Link to="/app">Go to the app</Link>
    </div>
  );
}

export default Home;
