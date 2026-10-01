import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CityAPI } from '../services/api';

export interface City {
  id: number;
  name: string;
  state?: string;
  popular?: boolean;
}

export const POPULAR_CITIES: City[] = [
  { id: 1, name: 'Mumbai', state: 'Maharashtra', popular: true },
  { id: 2, name: 'Delhi', state: 'Delhi-NCR', popular: true },
  { id: 3, name: 'Bangalore', state: 'Karnataka', popular: true },
  { id: 4, name: 'Hyderabad', state: 'Telangana', popular: true },
  { id: 5, name: 'Chennai', state: 'Tamil Nadu', popular: true },
  { id: 6, name: 'Pune', state: 'Maharashtra', popular: true },
  { id: 7, name: 'Kolkata', state: 'West Bengal', popular: true },
  { id: 8, name: 'Ahmedabad', state: 'Gujarat', popular: true },
];

export const OTHER_CITIES: City[] = [
  { id: 9, name: 'Chandigarh', state: 'Punjab' },
  { id: 10, name: 'Jaipur', state: 'Rajasthan' },
  { id: 11, name: 'Kochi', state: 'Kerala' },
  { id: 12, name: 'Lucknow', state: 'Uttar Pradesh' },
  { id: 13, name: 'Indore', state: 'Madhya Pradesh' },
  { id: 14, name: 'Goa', state: 'Goa' },
  { id: 15, name: 'Surat', state: 'Gujarat' },
  { id: 16, name: 'Nagpur', state: 'Maharashtra' },
  { id: 17, name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 18, name: 'Bhopal', state: 'Madhya Pradesh' },
];

interface CityContextType {
  selectedCity: City | null;
  setSelectedCity: (city: City) => void;
  isCityModalOpen: boolean;
  openCityModal: () => void;
  closeCityModal: () => void;
  cities: City[];
  popularCities: City[];
  ensureCitySelected: (onCitySelected?: () => void) => boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const STORAGE_KEY = 'bms_selected_city';

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<City | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading selected city from storage', e);
    }
    return null;
  });

  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [cities, setCities] = useState<City[]>([...POPULAR_CITIES, ...OTHER_CITIES]);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Load all cities from backend if available
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const backendCities = await CityAPI.getAll();
        if (backendCities && Array.isArray(backendCities) && backendCities.length > 0) {
          // Merge backend cities with our list
          const merged: City[] = backendCities.map((bc: any) => ({
            id: bc.id,
            name: bc.name,
            state: bc.state,
            popular: POPULAR_CITIES.some(p => p.name.toLowerCase() === bc.name.toLowerCase())
          }));

          // Add any missing cities from mock lists
          [...POPULAR_CITIES, ...OTHER_CITIES].forEach(c => {
            if (!merged.some(m => m.name.toLowerCase() === c.name.toLowerCase())) {
              merged.push(c);
            }
          });
          setCities(merged);
        }
      } catch (err) {
        console.warn('Backend cities not reachable, using default cities list', err);
      }
    };

    fetchCities();
  }, []);

  // On first visit: if no city is chosen, automatically open the modal after a short delay
  useEffect(() => {
    if (!selectedCity) {
      const timer = setTimeout(() => {
        setIsCityModalOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [selectedCity]);

  const setSelectedCity = (city: City) => {
    setSelectedCityState(city);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
    } catch (e) {
      console.error('Error saving selected city to storage', e);
    }
    setIsCityModalOpen(false);

    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  const openCityModal = () => setIsCityModalOpen(true);
  const closeCityModal = () => {
    setIsCityModalOpen(false);
    setPendingCallback(null);
  };

  // Helper method for flows that require a city first (e.g. Booking)
  const ensureCitySelected = (onCitySelected?: () => void): boolean => {
    if (selectedCity) {
      if (onCitySelected) onCitySelected();
      return true;
    }
    if (onCitySelected) {
      setPendingCallback(() => onCitySelected);
    }
    setIsCityModalOpen(true);
    return false;
  };

  const popularCities = cities.filter(c => c.popular || POPULAR_CITIES.some(p => p.name.toLowerCase() === c.name.toLowerCase()));

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        isCityModalOpen,
        openCityModal,
        closeCityModal,
        cities,
        popularCities,
        ensureCitySelected,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
