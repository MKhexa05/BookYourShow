import { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";
import TicketCard from "./TicketCard";

type Order = {
  id: string;
  transactionId: string;
  userId: string;
  showtimeId: string;
  status: string;
  totalPrice: number;
  seatData: {
    seats: {
      row: string;
      column: number;
      layoutType: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
  showtime: {
    id: string;
    startTime: string;
    movie: {
      id: string;
      name: string;
    };
    screen: {
      id: string;
      theaterName: string;
    };
  };
};

const Tickets = () => {
  const [selected, setSelected] = useState<"upcoming" | "history">("upcoming");
  const [allOrders, setAllOrders] = useState<Order[] | null>();

  async function fetchOrders() {
    try {
      const response = await axiosInstance.get(API_PATH.ORDER.GET_ORDERS);
      if (response.data) {
        console.log(response.data);
        setAllOrders(response.data);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  useEffect(() => {
    fetchOrders();
  }, []);

  const ticketsToShow = useMemo(() => {
    if (!allOrders || !selected) {
      return [];
    }
    if (selected == "upcoming") {
      return allOrders
        .filter((order) => order.showtime.startTime >= new Date().toISOString())
        .filter((order) => order.status === "COMPLETED");
    }
    if (selected == "history") {
      return allOrders
        .filter((order) => order.showtime.startTime < new Date().toISOString())
        .filter((order) => order.status === "COMPLETED");
    }
  }, [selected, allOrders]);

  return (
    <div className=" min-h-screen relative md:flex flex-col  px-6 md:px-10 lg:px-14  py-5">
      <Navbar />
      <div className="mt-6 flex flex-col w-full max-w-5xl md:px-8 md:pt-8">
        <div className=" gap-4  ">
          <button
            onClick={() => setSelected("upcoming")}
            className={`rounded-md px-6 py-2 text-sm font-medium transition duration-200 hover:cursor-pointer
            ${
              selected === "upcoming"
                ? "bg-[#1090DF] text-white"
                : "text-[#1090DF] hover:bg-[#1090DF]/10"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelected("history")}
            className={`rounded-md px-6 py-2 text-sm font-medium transition duration-200 hover:cursor-pointer
            ${
              selected === "history"
                ? "bg-[#1090DF] text-white"
                : "text-[#1090DF] hover:bg-[#1090DF]/10"
            }`}
          >
            {" "}
            History
          </button>
        </div>
      </div>

      {/* Tickets */}
      <div className="mt-10 w-full  mx-auto md:px-8">
        {ticketsToShow && ticketsToShow.length > 0 ? (
          <div className="flex  gap-6">
            {ticketsToShow.map((ticket) => (
              <>
                <TicketCard key={ticket.id} order={ticket} />
              </>
            ))}
          </div>
        ) : ticketsToShow?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm mt-1">
              Your purchased tickets will appear here
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Tickets;
