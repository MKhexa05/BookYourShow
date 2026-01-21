export const API_PATH = {
  APP: {
    GET: "/",
  },
  AUTH: {
    REGISTER: "/auth/signup",
    LOGIN: "auth/login",
  },
  MOVIE: {
    GET_MOVIES: "/movies",
    GET_MOVIE_DESCRIPTION: (movieId: string) => `/movies/${movieId}`,
  },
  THEATRE: {
    GET_THEATRES: "/theaters",
    GET_THEATERS_ID: (theaterId: string) => `/theaters/${theaterId}`,
    GET_THEATER_MOVIES: (theaterId: string) => `/theaters/${theaterId}/movies`,
    GET_THEATER_SCREENS: (theaterId: string) =>
      `/theaters/${theaterId}/screens`,
    GET_THEATER_SHOWS: (theaterId: string) => `/theaters/${theaterId}/shows`,
  },
  SHOWTIME: {
    GET_MOVIE_BY_DATE: (movieId: string) => `/show-times/${movieId}/by-date`,
    GET_SHOWTIME: (showtimeId: string) => `/show-times/${showtimeId}`,
  },
  SCREENS: {
    GET_SCREEN_SHOWTIMES: (screenId: string) => `/screens/${screenId}`,
  },
  ORDER: {
    GET_ORDERS: "/orders",
    POST_ORDERS: "/orders",
    GET_ORDER_ID: (orderId: string) => `/orders/${orderId}`,
  },
};
