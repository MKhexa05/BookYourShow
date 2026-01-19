import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";
import { useEffect, useState } from "react";
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

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [viewTicket, setViewTicket] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      if (!sessionId) return;
      try {
        const response = await axiosInstance.get(API_PATH.ORDER.GET_ORDERS);
        if (response.data) {
          const thisOrder = response.data
            .filter((order: Order) => order.transactionId === sessionId)
            .flat()[0];
          setOrder(thisOrder);
        }
      } catch (error) {
        console.log("Something went wrong", error);
      }
    }
    fetchOrder();
  }, [sessionId]);

  function handleHomepage() {
    navigate("/");
  }

  if (!viewTicket) {
    return (
      <div className="min-h-screen  flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Payment Successful
          </h3>
          {/* Success Icon */}
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-green-200 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-green-400 flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full max-w-xs flex-col gap-4">
            <button
              onClick={() => setViewTicket(true)}
              className="rounded-lg border border-[#1090DF] py-3 font-medium
                     text-[#1090DF] hover:bg-[#1090DF] hover:text-white transition hover:cursor-pointer duration-200"
            >
              View Ticket
            </button>

            <button
              onClick={handleHomepage}
              className="w-full rounded-lg border border-gray-300 py-3 text-gray-400
                       hover:bg-gray-400 hover:text-black transition hover:cursor-pointer duration-200"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full mx-auto max-w-sm">
        {/* Ticket Card */}
        {order && <TicketCard order={order} />}
        <div className="mt-50">
          {/* Back Button */}
          <button
            onClick={handleHomepage}
            className="w-full md:max-w-88  rounded-lg border border-gray-300 py-3 text-gray-400
                       hover:bg-gray-400 hover:text-black transition hover:cursor-pointer duration-200"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
