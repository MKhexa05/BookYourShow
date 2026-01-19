import jsPDF from "jspdf";
import formatShowDate from "../utils/fomatShowDates";

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

type TicketCardProps = {
  order: Order;
};

const TicketCard = (props: TicketCardProps) => {
  const { order } = props;

  function handleDownload() {
    if (!order) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    const date = new Date(order.showtime.startTime);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    /* ---------- CARD ---------- */
    doc.setDrawColor(16, 144, 223);
    doc.setLineWidth(1.5);
    doc.roundedRect(20, 20, pageWidth - 40, 160, 8, 8);

    let y = 35;

    /* ---------- TITLE ---------- */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(16, 144, 223);
    doc.text("MOVIE TICKET", pageWidth / 2, y, { align: "center" });

    y += 12;
    doc.setDrawColor(200);
    doc.line(30, y, pageWidth - 30, y);

    /* ---------- MOVIE NAME ---------- */
    y += 14;
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text(order.showtime.movie.name, pageWidth / 2, y, {
      align: "center",
    });

    /* ---------- THEATER ---------- */
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text(order.showtime.screen.theaterName, pageWidth / 2, y, {
      align: "center",
    });

    /* ---------- DATE & TIME ---------- */
    y += 16;
    doc.setFontSize(13);
    doc.setTextColor(0);

    doc.text(`Date: ${formattedDate}`, 40, y);
    doc.text(`Time: ${formattedTime}`, pageWidth - 40, y, {
      align: "right",
    });

    /* ---------- SEATS ---------- */
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Seats", 40, y);

    y += 10;
    doc.setFont("helvetica", "normal");

    const seatText = order.seatData.seats
      .map((s) => `${s.row}${s.column}`)
      .join(", ");
    doc.setFontSize(14);
    doc.setTextColor(16, 144, 223);
    doc.text(seatText, 40, y);

    /* ---------- FOOTER ---------- */
    y = 165;
    doc.setDrawColor(200);
    doc.line(30, y, pageWidth - 30, y);

    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      "Please arrive 15 minutes early • Enjoy the show",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    /* ---------- SAVE ---------- */
    doc.save("movie-ticket.pdf");
  }
  return (
    <div className="w-full md:max-w-88 rounded-2xl border border-[#1090DF] p-6 space-y-10">
      {/* Date */}
      <div>
        <p className="text-[#1090DF] mb-1 text-sm">Date</p>
        <p className="font-medium text-gray-600 text-lg">
          {formatShowDate(order?.showtime.startTime, "numeric").day},{" "}
          {formatShowDate(order?.showtime.startTime, "numeric").date}
        </p>
      </div>

      {/* Movie Title */}
      <div>
        <p className="text-sm mb-1 text-[#1090DF]">Movie Title</p>
        <p className="text-lg font-medium text-gray-600">
          {order?.showtime.movie.name}
        </p>
      </div>

      {/* Ticket & Hours */}
      <div className="flex justify-between gap-6">
        <div>
          <p className="text-sm mb-1 text-[#1090DF]">
            Ticket ({order?.seatData.seats.length})
          </p>
          <p className="text-lg font-medium text-gray-600">
            {order?.seatData.seats.map((s) => `${s.row}${s.column}`).join(", ")}
          </p>
        </div>

        <div>
          <p className="text-sm mb-1 text-[#1090DF]">Hours</p>
          <p className="text-lg font-medium text-gray-600">
            {new Date(order?.showtime?.startTime).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full rounded-lg border border-[#1090DF] py-3
                   text-[#1090DF] font-medium
                   hover:bg-[#1090DF] hover:text-white transition hover:cursor-pointer duration-200"
      >
        Download Ticket
      </button>
    </div>
  );
};

export default TicketCard;
