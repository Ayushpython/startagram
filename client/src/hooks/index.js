import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setValue(response.data);
      setStatus('success');
      return response.data;
    } catch (error) {
      setError(error.response?.data || error);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { execute, status, value, error };
};
