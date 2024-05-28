import React, { useState, useEffect } from "react";
import { Typography, AppBar, CssBaseline, Grid, Toolbar, Container, Paper, Button } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CryptoCurrencys from "./CryptoCurrencys";
import axios from 'axios';

// Define the types for the data
interface CryptoCurrency {
    id: string;
    name: string;
    image: {
        small: string;
    };
    market_data: {
        current_price: {
            eur: number;
        };
    };
}

interface CryptoMarket {
    id: string;
    name: string;
}

const Item: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Paper style={{ padding: '16px', textAlign: 'center', color: '#000' }}>
        {children}
    </Paper>
);

const App: React.FC = () => {
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoMarket | null>(null);
    const [cryptoData, setCryptoData] = useState<CryptoCurrency | null>(null);
    const [img, setImg] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [cryptoOptions, setCryptoOptions] = useState<CryptoMarket[]>([]);
    const [components, setComponents] = useState<JSX.Element[]>([]);

    const handleCryptoSelect = (crypto: CryptoMarket | null) => {
        setSelectedCrypto(crypto);
        if (crypto) {
            fetchCryptoData(crypto);
        }
    };

    const fetchCryptos = async () => {
        try {
            const response = await axios.get<CryptoMarket[]>('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'eur',
                    order: 'market_cap_desc',
                    sparkline: false,
                },
            });
            setCryptoOptions(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error fetching cryptocurrencies:", error.code);
                setStatusCode(Number(error.code));
            }
        }
    };

    const fetchCryptoData = async (crypto: CryptoMarket) => {
        try {
            const response = await axios.get<CryptoCurrency>(`https://api.coingecko.com/api/v3/coins/${crypto.id}`, {
                params: {
                    vs_currency: 'eur',
                },
            });
            setCryptoData(response.data);
            setImg(response.data.image.small);
            setStatusCode(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error fetching cryptocurrency data:", error.code);
                setStatusCode(Number(error.code));
            }
        }
    };

    useEffect(() => {
        fetchCryptos();
    }, []);

    const handleAddComponent = () => {
        const newComponent = <CryptoCurrencys key={components.length} onChange={handleCryptoSelect} options={cryptoOptions} />;
        setComponents([...components, newComponent]);
    };

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
                                    <CryptoCurrencys onChange={handleCryptoSelect} options={cryptoOptions} />
                                    {statusCode !== null ? "API Limit Reached try again later" : " "}
                                </Item>
                                <Button variant="contained" color="primary" onClick={handleAddComponent}>
                                    Add Component
                                </Button>
                                {components.map((component, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Item>{component}</Item>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    {img && (
                                        <img src={img} alt={selectedCrypto?.name} />
                                    )}
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
                                {/* future grid */}
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </main>
        </>
    );
};

export default App;
