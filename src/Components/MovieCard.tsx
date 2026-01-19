import { useNavigate } from "react-router-dom";

type MovieCardProps = {
  id: string;
  key: string;
  name: string;
  image: string;
};

const MovieCard = (props: MovieCardProps) => {
  const { id, name, image } = props;
  const navigate = useNavigate();

  function openMovie(id: string) {
    navigate(`/movie/${id}`);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <img
          src={image}
          alt={name}
          className="max-h-90 min-h-90 w-full rounded-2xl object-cover transition hover:scale-[1.03] hover:cursor-pointer"
          onClick={() => {
            openMovie(id);
          }}
        />
        <p className="mt-4 text-center text-base font-semibold text-[#1090DF]">
          {name}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
