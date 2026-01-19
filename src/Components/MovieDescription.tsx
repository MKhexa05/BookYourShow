// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { axiosInstance } from "../utils/axiosInstance";
// import { API_PATH } from "../utils/apiPaths";
// import Navbar from "./Navbar";
// import formatShowDate from "../utils/fomatShowDates";
// import SeatNumberModal from "./SeatNumberModal";
// import useUserAuth from "../hooks/useUserAuth";

// type MovieDescription = {
//   id: string;
//   name: string;
//   description: string;
//   duration: number;
//   image: string;
//   category: string[];
//   languages: string[];
//   createdAt: string;
//   updatedAt: string;
//   theaters: Theater[];
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

// type Theater = {
//   id: string;
//   name: string;
//   location: string;
// };

// const MovieDescription = () => {
//   useUserAuth();
//   const { id } = useParams();

//   const [movieDescription, setMovieDescription] =
//     useState<MovieDescription | null>(null);
//   // const [loading, setLoading] = useState(false);
//   const [allShows, setAllShows] = useState<Shows[] | null>(null);

//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
//   const [selectedShowtimeId, setSelectedShowtimeId] = useState<Shows | null>(
//     null
//   );

//   const [numberOfSeats, setNumberOfSeats] = useState(0);
//   const [openModal, setOpenModal] = useState(false);
//   const navigate = useNavigate();

//   // FETCH MOVIE DESCRIPTION BY CALLING /movies/{id}
//   async function fetchMovieDescription() {
//     try {
//       if (id) {
//         const response = await axiosInstance.get(
//           API_PATH.MOVIE.GET_MOVIE_DESCRIPTION(id)
//         );
//         if (response.data) {
//           return response.data;
//         }
//       }
//     } catch (error) {
//       console.log("Something went wrong", error);
//     }
//   }

//   async function fetchScreens(theaterId: string) {
//     try {
//       if (theaterId) {
//         const response = await axiosInstance.get(
//           API_PATH.THEATRE.GET_THEATER_SCREENS(theaterId)
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

//   useEffect(() => {
//     async function init() {
//       const data = await fetchMovieDescription();
//       if (!data) return;

//       setMovieDescription(data);
//       setSelectedTheater(data.theaters[0]);
//     }
//     init();
//   }, []);

//   useEffect(() => {
//     async function init() {
//       if (!selectedTheater) return;

//       setAllShows(null);
//       setSelectedDate("");
//       setSelectedShowtimeId(null);
//       const screens = await fetchScreens(selectedTheater.id);

//       const shows = await Promise.all(
//         screens.map((screen: Screen) => fetchShows(screen.id))
//       );
//       setAllShows(shows.flat().filter(Boolean));
//     }
//     init();
//   }, [selectedTheater]);

//   const filteredShows = useMemo(() => {
//     if (!allShows) {
//       return [];
//     }
//     console.log(allShows);
//     return allShows.filter((show) => show.movieId === id);
//   }, [allShows, id]);

//   const uniqueDates = useMemo(() => {
//     if (filteredShows.length === 0) {
//       return [];
//     }
//     return [
//       ...new Set(filteredShows.map((show) => show.startTime.split("T")[0])),
//     ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
//   }, [filteredShows]);

//   useEffect(() => {
//     if (uniqueDates.length === 0) return;

//     setSelectedDate(uniqueDates[0]);
//   }, [uniqueDates, selectedTheater]);

//   const filteredShowtimes = useMemo(() => {
//     if (!selectedDate || !filteredShows) {
//       return [];
//     }
//     return filteredShows.filter(
//       (showtime) => showtime.startTime.split("T")[0] === selectedDate
//     );
//   }, [selectedDate, filteredShows]);

//   useEffect(() => {
//     if (filteredShowtimes.length === 0) return;

//     setSelectedShowtimeId(filteredShowtimes[0]);
//   }, [filteredShowtimes, selectedTheater]);

//   function handleSelectSeats() {
//     if (!selectedShowtimeId) {
//       console.log("please select a showtime");
//       return;
//     }
//     navigate(`/selectSeats/${selectedShowtimeId?.id}AND${numberOfSeats}`);
//   }

//   // FETCH MOVIE DESCRIPTION WHEN THE SITE LOADS FOR THE FIRST TIME

//   return (
//     <div className="min-h-screen relative md:flex flex-col  px-6 md:px-10 lg:px-14  py-5">
//       <Navbar />

//       <div className="m-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:px-12 w-full ">
//         {/* LEFT SIDE */}
//         <div className="space-y-10 min-h-125">
//           {/* Back */}
//           <button
//             onClick={() => {
//               navigate("/dashboard");
//             }}
//             className="text-sm md:text-base text-gray-400 hover:text-[#1090DF] cursor-pointer "
//           >
//             <i className="fa-solid fa-arrow-left"></i> Back
//           </button>

//           {/* Date */}
//           <div className="max-h-100 ">
//             <h3 className="mb-4 text-2xl font-semibold text-[#1090DF]">Date</h3>
//             <div className="relative">
//               <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pr-10">
//                 {uniqueDates.length > 0 ? (
//                   uniqueDates.map((date) => (
//                     <button
//                       key={date}
//                       onClick={() => setSelectedDate(date)}
//                       className={`flex flex-col items-center rounded-lg border px-3 py-2 text-xs  transition duration-200 hover:cursor-pointer max-w-30
//                     ${
//                       date === selectedDate
//                         ? "bg-[#1090DF] text-white border-[#1090DF]"
//                         : "border-gray-300 text-gray-600 hover:border-[#1090DF]"
//                     }`}
//                     >
//                       <span>{formatShowDate(`${date}T00:00:00Z`).date}</span>
//                       <span className="text-sm font-medium">
//                         {formatShowDate(`${date}T00:00:00Z`).day}
//                       </span>
//                     </button>
//                   ))
//                 ) : (
//                   <div className="flex gap-3 animate-pulse">
//                     {Array.from({ length: 8 }).map((_, i) => (
//                       <div
//                         key={i}
//                         className="h-20 w-16 rounded-lg bg-gray-200"
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Theatre */}
//           <div>
//             <h3 className="mb-4 text-2xl font-semibold text-[#1090DF]">
//               Theater
//             </h3>
//             <div className="flex flex-wrap gap-3 max-w-200">
//               {movieDescription ? (
//                 movieDescription.theaters.map((theater) => (
//                   <button
//                     onClick={() => {
//                       setSelectedTheater(theater);
//                     }}
//                     key={theater.id}
//                     className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition duration-200 hover:cursor-pointer
//                     ${
//                       selectedTheater?.id === theater.id
//                         ? "bg-[#1090DF] text-white border-[#1090DF]"
//                         : "border-gray-300 text-gray-600 hover:border-[#1090DF]"
//                     }`}
//                   >
//                     <i className="fa-solid fa-location-dot" />
//                     {theater.name}
//                   </button>
//                 ))
//               ) : (
//                 <div className="flex flex-wrap gap-3 animate-pulse">
//                   {Array.from({ length: 4 }).map((_, i) => (
//                     <div key={i} className="h-10 w-45 rounded-lg bg-gray-200" />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Time */}
//           <div>
//             <h3 className="mb-4 text-2xl font-semibold text-[#1090DF]">Time</h3>
//             <div className="flex flex-wrap gap-3">
//               {filteredShowtimes.length == 0 ? (
//                 <div className="flex gap-3 animate-pulse">
//                   {Array.from({ length: 4 }).map((_, i) => (
//                     <div key={i} className="h-10 w-20 rounded-lg bg-gray-200" />
//                   ))}
//                 </div>
//               ) : (
//                 filteredShowtimes.map((show, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedShowtimeId(show)}
//                     className={`rounded-lg border px-4 py-2 text-sm font-medium transition duration-200 hover:cursor-pointer
//                     ${
//                       show.id === selectedShowtimeId?.id
//                         ? "bg-[#1090DF] text-white border-[#1090DF]"
//                         : "border-gray-300 text-gray-600 hover:border-[#1090DF]"
//                     }`}
//                   >
//                     {new Date(show.startTime).toLocaleTimeString("en-US", {
//                       hour: "numeric",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 hover:opacity-100">
//                       ₹{show.price?.[0]?.price}some
//                     </span>
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         {movieDescription ? (
//           <div className="md:pl-20">
//             {/* Image  */}
//             <div className="aspect-square w-86 overflow-hidden rounded-3xl bg-gray-200">
//               <img
//                 src={movieDescription.image}
//                 className="h-full w-full object-cover transition-opacity duration-500 opacity-0 blur-sm"
//                 onLoad={(e) => {
//                   e.currentTarget.classList.remove("opacity-0", "blur-sm");
//                 }}
//               />
//             </div>

//             <div className="space-y-2 mt-3 md:max-w-86">
//               <h3 className="text-xl font-bold text-[#1090DF] uppercase">
//                 {movieDescription.name}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {movieDescription.description}
//               </p>

//               <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
//                 <span>Duration</span>
//                 <span>
//                   {Math.floor(movieDescription.duration / 60)}h{" "}
//                   {movieDescription.duration -
//                     60 * Math.floor(movieDescription.duration / 60)}
//                   m
//                 </span>

//                 <span>Language</span>
//                 <span>{movieDescription.languages.join(", ")}</span>

//                 <span>Type</span>
//                 <span>2D</span>
//               </div>
//             </div>

//             {/* BOOKING CARD */}

//             <div className="w-full max-w-86 rounded-2xl border border-[#1090DF] p-6 md:px-10 mt-6 text-white">
//               <h3 className="text-xl md:text-2xl font-semibold text-[#1090DF]">
//                 {selectedTheater ? selectedTheater.name : "Select a Theater"}
//               </h3>

//               {selectedDate ? (
//                 <p className="mt-3 text-[#5A5A5D] text-lg">
//                   {formatShowDate(`${selectedDate}`).date}{" "}
//                 </p>
//               ) : (
//                 <p className="mt-3 text-[#5A5A5D]">Select a date </p>
//               )}

//               {selectedShowtimeId ? (
//                 <p className="text-[#5A5A5D] text-lg">
//                   {new Date(selectedShowtimeId.startTime).toLocaleTimeString(
//                     "en-US",
//                     {
//                       hour: "numeric",
//                       minute: "2-digit",
//                       hour12: true,
//                     }
//                   )}
//                 </p>
//               ) : (
//                 <p className="text-[#5A5A5D]">Select time </p>
//               )}

//               <p className="mt-4 text-xs text-gray-400">
//                 *Seat selection can be done after this
//               </p>
//               <button
//                 disabled={selectedShowtimeId == null}
//                 onClick={() => setOpenModal(true)}
//                 className={`mt-3 w-full rounded-lg border border-[#1090DF] py-2 text-[#1090DF] font-medium hover:bg-[#1090DF] hover:text-white transition duration-300 active:scale-95 ${
//                   selectedShowtimeId == null
//                     ? "opacity-40 hover:cursor-not-allowed "
//                     : "hover:bg-[#1090DF] hover:text-white hover:scale-105 hover:cursor-pointer animate-fade-in"
//                 }`}
//               >
//                 Book Now
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="md:pl-20 animate-pulse">
//             {/* Poster */}
//             <div className="aspect-square w-86 rounded-xl bg-gray-200 mb-6" />

//             {/* Title */}
//             <div className="h-6 bg-gray-200 rounded w-86 mb-3" />

//             {/* Tags */}
//             <div className="flex gap-2 mb-4">
//               <div className="h-5 w-16 bg-gray-200 rounded-full" />
//               <div className="h-5 w-12 bg-gray-200 rounded-full" />
//             </div>

//             {/* Description lines */}
//             <div className="space-y-2 mb-6">
//               <div className="h-4 bg-gray-200 rounded w-86" />
//               <div className="h-4 bg-gray-200 rounded w-3/6" />
//               <div className="h-4 bg-gray-200 rounded w-2/6" />
//             </div>

//             {/* Price */}
//             <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />

//             {/* CTA */}
//             <div className="h-12 bg-gray-200 rounded-xl w-86" />
//           </div>
//         )}
//       </div>
//       {openModal && (
//         <SeatNumberModal
//           numberOfSeats={numberOfSeats}
//           setOpenModal={setOpenModal}
//           setNumberOfSeats={setNumberOfSeats}
//           handleSelectSeats={handleSelectSeats}
//         />
//       )}
//     </div>
//   );
// };

// export default MovieDescription;
