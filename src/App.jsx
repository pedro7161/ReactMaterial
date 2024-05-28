import React, { useState, useEffect } from "react";
import { Typography, AppBar, CssBaseline, Grid, Toolbar, Container, Paper } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CryptoCurrencys from "./CryptoCurrencys";
import axios from 'axios';

// Define the Item component
const Item = ({ children }) => (
    <Paper style={{ padding: '16px', textAlign: 'center', color: '#000' }}>
        {children}
    </Paper>
);

const App = () => {
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [cryptoData, setCryptoData] = useState(null);
    const [img, setImg] = useState(null);

    const handleCryptoSelect = (crypto) => {
        setSelectedCrypto(crypto);
    };

    useEffect(() => {
        // Check if cryptoData is already fetched for the selected cryptocurrency
        if (selectedCrypto && cryptoData && cryptoData.id === selectedCrypto.id || selectedCrypto==null) {
            return; // Do nothing if cryptoData is already fetched for the selected cryptocurrency
        }

        const fetchCryptoData = async () => {
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}`, {
                    params: {
                        vs_currency: 'eur',
                    },
                });
                if (!response.data) {
                    console.error("Error fetching the cryptocurrency data: No data found", response);
                    return;
                }
                setCryptoData(response.data);
                setImg(response.data.image.small);
            } catch (error) {
                console.error("Error fetching the cryptocurrency data", error);
            }
        };

        fetchCryptoData();
    }, [selectedCrypto, cryptoData, img]);

    return (
        <>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <BarChartIcon />
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
                                {img ? (
                                        <img src={img} alt={selectedCrypto.name} />
                                    ) : null}
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
