import React from 'react'
import { Box, Card, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material'
import { hero, connect } from '../images/Images'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StraightenIcon from '@mui/icons-material/Straighten';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CellTowerIcon from '@mui/icons-material/CellTower';
import SellIcon from '@mui/icons-material/Sell';
import TableRowsIcon from '@mui/icons-material/TableRows';

const About = () => {
  const itemList = [
    { icon: <AccountBalanceWalletIcon />, title: 'Connect Your Wallet', body: 'Link Trust Wallet, Metamask, or others to access the app.' },
    { icon: <StraightenIcon />, title: 'Select Your Quantity', body: 'Upload crypto, add title, description, and set a price.' },
    { icon: <ThumbUpAltIcon />, title: 'Confirm Transaction', body: 'Earn by selling your crypto through our marketplace.' },
    { icon: <CellTowerIcon />, title: 'Receive Your Own NFTS', body: 'Consolidate your crypto investments on our platform.' },
    { icon: <SellIcon />, title: 'Take a Market to Sell', body: 'Discover and trade curated crypto collections.' },
    { icon: <TableRowsIcon />, title: 'Drive Your Collection', body: 'Simplify the process of Discovering, and Managing.' }
  ]

  const style = {
    container: {
      p: 3,
    },
    heading: {
      textAlign: 'center',
    },
    gradientText: {
      textAlign: 'center',
      fontWeight: 'bold',
      background: '-webkit-linear-gradient(25deg, #2600fc, #ff00ea)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
    },
    image: {
      width: '250px',
      height: '250px',
    },
    body: {
      variant: 'body2',
    },
    iconContainer: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(25deg, #2600fc, #ff00ea)',
      p: 1,
      borderRadius: '10px',
    },
    card: {
      pt: 1,
    },
    cardContent: {
      pt: 0.5,
    },
    bannerContainer: {
      mt: 2 
    },
    head: {
      textTransform: 'uppercase'
    },
    trustContainer: {
      pb: 2
    }
  }

  return (
    <Grid container sx={style.container} direction='column' spacing={8}>
      <Grid item container direction='row' justifyContent='center' alignItems='flex-end' spacing={1}>
        <Grid item>
          <Typography sx={style.heading} variant='h4'>
            What is
          </Typography>
        </Grid>
        <Grid item>
          <Typography sx={style.gradientText} variant='h4'>
            Crypt-Coin?
          </Typography>
        </Grid>
        <Grid sx={style.bannerContainer} item container direction='row' alignItems='center' justifyContent='center' spacing={2}>
          <Grid item xs={12} md={4}>
            <Grid container alignItems='center' justifyContent='center'>
              <CardMedia component='img' image={hero} sx={style.image} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography sx={style.body}>
              Crypt-coin is a cryptocurrency that is built on the foundation of the CoinGecko API. Cryptocurrencies, like Bitcoin and Ethereum, are digital or virtual currencies that use cryptography for secure financial transactions, control the creation of new units, and verify the transfer of assets.
              CoinGecko is a popular cryptocurrency data platform that provides comprehensive information about various cryptocurrencies, including market data, price charts, trading volumes, and more. Crypt-coin utilizes the CoinGecko API as a data source, allowing users to access real-time and historical data about the cryptocurrency.
              By leveraging the CoinGecko API, Crypt-coin benefits from reliable and up-to-date market information, which can be crucial for investors, traders, and enthusiasts in making informed decisions. The API provides access to a wide range of data points, enabling developers to incorporate valuable cryptocurrency data into their applications, such as price tracking, portfolio management, and market analysis tools.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container direction='row' justifyContent='center' alignItems='center' spacing={1}>
        <Grid item>
          <Typography sx={style.heading} variant='h4'>
            Why
          </Typography>
        </Grid>
        <Grid item>
          <Typography sx={style.gradientText} variant='h4'>
            Trust Us
          </Typography>
        </Grid>
      </Grid>
      <Grid sx={style.trustContainer} item container direction='row' alignItems='center' justifyContent='center' spacing={2}>
        <Grid item xs={12} md={3}>
          <Grid container alignItems='center' justifyContent='center'>
            <CardMedia component='img' image={connect} sx={style.image} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container alignContent='center' justifyContent='center' spacing={1}>
            {itemList.map((item) => (
              <Grid item xs={12} sm={6}>
                <Card sx={style.card}>
                  <CardContent sx={style.cardContent}>
                    <Stack direction='row' alignContent='center' justifyContent='flex-start' spacing={2}>
                      <Box sx={style.iconContainer}>
                        {item.icon}
                      </Box>
                      <Box>
                        <Stack direction='column' alignItems='flex-start' justifyContent='center'>
                          <Box>
                            <Typography sx={style.head} variant='body1'>
                              {item.title}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant='body2'>
                              {item.body}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default About
