import { useState } from 'react';
import './SearchPage.css';

const SearchPage = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e:any) => {
    e.preventDefault();
    console.log(`Searching for flights from ${origin} to ${destination} on ${date}`);
  };

  return (
    <div className="search-container">
      <h1>Search for Flights</h1>
      <form onSubmit={handleSearch}>
        <label>Origin: </label>
        <input 
          type="text" 
          value={origin} 
          onChange={(e:any) => setOrigin(e.target.value)} 
          required 
        />
        <label>Destination: </label>
        <input 
          type="text" 
          value={destination} 
          onChange={(e:any) => setDestination(e.target.value)} 
          required 
        />
        <label>Date: </label>
        <input 
          type="date" 
          value={date} 
          onChange={(e:any) => setDate(e.target.value)} 
          required 
        />
        <button type="submit">Search Flights</button>
      </form>
    </div>
  );
};

export default SearchPage;
