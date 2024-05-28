import React, { useState, useEffect } from "react";
import { Typography, AppBar, CssBaseline, Grid, Toolbar, Container, Paper } from '@mui/material';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const CryptoCurrencys = ({ onCryptoSelect }) => {
    const [cryptoList, setCryptoList] = useState([]);
    const [loading, setLoading] = useState(true);
   
    // get all info about cryptos
    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'eur',
                        order: 'market_cap_desc',
                        sparkline: false,
                    },
                });
                setCryptoList(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the cryptocurrencies", error);
                setLoading(false);
            }
        };

        fetchCryptos();
    }, []);

    const handleCryptoSelect = (crypto) => {
        onCryptoSelect(crypto);
    };

    return (
        <Container maxWidth="sm">
            {loading ? (
                <Typography variant="h6" align="center">Loading...</Typography>
            ) : (
                <Autocomplete
                    disablePortal
                    id="crypto-combo-box"
                    options={cryptoList}
                    getOptionLabel={(option) => option.name}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Cryptocurrency" />}
                    onChange={(event, value) => handleCryptoSelect(value)}
                />
            )}
        </Container>
    );
}

// Define the Item component
const Item = ({ children }) => (
    <Paper style={{ padding: '16px', textAlign: 'center', color: '#000' }}>
        {children}
    </Paper>
);

const App = () => {
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [cryptoData, setCryptoData] = useState(null);

    const handleCryptoSelect = (crypto) => {
        setSelectedCrypto(crypto);
    };

    useEffect(() => {
        // Check if cryptoData is already fetched for the selected cryptocurrency
        if (selectedCrypto && cryptoData && cryptoData.id === selectedCrypto.id) {
            return; // Do nothing if cryptoData is already fetched for the selected cryptocurrency
        }

        const fetchCryptoData = async () => {
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}`, {
                    params: {
                        vs_currency: 'eur',
                    },
                });
                setCryptoData(response.data);
            } catch (error) {
                console.error("Error fetching the cryptocurrency data", error);
            }
        };

        fetchCryptoData();
    }, [selectedCrypto, cryptoData]);

    return (
        <>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <CurrencyBitcoinIcon />
                    <Typography variant="h6">
                        CryptoManager
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <Container maxWidth="sm">
                    <div>
                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                            Crypto Manager
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Here you can see the latest prices of the most popular cryptocurrencies.
                        </Typography>
                    </div>
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Item>
                                    <CryptoCurrencys onCryptoSelect={handleCryptoSelect} />
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    {selectedCrypto && cryptoData ? (
                                        <>
                                            <Typography variant="h6">Current Price</Typography>
                                            <Typography variant="body1">{cryptoData.name}: {cryptoData.market_data.current_price.eur}</Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body1">Select a cryptocurrency</Typography>
                                    )}
                                </Item>
                            </Grid>
                            <Grid item xs={12}>
                                <Item>Chart</Item>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </main>
        </>
    );
}

export default App;
