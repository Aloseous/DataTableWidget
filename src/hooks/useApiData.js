import { useState, useCallback } from 'react';

const useApiData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchData = useCallback(async apiConfig => {
    if (!apiConfig?.url) return;

    setLoading(true);
    setError(null);

    try {
      // Validate URL
      try {
        new URL(apiConfig.url);
      } catch (e) {
        throw new Error('Invalid API URL');
      }

      // Build headers
      const headers = new Headers();
      apiConfig.headers?.forEach(header => {
        if (header.key && header.value) {
          headers.append(header.key, header.value);
        }
      });

      // Build query params
      const params = new URLSearchParams();
      apiConfig.params?.forEach(param => {
        if (param.key && param.value) {
          params.append(param.key, param.value);
        }
      });

      const url = params.toString() ? `${apiConfig.url}?${params.toString()}` : apiConfig.url;

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('API did not return JSON data');
      }

      let jsonData = await response.json();
      let finalData = jsonData;

      // 1. Check if response has a 'data' array
      if (Array.isArray(jsonData.data)) {
        finalData = jsonData.data;
      }
      // 2. Check if response has a 'products' array (dummyjson.com)
      else if (Array.isArray(jsonData.products)) {
        finalData = jsonData.products;
      }
      // 3. Check if response has an 'items' array
      else if (Array.isArray(jsonData.items)) {
        finalData = jsonData.items;
      }
      // 4. Check if response is a single object
      else if (!Array.isArray(jsonData)) {
        finalData = [jsonData];
      }

      setData(finalData);
      setLastFetched(new Date());
      return jsonData;
    } catch (err) {
      setError(err.message || 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData, lastFetched };
};

export default useApiData;
