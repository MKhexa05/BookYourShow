import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";
import { useEffect, useState } from "react";
import formatShowDate from "../utils/fomatShowDates";

type Showtime = {
  id: string;
  startTime: string;
  movieId: string;
  screenId: string;
  status: string;
  price: [
    {
      price: number;
      layoutType: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
  movie: {
    id: string;
    name: string;
    description: string;
    duration: number;
    image: string;
    category: string;
    languages: string;
    createdAt: string;
    updatedAt: string;
  };
  screen: {
    id: string;
    screenNumber: number;
    layout: SeatLayout[] | string;
    theaterId: string;
    theaterName: string;
  };
  orders: {
    seatData: { seats: { row: string; column: number; layoutType: string }[] };
  }[];
};

type SeatLayout = {
  type: string;
  layout: {
    rows: string[];
    columns: number[];
  };
  excludedRows?: string[];
  excludedSeats?: string[];
  excludedColumns?: number[];
};

type SeatRow = {
  row: string;
  seats: { id: string; available: boolean }[];
};

type Order = {
  seatData: {
    seats: {
      row: string;
      column: number;
      layoutType: string;
    }[];
  };
};

type Price = { price: number; layoutType: string };

const SelectSeats = () => {
  const { param } = useParams();
  const [id, numberOfSeats] = param ? param.split("AND") : [];
  const navigate = useNavigate();

  const maxSeats = Number(numberOfSeats || 0);

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [openBookingModal, setOpenBookingModal] = useState(false);

  const [seatGrids, setSeatGrids] = useState<
    { type: string; grid: SeatRow[]; price: number }[]
  >([]);

  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; price: number; layoutType: string }[]
  >([]);

  const [orderLoading, setOrderLoading] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(true);

  /* ---------------- FETCH SHOWTIME ---------------- */

  async function fetchShowtime() {
    if (!id) return;

    const response = await axiosInstance.get(
      API_PATH.SHOWTIME.GET_SHOWTIME(id)
    );
    return response.data.data;
  }

  /* ---------------- GRID HELPERS ---------------- */

  function generateRows(start: string, end: string): string[] {
    const rows: string[] = [];
    for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
      rows.push(String.fromCharCode(i));
    }
    return rows;
  }

  function generateColumns(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  function generateSeatGrid(layout: SeatLayout): SeatRow[] {
    const {
      layout: { rows, columns },
      excludedRows = [],
      excludedSeats = [],
      excludedColumns = [],
    } = layout;

    const allRows = generateRows(rows[0], rows[1]);
    const allColumns = generateColumns(columns[0], columns[1]);

    return allRows
      .filter((row) => !excludedRows.includes(row))
      .map((row) => ({
        row,
        seats: allColumns
          .filter((col) => !excludedColumns.includes(col))
          .map((col) => {
            const seatId = `${row}${col}`;
            return {
              id: seatId,
              available: !excludedSeats.includes(seatId),
            };
          }),
      }));
  }
  /* ---------------- SEAT CLICK ---------------- */

  function toggleSeat(seatId: string, price: number, layoutType: string) {
    const seat = {
      id: seatId,
      price,
      layoutType,
    };
    setSelectedSeats((prev) => {
      const alreadySelected = prev.some((s) => s.id === seat.id);

      if (alreadySelected) {
        return prev.filter((s) => s.id !== seat.id);
      }

      if (prev.length >= maxSeats) return prev;

      return [...prev, seat];
    });
  }

  /* ---------------- FETCH + BUILD ---------------- */

  useEffect(() => {
    async function init() {
      const data = await fetchShowtime();
      if (!data) return;

      setShowtime(data);

      const layouts =
        typeof data.screen.layout === "string"
          ? JSON.parse(data.screen.layout)
          : data.screen.layout;

      layouts.map((layout: SeatLayout) => {
        data.orders.map((order: Order) => {
          order.seatData.seats.map((seat) => {
            if (layout.type === seat.layoutType) {
              if (!layout.excludedSeats) {
                layout.excludedSeats = [];
              }
              layout.excludedSeats.push(`${seat.row}${seat.column}`);
            }
          });
        });
      });

      const grids = layouts.map((layout: SeatLayout) => ({
        type: layout.type,
        grid: generateSeatGrid(layout),
        price:
          data.price.filter((p: Price) => p.layoutType === layout.type)[0]
            ?.price | 100,
      }));

      setSeatGrids(grids);
      setTimeout(() => {
        setLoadingSeats(false);
      }, 500);
    }

    init();
  }, []);

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const remainingSeats = maxSeats - selectedSeats.length;

  const grouped = selectedSeats.reduce<Record<string, typeof selectedSeats>>(
    (acc, seat) => {
      if (!acc[seat.layoutType]) {
        acc[seat.layoutType] = [];
      }
      acc[seat.layoutType].push(seat);
      return acc;
    },
    {}
  );
  const summary = Object.entries(grouped).map(([layoutType, seats]) => ({
    layoutType,
    count: seats.length,
    price: seats[0].price,
  }));

  const order = {
    showtimeId: id,
    seatData: {
      seats: selectedSeats.map((seat) => {
        return {
          row: seat.id.charAt(0),
          column: Number(seat.id.slice(1)),
          layoutType: seat.layoutType,
        };
      }),
    },
  };

  async function handleOrder() {
    if (orderLoading) return;

    setOrderLoading(true);
    try {
      const response = await axiosInstance.post(API_PATH.ORDER.POST_ORDERS, {
        showtimeId: id,
        seatData: {
          seats: order.seatData.seats,
        },
      });
      if (response.data) {
        const paymentUrl = response.data.paymentUrl;
        navigate(paymentUrl);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    } finally {
      setOrderLoading(false);
    }
  }

  if (openBookingModal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        {/* Card */}
        <div className="relative w-full max-w-sm  bg-transparent ">
          <div className="rounded-lg border border-b-0 border-[#1090DF] px-8 py-6">
            {/* Title */}
            <h3 className="mb-6 text-2xl font-semibold text-[#1090DF]">
              Booking Detail
            </h3>

            {/* Booking Info */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-1 text-sm">Movie Title</p>
                <p className="font-medium text-gray-400 text-lg">
                  {showtime?.movie.name}
                </p>
              </div>

              <div>
                <p className="text-gray-600 mb-1 text-sm">Date</p>
                <p className="font-medium text-gray-400 text-lg">
                  {formatShowDate(showtime?.startTime).day},{" "}
                  {formatShowDate(showtime?.startTime, "numeric").date}
                </p>
              </div>

              <div className="flex justify-between gap-6">
                <div>
                  <p className="text-gray-600 mb-1 text-sm">
                    Ticket ({numberOfSeats})
                  </p>
                  <p className="font-medium text-gray-400 text-lg">
                    {selectedSeats
                      .sort((a, b) => a.id - b.id)
                      .map((s) => s.id)
                      .join(", ")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 mb-1 text-sm">Hours</p>
                  <p className="font-medium text-gray-400 text-lg">
                    {new Date(showtime?.startTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Ticket cut effect */}
          <div className="relative my-2">
            <div className="absolute left-0 top-1/2 h-8 w-4 -translate-y-1/2 rounded-r-full border border-l-0 border-[#1090DF] bg-[#F7FBFF]" />
            <div className="absolute right-0 top-1/2 h-8 w-4 -translate-y-1/2 rounded-l-full border border-r-0 border-[#1090DF] bg-[#F7FBFF]" />
            <div className="border-t border-dashed border-gray-300" />
          </div>

          <div className="rounded-lg border border-t-0 border-[#1090DF] px-8 py-6 ">
            {/* Transaction Detail */}
            <div className="space-y-1.5 text-sm">
              <p className="font-medium text-[#1090DF] mb-2">
                Transaction Detail
              </p>

              {summary.map((item) => (
                <div
                  key={item.layoutType}
                  className="flex justify-between text-gray-600"
                >
                  <p>
                    {item.layoutType} Seat (₹{item.price} × {item.count})
                  </p>
                  <p>₹{item.count * item.price}</p>
                </div>
              ))}

              <div className="flex justify-between text-gray-600">
                <p>Service Charge (6%)</p>
                <p>₹{Math.round(total * 0.06)}</p>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-gray-600">
                <p>Total payment</p>
                <p>₹{Math.round(total + total * 0.06)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 space-y-3">
              <p className=" text-xs text-gray-300">
                *Purchased ticket cannot be canceled
              </p>

              <button
                disabled={orderLoading}
                className={`w-full rounded-lg border border-[#1090DF] py-3 font-medium
                       text-[#1090DF] hover:bg-[#1090DF] hover:text-white transition  ${
                         orderLoading
                           ? "hover:cursor-not-allowed"
                           : " hover:cursor-pointer"
                       }`}
                onClick={handleOrder}
              >
                {orderLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing payment…
                  </span>
                ) : (
                  `Total Pay ₹${Math.round(total + total * 0.06)} Proceed`
                )}
              </button>

              <button
                disabled={orderLoading}
                className={`w-full rounded-lg border border-gray-300 py-3 text-gray-400
                       hover:bg-gray-400 hover:text-black transition  ${
                         orderLoading
                           ? "hover:cursor-not-allowed"
                           : " hover:cursor-pointer"
                       }`}
                onClick={() => setOpenBookingModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  items-center">
      <div className="flex text-center items-center gap-3 p-6">
        {/* Header */}
        <button
          className="text-[#1090DF] text-2xl hover:cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-3xl font-semibold text-[#1090DF]">Select Seat</h1>
      </div>

      <div className="w-full  flex flex-col items-center justify-center  px-6 pb-40">
        {/* Seat Sections */}
        {/* Seat Legend */}
        <div className="mb-6 flex justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded border border-gray-400 bg-white" />
            Available
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-[#1090DF]" />
            Selected
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-gray-300" />
            Booked
          </div>
        </div>
        {!loadingSeats ? (
          seatGrids.map((section) => (
            <div
              key={section.type}
              className="mb-12 items-center justify-center"
            >
              <p className="text-sm text-gray-600 mb-2">
                ₹{section.price ? section.price : 100} {section.type}
              </p>

              <div className="border-t border-gray-300 mb-6" />

              <div className="space-y-3">
                {section.grid.map((row) => (
                  <div key={row.row} className="flex gap-2 justify-center">
                    {row.seats.map((seat) => {
                      const isSelected = selectedSeats.some(
                        (s) => s.id === seat.id
                      );
                      return (
                        <button
                          key={seat.id}
                          disabled={!seat.available}
                          onClick={() =>
                            toggleSeat(seat.id, section.price, section.type)
                          }
                          className={`w-10 h-10 rounded-md border text-xs font-medium flex items-center justify-center transition hover:cursor-pointer
                        ${
                          !seat.available
                            ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                            : isSelected
                            ? "bg-[#1090DF] text-white border-[#1090DF]"
                            : "border-gray-400 bg-white text-gray-700  hover:bg-[#1090DF] hover:text-white hover:border-[#1090DF]"
                        }
                      `}
                        >
                          {seat.id}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mx-auto" />
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-10 w-10 rounded-md bg-gray-300 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Screen Indicator */}
        <div className="w-full md:max-w-xl mt-16 flex flex-col items-center">
          <div className="w-full h-3 bg-gray-400 rounded-full opacity-60" />
          <p className="text-sm text-gray-600 mt-2">
            All eyes this way please!
          </p>
        </div>

        {/* Pay Button */}

        <div className="fixed bottom-0 left-0 w-full border-t border-gray-300 py-6 flex justify-center">
          {total === 0 || selectedSeats.length < Number(numberOfSeats) ? (
            <p className="px-14 py-3 border-2 border-[#1090DF] text-[#1090DF] font-semibold rounded-lg animate-shake ">
              Select {remainingSeats} more seat{remainingSeats > 1 && "s"}
            </p>
          ) : (
            <button
              className="px-14 py-3 border-2 border-[#1090DF] text-[#1090DF] font-semibold rounded-lg hover:bg-[#1090DF] hover:text-white transition-all transform hover:scale-105  scale-90 animate-fade-in duration-300 hover:cursor-pointer"
              onClick={() => setOpenBookingModal(true)}
            >
              Pay ₹{total}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectSeats;
