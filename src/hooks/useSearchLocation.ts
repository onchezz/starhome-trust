import { useState,useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; // Ensure mapboxgl is imported
import { toast } from "sonner";
 const useSearchLoacation = (map, marker, handleCoordinateSelect) => {const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce function to delay the search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = async (query) => {
    if (!query.trim() || !map.current || !marker.current) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const lngLat = new mapboxgl.LngLat(lng, lat);

        // Update map and marker
        map.current.flyTo({
          center: lngLat,
          zoom: 15,
        });

        // Update marker and get location details
        handleCoordinateSelect(lngLat);
      } else {
        toast.error("No results found");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search location");
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce(handleSearch, 300);

  // Trigger search when searchQuery changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  return {
    isSearching,
    searchQuery,
    setSearchQuery,
    handleSearch
  };};

export default useSearchLoacation;