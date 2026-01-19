// import { useEffect, useMemo, useState } from "react";
// import Navbar from "./Navbar";
// import { axiosInstance } from "../utils/axiosInstance";
// import { API_PATH } from "../utils/apiPaths";
// import { useNavigate, useParams } from "react-router-dom";
// import useUserAuth from "../hooks/useUserAuth";
// import formatShowDate from "../utils/fomatShowDates";
// import SeatNumberModal from "./SeatNumberModal";
// import TheaterMovieCard from "./TheaterMovieCard";

// type TheaterDescription = {
//   id: string;
//   name: string;
//   location: string;
//   movies: {
//     id: string;
//     name: string;
//     description: string;
//     duration: number;
//     image: string;
//     category: string[];
//     languages: string[];
//     createdAt: string;
//     updatedAt: string;
//   }[];
// };

// type Screen = {
//   id: string;
//   layout:
//     | string
//     | { layout: { rows: string[]; columns: number[] }; type: string }[];
//   screenNumber: number;
//   theaterId: string;
//   theaterName: string;
// };

// type Shows = {
//   id: string;
//   startTime: string;
//   movieId: string;
//   screenId: string;
//   status: string;
//   price: {
//     price: number;
//     layoutType: string;
//   }[];
//   createdAt: string;
//   updatedAt: string;
//   orders: {
//     seatData: { seats: { row: string; column: number; layoutType: string } }[];
//   }[];
// };

// const SkeletonBox = ({ className }: { className: string }) => (
//   <div className={`animate-pulse rounded-md bg-gray-400 ${className}`} />
// );

// const HeaderSkeleton = () => (
//   <div className="mt-6 space-y-3">
//     <SkeletonBox className="h-8 w-64" />
//     <SkeletonBox className="h-4 w-40" />
//   </div>
// );

// const DateSkeleton = () => (
//   <div className="flex gap-3">
//     {Array.from({ length: 15 }).map((_, i) => (
//       <SkeletonBox key={i} className="h-23 w-15 rounded-lg" />
//     ))}
//   </div>
// );
// const MovieRowSkeleton = () => (
//   <div className="flex justify-between border-t border-gray-700 mt-10  bg-white/5 ">
//     <div className=" py-6 space-y-6">
//       <SkeletonBox className="h-6 w-48" />
//       <SkeletonBox className="h-4 w-32" />
//       <div className="flex gap-3">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <SkeletonBox key={i} className="h-10 w-24 rounded-lg" />
//         ))}
//       </div>
//     </div>
//     <SkeletonBox className="h-10 w-34 mt-20" />
//   </div>
// );

// const TheaterDescription = () => {
//   useUserAuth();

//   const { id } = useParams();
//   const [theaterDescription, setTheaterDescription] =
//     useState<TheaterDescription | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [allScreens, setAllScreens] = useState<Screen[] | null>(null);
//   const [allShows, setAllShows] = useState<Shows[] | null>(null);

//   const [selectedDate, setSelectedDate] = useState("");
//   const [numberOfSeats, setNumberOfSeats] = useState(0);
//   const [selectedShowtimeId, setSelectedShowtimeId] = useState<Shows | null>(
//     null
//   );

//   const [openModal, setOpenModal] = useState(false);

//   const navigate = useNavigate();

//   async function fetchTheaterDescription() {
//     try {
//       if (id) {
//         const response = await axiosInstance.get(
//           API_PATH.THEATRE.GET_THEATER_MOVIES(id)
//         );
//         if (response.data) {
//           return response.data.data;
//         }
//       }
//     } catch (error) {
//       console.log("Something went wrong ", error);
//     }
//   }

//   async function fetchScreens() {
//     try {
//       if (id) {
//         const response = await axiosInstance.get(
//           API_PATH.THEATRE.GET_THEATER_SCREENS(id)
//         );
//         if (response.data) {
//           //   console.log(response.data);
//           return response.data;
//         }
//       }
//     } catch (error) {
//       console.log("Something went wrong", error);
//     }
//   }

//   async function fetchShows(screenId: string) {
//     try {
//       const response = await axiosInstance.get(
//         API_PATH.SCREENS.GET_SCREEN_SHOWTIMES(screenId)
//       );
//       if (response.data) {
//         // console.log("SHOWSSS", response.data.data.screen.showTimes);
//         return response.data.data.screen.showTimes;
//       }
//     } catch (error) {
//       console.log("Something went wrong", error);
//     }
//   }

//   async function fetchingStuffs() {
//     if (loading) return;
//     setLoading(true);
//     const theaterDescriptionResponse = await fetchTheaterDescription();
//     // console.log(theaters);
//     setTheaterDescription(theaterDescriptionResponse);

//     const screens = await fetchScreens();

//     setAllScreens(screens);

//     const shows = await Promise.all(
//       screens.map((screen: Screen) => fetchShows(screen.id))
//     );
//     const allShows = shows.flat().filter(Boolean);

//     // console.log(allShows);

//     console.log("hi");
//     setAllShows(allShows);
//     setLoading(false);
//   }
//   const uniqueDates = useMemo(() => {
//     if (!allShows) return [];
//     return [
//       ...new Set(allShows.map((show) => show.startTime.split("T")[0])),
//     ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
//   }, [allShows]);

//   useEffect(() => {
//     if (!selectedDate && uniqueDates.length > 0) {
//       setSelectedDate(uniqueDates[0]);
//     }
//   }, [uniqueDates]);

//   useEffect(() => {
//     setSelectedShowtimeId(null);
//   }, [selectedDate]);

//   const filteredShowsBasedOnSelectedDate = useMemo(() => {
//     if (!allShows || !selectedDate) {
//       return [];
//     }
//     return allShows.filter(
//       (show) => show.startTime.split("T")[0] === selectedDate
//     );
//   }, [allShows, selectedDate]);

//   useEffect(() => {
//     fetchingStuffs();
//   }, []);

//   function handleSelectSeats() {
//     if (!selectedShowtimeId) {
//       console.log("please select a showtime");
//       return;
//     }
//     navigate(`/selectSeats/${selectedShowtimeId?.id}AND${numberOfSeats}`);
//   }

//   return (
//     <div className="overflow-hidden min-h-screen relative md:flex flex-col  px-6 md:px-10 lg:px-14  py-5">
//       <Navbar />

//       <div className="mt-6 flex flex-col w-full max-w-6xl mx-auto">
//         {/* HEADER */}
//         {theaterDescription ? (
//           <div className="mt-6 space-y-2 ">
//             <div
//               className="flex items-center gap-3 text-[#1090DF] cursor-pointer"
//               onClick={() => {
//                 navigate("/dashboard");
//               }}
//             >
//               <h3 className="text-4xl font-bold">
//                 <i className="fa-solid fa-arrow-left"></i>{" "}
//                 {theaterDescription && theaterDescription.name}
//               </h3>
//             </div>

//             <p className="flex items-center gap-2 text-sm text-gray-400 pl-10">
//               <i className="fa-solid fa-location-dot" />
//               {theaterDescription && theaterDescription.location}
//             </p>
//           </div>
//         ) : (
//           <HeaderSkeleton />
//         )}

//         {/* DATES */}

//         <div className="relative mt-8">
//           <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-black/10 to-transparent z-10" />
//           <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-black/10 to-transparent z-10" />

//           <div className="overflow-x-auto flex items-center gap-4 snap-x snap-mandatory">
//             <button className="text-[#1090DF] text-xl">‹</button>
//             <div className="flex gap-3">
//               {uniqueDates.length > 0 ? (
//                 uniqueDates.map((date) => (
//                   <button
//                     key={date}
//                     onClick={() => setSelectedDate(date)}
//                     className={`snap-start flex flex-col items-center rounded-lg border px-4 py-2 text-sm font-medium transition duration-200 hover:cursor-pointer max-w-30
//                               ${
//                                 date === selectedDate
//                                   ? "bg-[#1090DF] text-white border-[#1090DF]"
//                                   : "border-gray-300 text-gray-600 hover:border-[#1090DF]"
//                               }`}
//                   >
//                     <span>{formatShowDate(`${date}T00:00:00Z`).date}</span>
//                     <span className="text-xs">
//                       {formatShowDate(`${date}T00:00:00Z`).day}
//                     </span>
//                   </button>
//                 ))
//               ) : (
//                 <DateSkeleton />
//               )}
//             </div>
//             <button className="text-[#1090DF] text-xl">›</button>
//           </div>
//         </div>
//         {/* MOVIE LIST */}
//         <div className="mt-10 space-y-10 animate-fade-in">
//           {theaterDescription != null &&
//           filteredShowsBasedOnSelectedDate.length > 0
//             ? theaterDescription.movies.map((movie) =>
//                 filteredShowsBasedOnSelectedDate.filter(
//                   (show) => show.movieId === movie.id
//                 ).length > 0 ? (
//                   <TheaterMovieCard
//                     filteredShowsBasedOnSelectedDate={
//                       filteredShowsBasedOnSelectedDate
//                     }
//                     movie={movie}
//                     setOpenModal={setOpenModal}
//                     selectedShowtimeId={selectedShowtimeId}
//                     setSelectedShowtimeId={setSelectedShowtimeId}
//                   />
//                 ) : (
//                   <p></p>
//                 )
//               )
//             : Array.from({ length: 4 }).map((_, i) => (
//                 <MovieRowSkeleton key={i} />
//               ))}
//         </div>

//         {openModal && (
//           <SeatNumberModal
//             numberOfSeats={numberOfSeats}
//             setOpenModal={setOpenModal}
//             setNumberOfSeats={setNumberOfSeats}
//             handleSelectSeats={handleSelectSeats}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TheaterDescription;
