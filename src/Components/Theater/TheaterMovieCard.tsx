import type React from "react";

type MovieShows = {
  id: string;
  name: string;
  description: string;
  duration: number;
  image: string;
  category: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
  showTimes: {
    id: string;
    status: string;
    price: {
      price: number;
      layoutType: string;
    }[];

    startTime: string;
  }[];
};

type TheaterMovieCardProps = {
  movie: MovieShows;
  setSelectedShowtimeId: React.Dispatch<
    React.SetStateAction<{ showTimeId: string; movieId: string } | null>
  >;
  selectedShowtimeId: { showTimeId: string; movieId: string } | null;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const TheaterMovieCard = (props: TheaterMovieCardProps) => {
  const { movie, setSelectedShowtimeId, selectedShowtimeId, setOpenModal } =
    props;

  return (
    <div className="border-t border-gray-700 pt-8" key={movie.id}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* MOVIE INFO */}
        <div className="space-y-3 ">
          <h4 className="text-xl font-semibold text-[#1090DF]">{movie.name}</h4>

          <p className="text-sm text-gray-400">{movie.languages.join(", ")}</p>

          <p className="text-sm text-gray-400">Time</p>
          <div className="flex flex-wrap gap-3 max-w-3xl">
            {movie.showTimes.length === 0 ? (
              <p className="text-sm text-gray-500">No shows available</p>
            ) : (
              movie.showTimes.map((show) => (
                <button
                  key={show.id}
                  className={`rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:text-white hover:border-white transition duration-300 ${
                    show.id === selectedShowtimeId?.showTimeId
                      ? "bg-[#1090DF] text-white border-[#1090DF]"
                      : "border-gray-300 text-gray-400 hover:bg-[#1090DF] hover:cursor-pointer"
                  }`}
                  onClick={() =>
                    setSelectedShowtimeId({
                      showTimeId: show.id,
                      movieId: movie.id,
                    })
                  }
                >
                  {new Date(show.startTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </button>
              ))
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={selectedShowtimeId?.movieId !== movie.id}
          className={`self-start md:self-center rounded-lg px-8 py-3 transition
                      ${
                        selectedShowtimeId?.movieId === movie.id
                          ? "bg-[#1090DF] text-white hover:scale-105 hover:cursor-pointer"
                          : "border border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
          onClick={() => setOpenModal(true)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TheaterMovieCard;
