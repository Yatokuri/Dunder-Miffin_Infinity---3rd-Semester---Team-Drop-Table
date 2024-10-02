// CheckDataWithExpirationCheck.ts
import { useEffect, useState } from "react";

// Custom hook to get data from localStorage with expiration check
const CheckDataWithExpirationCheck = <T>(key: string): T | null => {
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem(key); // Retrieve data from localStorage
        if (storedData) {
            const parsedData = JSON.parse(storedData); // Parse the stored JSON data
            const currentTime = new Date().getTime(); // Get the current time

            // Check if the expiration time exists and is valid
            if (parsedData.expirationTime && currentTime < parsedData.expirationTime) {
                const { expirationTime, ...rest } = parsedData; // Exclude expirationTime from the returned data
                setData(rest); // Set the valid data
            } else {
                localStorage.removeItem(key); // Remove expired data from localStorage
                setData(null); // Reset state to null if data is expired
            }
        }
    }, [key]); // Rerun effect if the key changes

    return data; // Return the fetched data
};

export default CheckDataWithExpirationCheck;
