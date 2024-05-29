import React, { useState, useEffect } from "react";
import { Typography, AppBar, CssBaseline, Container, Button, Toolbar } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CryptoCurrencys from "./CryptoCurrencys";
import axios from 'axios';

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

    useEffect(() => {
        fetchCryptos();
    }, []);

    const handleAddComponent = () => {
        const newId = nextId;
        const newComponent = (
            <CryptoCurrencys
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
                    <div>
                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                            Crypto Manager
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Here you can see the latest prices of the most popular cryptocurrencies.
                        </Typography>
                    </div>
                    <div>
                        <Button variant="contained" color="primary" onClick={handleAddComponent}>
                            Add Component
                        </Button>
                        {statusCode !== null ? "API Limit Reached try again later" : " "}
                        {components.map(component => component.element)}
                    </div>
                </Container>
            </main>
        </>
    );
};

export default App;
