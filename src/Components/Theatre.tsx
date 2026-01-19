import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";
import TheatreCard from "./TheaterCard";

type Theatre = {
  id: string;
  name: string;
  location: string;
};

const Theatre = () => {
  const [theatres, setTheatres] = useState<Theatre[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchTheatres() {
      try {
        const response = await axiosInstance.get(API_PATH.THEATRE.GET_THEATRES);
        if (mounted) {
          setTheatres(response.data.data);
        }
      } catch (error) {
        console.error("Something went wrong", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTheatres();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-4 md:gap-6">
      {theatres ? (
        theatres.map((theatre) => {
          return (
            <TheatreCard
              key={theatre.id}
              id={theatre.id}
              name={theatre.name}
              location={theatre.location}
            />
          );
        })
      ) : (
        <div className="flex flex-col gap-4 md:gap-6 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-8"
            >
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-28 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-4 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Theatre;
