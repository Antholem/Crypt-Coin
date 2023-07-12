import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SingleCoin } from '../config/Api';
import { Button } from '@mui/material';

const Coin = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const response = await fetch(SingleCoin(id));
        const data = await response.json();
        setCoin(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching coin details:', error);
      }
    };

    fetchCoinDetails();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!coin) {
    return <div>Failed to fetch coin details.</div>;
  }

  return (
    <div>
      <Button to={`/market`} component={Link}>
        Back
      </Button>
      <h1>{coin.name}</h1>
      <img src={coin.image.large} alt={coin.name} />
      <p>{coin.description?.en}</p>
    </div>
  );
};

export default Coin;
