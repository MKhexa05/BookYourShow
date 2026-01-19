import { useNavigate } from "react-router-dom";

type TheaterCardProps = {
  id: string;
  key: string;
  name: string;
  location: string;
};

const TheaterCard = (props: TheaterCardProps) => {
  const { id, name, location } = props;
  const navigate = useNavigate();

  function openTheatre(id: string) {
    navigate(`/theater/${id}`);
  }

  return (
    <div
      className="flex items-center justify-between rounded-xl border border-gray-700 px-6 py-5 transition hover:border-[#1090DF] hover:bg-white/5 hover:scale-[1.03] hover:cursor-pointer"
      onClick={() => openTheatre(id)}
    >
      <div>
        <h3 className="text-lg font-semibold text-[#1090DF]">{name}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-gray-400">
          {" "}
          <i className="fa-solid fa-location-dot text-[#1090DF]"></i>
          {location}
        </p>
      </div>

      <i className="fa-solid fa-angle-right text-xl text-[#1090DF]"></i>
    </div>
  );
};

export default TheaterCard;
