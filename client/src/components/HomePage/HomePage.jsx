import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {

  return (
    <div className="homepage-container">
      <header className="hero-section">
        <h1 className="hero-title">Welcome to Turistoe Airlines</h1>
        <p className="hero-subtitle">Seamless bookings, world-class travel experience</p>
      </header>

      <div className="button-group">
        <Link to="/search">
          <button className="primary-button">Search Flights</button>
        </Link>
        <Link to="/purchase">
          <button className="primary-button">Purchase Tickets</button>
        </Link>
        <Link to="/admin">
          <button className="primary-button">Admin Dashboard</button>
        </Link>
      </div>

      <div >
        <Link to="/helloworld">
          <button>Hello World</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
