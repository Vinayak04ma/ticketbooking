import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const MovieAPI = {
  getAll: async () => {
    const response = await api.get('/movies');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/movies/search?title=${query}`);
    return response.data;
  }
};

export const CityAPI = {
  getAll: async () => {
    const response = await api.get('/cities');
    return response.data;
  }
};

export const UserAPI = {
  register: async (userData: any) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
  sendOtp: async (email: string) => {
    const response = await api.post('/users/send-otp', { email });
    return response.data;
  }
};

export const ShowAPI = {
  getById: async (id: number) => {
    const response = await api.get(`/shows/${id}`);
    return response.data;
  },
  getByMovie: async (movieId: number) => {
    const response = await api.get(`/shows/movie/${movieId}`);
    return response.data;
  },
  getByMovieAndDate: async (movieId: number, dateString: string) => {
    const response = await api.get(`/shows/movie/${movieId}/date?date=${dateString}`);
    return response.data;
  }
};

export const SeatAPI = {
  getByScreen: async (screenId: number) => {
    const response = await api.get(`/seats/screen/${screenId}`);
    return response.data;
  }
};

export const BookingAPI = {
  create: async (bookingData: { userId: number; showId: number; seatIds: number[] }) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getAvailable: async (showId: number) => {
    const response = await api.get(`/bookings/show/${showId}/available-seats`);
    return response.data;
  },
  confirm: async (bookingId: number, paymentIntentId: string) => {
    const response = await api.post(`/bookings/${bookingId}/confirm?paymentIntentId=${paymentIntentId}`);
    return response.data;
  }
};

export default api;
