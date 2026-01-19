import type React from "react";

type ModalProps = {
  numberOfSeats: number;
  setNumberOfSeats: React.Dispatch<React.SetStateAction<number>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectSeats: () => void;
};

const SeatNumberModal = (props: ModalProps) => {
  const { numberOfSeats, setNumberOfSeats, setOpenModal, handleSelectSeats } =
    props;
  return (
    <div className="h-screen fixed inset-0 flex items-center justify-center bg-black/60 px-4">
      <div className=" w-full max-w-md rounded-2xl bg-white p-6 text-center">
        {/* Title */}
        <h3 className="mb-6 text-2xl font-semibold text-[#1090DF]">
          How many seats?
        </h3>

        {/* Seats Grid */}
        <div className="mb-8 grid grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              onClick={() => setNumberOfSeats(i + 1)}
              key={i}
              className="h-12 rounded-lg border border-gray-300 text-gray-700 transition
                       hover:border-[#1090DF] hover:text-[#1090DF]
                       focus:bg-[#1090DF] focus:outline-none focus:text-white"
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            className="flex-1 rounded-lg border border-gray-300 py-3 text-gray-400 cursor-pointer hover:bg-gray-300 hover:text-white"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>

          <button
            disabled={numberOfSeats==0}
            className={`flex-1 rounded-lg border border-[#1090DF] py-3 font-medium text-[#1090DF]
                      transition duration-200 ${
                        numberOfSeats == 0
                          ? "hover:cursor-not-allowed"
                          : "hover:cursor-pointer hover:bg-[#1090DF] hover:text-white"
                      }`}
            onClick={handleSelectSeats}
          >
            Select seats
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatNumberModal;
