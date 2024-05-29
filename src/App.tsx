// App.tsx
import React, { useState, useEffect } from "react";
import { Typography, AppBar, CssBaseline, Container, Button, Toolbar } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CryptoCurrencies from "./CryptoCurrencies";
import axios from 'axios';

interface CryptoMarket {
    id: string;
    name: string;
    image: {
        small: string;
    };
    current_price: {
        eur: number;
    };
}

interface ComponentData {
    id: number;
    element: JSX.Element;
}

const App: React.FC = () => {
    const [cryptoOptions, setCryptoOptions] = useState<CryptoMarket[]>([]);
    const [components, setComponents] = useState<ComponentData[]>([]);
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [nextId, setNextId] = useState<number>(1);

    const fetchCryptos = async () => {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'eur',
                    order: 'market_cap_desc',
                    sparkline: false,
                },
            });
            const cryptoData = response.data.map((crypto: any) => ({
                id: crypto.id,
                name: crypto.name,
                image: { small: crypto.image },
                current_price: { eur: crypto.current_price },
            }));
            setCryptoOptions(cryptoData);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error fetching cryptocurrencies:", error.code);
                setStatusCode(Number(error.code));
            }
        }
    };

    useEffect(() => {
        fetchCryptos();
        const interval = setInterval(() => {
            fetchCryptos();
        }, 60000 * 15); // Fetch data every 60 seconds (15 minutes)

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleAddComponent = () => {
        const newId = nextId;
        const newComponent = (
            <CryptoCurrencies
                key={newId}
                id={newId}
                options={cryptoOptions}
                onRemove={handleRemoveComponent}
            />
        );
        setComponents([...components, { id: newId, element: newComponent }]);
        setNextId(nextId + 1);
    };

    const handleRemoveComponent = (id: number) => {
        setComponents(components.filter(component => component.id !== id));
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
                    <div style={{ marginBottom: '20px' }}> {/* Add space below the button */}
                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                            Crypto Manager
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Here you can see the latest prices of the most popular cryptocurrencies.
                        </Typography>
                        <div style={{ textAlign: 'center' }}> {/* Align button to center */}
                            <Button variant="contained" color="primary" onClick={handleAddComponent}>
                                Add another Cryptocurrency
                            </Button>
                        </div>
                        {statusCode !== null && <Typography variant="body1" color="red">API Limit Reached, try again later</Typography>}
                    </div>
                    <div>
                        {components.map(component => component.element)}
                    </div>
                </Container>
            </main>
        </>
    );
};

export default App;
