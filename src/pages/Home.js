import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingCoins } from '../config/Api';
import useStore from '../store';
import { Button, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Box, CardMedia, Grid, Stack, Typography } from '@mui/material';
import { green, grey, red } from '@mui/material/colors';

const Home = () => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const { currency } = useStore((state) => state);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const currencySymbol = currency === 'eur' ? '€' : currency === 'jpy' ? '¥' : currency === 'php' ? '₱' : '$';

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get(TrendingCoins('usd')); // Replace 'usd' with your desired currency
        setTrendingCoins(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrendingCoins();
  }, []);

  const handleSlideChange = (event) => {
    console.log('Current slide:', event.item);
  };

  const renderTrendingCoins = () => {
    return trendingCoins.map((coin) => (
      <Box sx={{ textAlign: 'center', cursor: 'pointer', textDecoration: 'none' }} key={coin.id} component={Link} to={`/market/${coin.id}`}>
        <Stack direction='column' alignItems='center' justifyContent='center' spacing={1}>
          <CardMedia component='img' image={coin.image} sx={{ width: '70px', height: '70px' }} />
          <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
            <Typography sx={{ color: grey[50] }} variant='body2'>
              {coin.symbol.toUpperCase()}
            </Typography>
            <Typography sx={{ color: coin.price_change_percentage_24h < 0 ? red[500] : green[400] }} variant='body2'>
              {isMobile ? coin.price_change_percentage_24h.toFixed(1) : coin.price_change_percentage_24h}%
            </Typography>
          </Stack>
          <Typography sx={{ color: grey[50] }} variant='body2'>
            {currencySymbol}{coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        </Stack>
      </Box>
    ));
  };

  const carouselOptions = {
    items: isMobile ? 2 : 4,
    autoPlay: true,
    autoPlayInterval: 2000,
    infinite: true,
    responsive: {
      0: { items: 2 },
      600: { items: 3 },
      960: { items: 4 },
      1280: { items: 5 },
    },
  };

  return (
    <Grid container sx={{ height: '80vh', py: 5 }} direction='column' alignItems='center' justifyContent='space-between' spacing={1}>
      <Grid item>
        <Typography sx={{ textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold' }} variant={isMobile ? 'h3' : 'h2'}>
          Track and Trade
        </Typography>
        <Typography sx={{ textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold', background: '-webkit-linear-gradient(25deg, #2600fc, #ff00ea)', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }} variant={isMobile ? 'h3' : 'h2'}>
          Crypto Currencies
        </Typography>
      </Grid>
      <Grid item>
        <Box sx={{ maxWidth: '100%', width: '70vw', my: 2 }}>
          <AliceCarousel
            items={renderTrendingCoins()}
            responsive={carouselOptions.responsive}
            autoPlay={carouselOptions.autoPlay}
            autoPlayInterval={carouselOptions.autoPlayInterval}
            infinite={carouselOptions.infinite}
            dotsDisabled={!isMobile}
            onSlideChanged={handleSlideChange}
            mouseTracking
            animationDuration={1500}
            disableDotsControls
            disableButtonsControls
          />
        </Box>
      </Grid>
      <Grid item>
        <Button variant='contained' to={`/market`} component={Link} sx={{ backgroundImage: 'linear-gradient(25deg, #2600fc, #ff00ea)', textTransform: 'none' }}>
          Explore Market
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
