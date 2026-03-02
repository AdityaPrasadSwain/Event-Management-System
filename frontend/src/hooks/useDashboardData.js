import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const cache = {}; // Simple in-memory cache

const useDashboardData = (endpoints, cacheKey = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        // Return cached data if available and fresh (simple check)
        if (cacheKey && cache[cacheKey]) {
            setData(cache[cacheKey]);
            setLoading(false);
            // Optional: Background revalidation could go here
            return;
        }

        setLoading(true);
        try {
            const promises = Object.entries(endpoints).map(async ([key, url]) => {
                const response = await api.get(url);
                return [key, response.data];
            });

            const results = await Promise.all(promises);
            const newData = Object.fromEntries(results);

            if (cacheKey) {
                cache[cacheKey] = newData;
            }

            setData(newData);
        } catch (err) {
            console.error("Dashboard Data Fetch Error", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(endpoints), cacheKey]); // Helper dependence on endpoints structure

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refresh = () => {
        if (cacheKey) delete cache[cacheKey];
        fetchData();
    };

    return { data, loading, error, refresh };
};

export default useDashboardData;
