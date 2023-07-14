import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SingleCoin, HistoricalChart } from '../config/Api';
import { Box, Button, Card, CardContent, CardMedia, FormControl, FormHelperText, Grid, InputAdornment, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material';
import useStore from '../store';
import { useMediaQuery } from '@mui/material';
import Loading from '../components/Loading';
import { green, red } from '@mui/material/colors';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Coin = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);
  const { currency } = useStore((state) => state);
  const [coinValueBTC, setCoinValueBTC] = useState(null); // Added coinValueBTC state

  const currencySymbol = currency === 'eur' ? '€' : currency === 'jpy' ? '¥' : currency === 'php' ? '₱' : '$';
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

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

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(HistoricalChart(id, 5, currency)); // Fetch historical data for the last 5 days
        const data = await response.json();
        setHistoricalData(data.prices);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    const fetchCoinValueBTC = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=btc`);
        const data = await response.json();
        const coinValueBTC = data[id]?.btc || 'N/A';

        // Append '.0' for whole numbers
        const formattedCoinValueBTC = Number.isInteger(coinValueBTC) ? `${coinValueBTC}.00000000` : coinValueBTC;

        setCoinValueBTC(formattedCoinValueBTC);
      } catch (error) {
        console.error('Error fetching coin value in BTC:', error);
      }
    };

    fetchCoinDetails();
    fetchHistoricalData();
    fetchCoinValueBTC(); // Call fetchCoinValueBTC to fetch the value in BTC
  }, [id, currency]);

  const parseHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Apply custom styling to anchor tags
    const links = doc.querySelectorAll('a');
    links.forEach((link) => {
      link.style.textDecoration = 'none';
      link.style.color = '#ff00ea';
    });

    return doc.body.innerHTML;
  };

  if (isLoading) {
    return <Loading height='80vh' />;
  }

  if (!coin) {
    return <div>Failed to fetch coin details.</div>;
  }

  const formattedPrice = coin?.market_data?.current_price?.[currency]?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) || 'N/A';

  const formattedChange24h = coin?.market_data?.price_change_percentage_24h || 'N/A';
  const formattedChange7d = coin?.market_data?.price_change_percentage_7d || 'N/A';
  const formattedChange30d = coin?.market_data?.price_change_percentage_30d || 'N/A';
  const formattedChange1y = coin?.market_data?.price_change_percentage_1y || 'N/A';

  const formattedMarketCap = coin?.market_data?.market_cap?.[currency]?.toLocaleString() || 'N/A';
  const formattedFullyDilutedValuation = coin?.market_data?.fully_diluted_valuation?.[currency]?.toLocaleString() || 'N/A';
  const formattedTradingVolume = coin?.market_data?.total_volume?.[currency]?.toLocaleString() || 'N/A';
  const formattedCirculatingSupply = coin?.market_data?.circulating_supply?.toLocaleString() || 'N/A';
  const formattedTotalSupply = coin?.market_data?.total_supply?.toLocaleString() || 'N/A';
  const formattedMaxSupply = coin?.market_data?.max_supply?.toLocaleString() || 'N/A';

  // Calculate the coin's change in value
  const previousPrice = historicalData[0]?.[1] || 0; // Assuming historicalData is an array of [timestamp, price] pairs
  const currentPrice = coin?.market_data?.current_price?.[currency] || 0;
  const coinChange = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container direction='row' spacing={5}>
        <Grid item container direction='row' xs={12} >
          <Grid item xs={12} md={8}>
            <Grid container direction='column' spacing={1}>
              <Grid item>
                <Grid container direction='row' alignItems='center' spacing={1}>
                  <Grid item>
                    <CardMedia component='img' image={coin.image.large} alt={coin.name} sx={{ width: '25px', height: '25px', marginRight: { xs: 0, md: 1 } }} />
                  </Grid>
                  <Grid item>
                    <Typography variant='h5'>
                      {coin.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='text.secondary'>
                      {coin.symbol.toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ background: 'linear-gradient(25deg, #2600fc, #ff00ea)', borderRadius: '5px', px: 0.8, py: 0.1, fontSize: '0.6em' }} variant='caption'>
                      Rank #{coin.market_cap_rank}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction='row' alignItems='center' spacing={1}>
                  <Grid item>
                    <Typography variant='body2'>
                      {currencySymbol}{formattedPrice}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body2' sx={{ color: formattedChange24h < 0 ? red[500] : green[400] }}>
                      {formattedChange24h}%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction='row' alignItems='center' spacing={1}>
                  <Grid item>
                    <Typography variant='body2'>
                      {coinValueBTC} BTC
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body2' sx={{ color: coinChange == 0 ? red[500] : green[400] }}>
                      {coinChange}%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{mt: 1}}>
                <Typography variant='h6'>
                  Percentage Change in the Price
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundImage: 'linear-gradient(25deg, #2600fc, #ff00ea)' }}>
                      <TableRow>
                        <TableCell align='center'>
                          {isMobile ? '24h' : '24 hours'}
                        </TableCell>
                        <TableCell align='center'>
                          {isMobile ? '7d' : '7 days'}
                        </TableCell>
                        <TableCell align='center'>
                          {isMobile ? '30d' : '30 days'}
                        </TableCell>
                        <TableCell align='center'>
                          {isMobile ? '1y' : '1 year'}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ backgroundColor: '#0f051d' }}>
                      <TableRow>
                        <TableCell sx={{ color: formattedChange24h < 0 ? red[500] : green[400] }} align='center'>
                          {isMobile ? formattedChange24h.toFixed(1) : formattedChange24h}%
                        </TableCell>
                        <TableCell sx={{ color: formattedChange7d < 0 ? red[500] : green[400] }} align='center'>
                          {isMobile ? formattedChange7d.toFixed(1) : formattedChange7d}%
                        </TableCell>
                        <TableCell sx={{ color: formattedChange30d < 0 ? red[500] : green[400] }} align='center'>
                          {isMobile ? formattedChange30d.toFixed(1) : formattedChange30d}%
                        </TableCell>
                        <TableCell sx={{ color: formattedChange1y < 0 ? red[500] : green[400] }} align='center'>
                          {isMobile ? formattedChange1y.toFixed(1) : formattedChange1y}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item>
                <Card>
                  <CardContent>
                    <TextField
                      label={`${coin.name} Value`}
                      id="outlined-start-adornment"
                      type='number'
                      sx={{ m: 1, width: '25ch' }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{coin.symbol.toUpperCase()}</InputAdornment>,
                      }}
                    />
                    <TextField
                      label={`${currency.toUpperCase()} Value`}
                      id="outlined-start-adornment"
                      type='number'
                      sx={{ m: 1, width: '25ch' }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{currency.toUpperCase()}</InputAdornment>,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            asda
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' to={`/market`} component={Link} sx={{ backgroundImage: 'linear-gradient(25deg, #2600fc, #ff00ea)', textTransform: 'none' }}>
            Button
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coin;
