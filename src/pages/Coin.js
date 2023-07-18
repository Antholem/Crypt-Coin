import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import useStore from '../store';
import Loading from '../components/Loading';
import ProgressBar from '../components/ProgressBar';
import { SingleCoin, HistoricalChart } from '../config/Api';

const Coin = () => {
  const { id } = useParams();
  const { currency } = useStore((state) => state);
  const [coin, setCoin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);
  const [coinValueBTC, setCoinValueBTC] = useState(null);
  const [currencyValue, setCurrencyValue] = useState('');
  const [computedPrice, setComputedPrice] = useState(0);
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

  if (isLoading) {
    return <Loading height='80vh' />;
  }

  if (!coin) {
    return <div>Failed to fetch coin details.</div>;
  }

  const formattedPrice =
    coin?.market_data?.current_price?.[currency]?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || 'N/A';

  const formatNumberWithSuffix = (number) => {
    if (number >= 1000000000000) {
      return (number / 1000000000000).toLocaleString(undefined, {
        minimumFractionDigits: isMobile ? 1 : 2,
        maximumFractionDigits: isMobile ? 1 : 2,
      }) + 'T';
    } else if (number >= 1000000000) {
      return (number / 1000000000).toLocaleString(undefined, {
        minimumFractionDigits: isMobile ? 1 : 2,
        maximumFractionDigits: isMobile ? 1 : 2,
      }) + 'B';
    } else if (number >= 1000000) {
      return (number / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: isMobile ? 1 : 2,
        maximumFractionDigits: isMobile ? 1 : 2,
      }) + 'M';
    } else if (number >= 100) {
      return (number / 1000).toLocaleString(undefined, {
        minimumFractionDigits: isMobile ? 1 : 2,
        maximumFractionDigits: isMobile ? 1 : 2,
      }) + 'K';
    }
    return number.toLocaleString();
  };

  const formattedChange24h = coin?.market_data?.price_change_percentage_24h || 'N/A';
  const formattedChange7d = coin?.market_data?.price_change_percentage_7d || 'N/A';
  const formattedChange30d = coin?.market_data?.price_change_percentage_30d || 'N/A';
  const formattedChange1y = coin?.market_data?.price_change_percentage_1y || 'N/A';
  const formattedMarketCap = coin?.market_data?.market_cap?.[currency]?.toLocaleString() || 'N/A';
  const formattedFullyDilutedValuation = coin?.market_data?.fully_diluted_valuation?.[currency] || 'N/A';
  const formattedTradingVolume = coin?.market_data?.total_volume?.[currency] || 'N/A';
  const formattedCirculatingSupply = coin?.market_data?.circulating_supply || 'N/A';
  const formattedTotalSupply = coin?.market_data?.total_supply || 'N/A';
  const formattedMaxSupply = coin?.market_data?.max_supply?.toLocaleString() || 'N/A';
  const previousPrice = historicalData[0]?.[1] || 0;
  const currentPrice = coin?.market_data?.current_price?.[currency] || 0;
  const coinChange = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2);

  const handleCurrencyValueChange = (event) => {
    const value = event.target.value;
    setCurrencyValue(value);

    // Calculate computed price
    const computedPrice = value * currentPrice;
    setComputedPrice(computedPrice);
  };

  const formattedComputedPrice = computedPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatted24hLow =
    coin?.market_data?.low_24h?.[currency]?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || 'N/A';

  const formatted24hHigh =
    coin?.market_data?.high_24h?.[currency]?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || 'N/A';

  const calculateProgress = () => {
    if (formatted24hLow === 'N/A' || formatted24hHigh === 'N/A') {
      return 0;
    }

    const low = parseFloat(formatted24hLow.replace(/,/g, ''));
    const high = parseFloat(formatted24hHigh.replace(/,/g, ''));
    const currentValue = parseFloat(formattedPrice.replace(/,/g, ''));

    if (currentValue >= high) {
      return 100;
    }

    if (currentValue <= low) {
      return 0;
    }

    return ((currentValue - low) / (high - low)) * 100;
  };

  const progress = calculateProgress();

  const latestHistoricalData = historicalData.slice(0, 5);

  const parseHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Apply white color to anchor tags
    const links = doc.querySelectorAll('a');
    links.forEach((link) => {
      link.style.color = '#ff00ea';
      link.style.textDecoration = 'none';
    });

    return doc.body.innerHTML;
  };

  const coinDescription =
    coin.description.en.split('. ')[0] +
    '. ' +
    coin.description.en.split('. ')[1] +
    '. ' +
    coin.description.en.split('. ')[2] +
    '.';

  const style = {
    coinContainer: {
      p: 3,
    },
    coinImage: {
      width: '25px',
      height: '25px',
      marginRight: { xs: 0, md: 1 },
    },
    rank: {
      background: 'linear-gradient(25deg, #2600fc, #ff00ea)',
      borderRadius: '5px',
      px: 0.8,
      py: 0.1,
      fontSize: '0.6em',
    },
    changeIcon: {
      fontSize: '1em',
    },
    tableHead: {
      backgroundImage: 'linear-gradient(25deg, #2600fc, #ff00ea)',
    },
    tableBody: {
      backgroundColor: '#0f051d',
    },
    textField: {
      my: 1,
      width: '100%',
    },
    backButton: {
      backgroundImage: 'linear-gradient(25deg, #2600fc, #ff00ea)',
      textTransform: 'none',
    },
  };

  return (
    <Box sx={style.coinContainer}>
      <Grid container direction='row' spacing={2}>
        <Grid item container direction='row' xs={12} spacing={2}>
          <Grid item xs={12} md={7.5}>
            <Grid container direction='column' spacing={1}>
              <Grid item>
                <Grid container direction='row' alignItems='center' spacing={1}>
                  <Grid item>
                    <CardMedia component='img' image={coin.image.large} alt={coin.name} sx={style.coinImage} />
                  </Grid>
                  <Grid item>
                    <Typography variant='h5'>{coin.name}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='text.secondary'>
                      {coin.symbol.toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={style.rank} variant='caption'>
                      Rank #{coin.market_cap_rank}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction='row' alignItems='center' spacing={1}>
                  <Grid item>
                    <Typography variant='body2'>{currencySymbol}{formattedPrice}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body2' sx={{ color: formattedChange24h < 0 ? red[500] : green[400] }}>
                      {formattedChange24h}%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid item>
                  <Typography variant='body2'>MKT: {currencySymbol}{formattedMarketCap}</Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction='row' alignItems='center' spacing={1}>
                  <Grid item>
                    <Typography variant='body2'>{coinValueBTC} BTC</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body2' sx={{ color: coinChange === 0 ? red[500] : green[400] }}>
                      {coinChange}%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction='row' alignItems='center' spacing={1}>
                  <Grid item>
                    <Grid container direction='row' alignItems='center'>
                      <Grid item>
                        <ImportExportIcon sx={style.changeIcon} />
                      </Grid>
                      <Grid item>
                        <Typography variant='body2'>
                          {progress.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <ProgressBar percent={progress} width={isMobile ? 200 : 400} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant='h6'>Historical Price Changed</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={style.tableHead}>
                      <TableRow>
                        <TableCell align='center'>{isMobile ? '24h' : '24 hours'}</TableCell>
                        <TableCell align='center'>{isMobile ? '7d' : '7 days'}</TableCell>
                        <TableCell align='center'>{isMobile ? '30d' : '30 days'}</TableCell>
                        <TableCell align='center'>{isMobile ? '1y' : '1 year'}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={style.tableBody}>
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
                <Typography variant='h6'>What is {coin.name}?</Typography>
                {coin.description.en ? (
                  <>
                    <Typography
                      variant='body2'
                      dangerouslySetInnerHTML={{
                        __html: parseHTML(coinDescription),
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant='body2'>
                      {coin.name} ({coin.symbol.toUpperCase()}) is currently ranked #{coin.market_cap_rank} among
                      cryptocurrencies, with a price of {currencySymbol}{formattedPrice}.
                      It has a BTC value of {coinValueBTC} and has experienced a {coinChange}% change in the past 24
                      hours.
                      The cryptocurrency's Market Cap is {currencySymbol}{formattedMarketCap}, and its Fully Diluted
                      Valuation is {currencySymbol}{formattedFullyDilutedValuation?.toLocaleString()}.
                      With a trading volume of {currencySymbol}{formattedTradingVolume?.toLocaleString()} in the last 24
                      hours,{' '}
                      {coin.name} has a circulating supply of {formattedCirculatingSupply?.toLocaleString()}, a total
                      supply of {formattedTotalSupply.toLocaleString()}, and a maximum supply of {formattedMaxSupply}.
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4.5}>
            <Grid container direction='column' spacing={1}>
              <Grid item>
                <Typography variant='h6'>Historical Price Changed</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={style.tableHead}>
                      <TableRow>
                        {latestHistoricalData.slice(1).map((data, index) => {
                          // Use latestHistoricalData.slice(1) to exclude the first element
                          const date = new Date(data[0]);
                          const hour = date.getHours().toString().padStart(2, '0');
                          const minute = date.getMinutes().toString().padStart(2, '0');

                          return <TableCell key={index} align='center'>{hour}:{minute}</TableCell>;
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody sx={style.tableBody}>
                      <TableRow>
                        {latestHistoricalData.map((data, index) => {
                          if (index === 0) {
                            return null;
                          }

                          const previousPrice = historicalData[index - 1][1];
                          const currentPrice = data[1];
                          const change = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2);

                          return (
                            <TableCell key={index} sx={{ color: change < 0 ? red[500] : green[400] }} align='center'>
                              {change}%
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={style.tableHead}>
                      <TableRow>
                        <TableCell align='center'>Vol</TableCell>
                        <TableCell align='center'>FDV</TableCell>
                        <TableCell align='center'>CS</TableCell>
                        <TableCell align='center'>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={style.tableBody}>
                      <TableRow>
                        <TableCell align='center'>{currencySymbol}{formatNumberWithSuffix(formattedTradingVolume)}</TableCell>
                        <TableCell align='center'>
                          {currencySymbol}{formatNumberWithSuffix(formattedFullyDilutedValuation)}
                        </TableCell>
                        <TableCell align='center'>{formatNumberWithSuffix(formattedCirculatingSupply)}</TableCell>
                        <TableCell align='center'>{formatNumberWithSuffix(formattedTotalSupply)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item>
                <Typography variant='h6'>Crypt-Coinverter</Typography>
                <Card>
                  <CardContent>
                    <TextField
                      size='small'
                      label={coin.name}
                      id='outlined-start-adornment'
                      type='number'
                      value={currencyValue}
                      onChange={handleCurrencyValueChange}
                      sx={style.textField}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>{coin.symbol.toUpperCase()}</InputAdornment>,
                      }}
                    />

                    <TextField
                      size='small'
                      label={currency.toUpperCase()}
                      id='outlined-start-adornment'
                      value={formattedComputedPrice}
                      sx={style.textField}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>{currencySymbol}</InputAdornment>,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' to={`/market`} component={Link} sx={style.backButton}>
            Back
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coin;
