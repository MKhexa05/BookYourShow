import { useState } from "react";
import Navbar from "./Navbar";
import Movie from "./Movie/Movie";
import useUserAuth from "../hooks/useUserAuth";
import Theatre from "./Theater/Theatre";

const Dashboard = () => {
  useUserAuth();
  const [selected, setSelected] = useState<"movie" | "theatre">("movie");

  return (
    <div className=" min-h-screen relative md:flex flex-col  px-6 md:px-10 lg:px-14  py-5">
      <Navbar />

      <div className="mt-6 flex flex-col w-full max-w-6xl mx-auto">
        <div className=" gap-4  ">
          <h3 className="my-6 text-4xl font-bold text-[#1090DF]">
            Now Showing
          </h3>

          {/* BUTTONS  */}
          <div className="inline-flex rounded-lg  p-1 w-fit">
            <button
              onClick={() => setSelected("movie")}
              className={`px-10 py-2 text-sm font-medium rounded-md transition-all duration-300 
      ${
        selected === "movie"
          ? "bg-[#1090DF] text-white shadow"
          : "text-[#1090DF] hover:bg-[#1090DF]/20  hover:cursor-pointer"
      }`}
            >
              Movies
            </button>

            <button
              onClick={() => setSelected("theatre")}
              className={`px-10 py-2 text-sm font-medium rounded-md transition-all duration-300
      ${
        selected === "theatre"
          ? "bg-[#1090DF] text-white shadow"
          : "text-[#1090DF] hover:bg-[#1090DF]/20 hover:cursor-pointer"
      }`}
            >
              Theatres
            </button>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <div className="w-full animate-fade-in" key={selected}>
            {selected == "movie" ? <Movie /> : <Theatre />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
