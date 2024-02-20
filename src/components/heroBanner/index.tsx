import { useState } from "react";

import games, { gameProps } from "@/mocks/games";
import LimitScreen from "../limitScreen";
import { CiSearch } from "react-icons/ci";
import { formatterCurrency } from "@/utils/shared";
import "./style.scss";

export default function HeroBanner() {
  const tags = ["Descobrir", "Navegar", "Novidades"];

  const [gameShow, setGameShow] = useState(games[0]);

  const handleGameClick = (game: gameProps) => setGameShow(game);

  return (
    <LimitScreen>
      <div className="flex items-center justify-start gap-5 my-5">
        <div className="p-2 text-white flex bg-[#2d2d2d] rounded-[14px] items-center justify-center gap-2 text-[14px]">
          <CiSearch className="text-white text-[16px] ml-1" />
          <input
            type="text"
            placeholder="Buscar na loja"
            className="rounded-[12px] bg-transparent outline-none pl-1"
          />
        </div>
        {tags.map((tag, index) => (
          <button
            key={index}
            className="text-gray-300 hover:text-white transition-all"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between w-full gap-3">
        <div
          className="w-4/5 min-h-[750px] rounded-[14px] flex items-start justify-end gap-4 flex-col p-10 shadow-inner bg-[#2d2d2d] text-white transition-all hover:shadow-2xl heroBanner"
          style={{
            backgroundImage: `url(${gameShow.cover})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <img
            src={gameShow.titleImage}
            alt={gameShow.name}
            className="w-[280px] z-10"
          />
          <p className="max-w-[350px] text-[16px] z-10">{gameShow.status}</p>
          <p className="max-w-[350px] text-[20px] z-10">
            {gameShow.description}
          </p>
          {gameShow.price === "free" ? (
            <p className="z-10">Jogue Grátis</p>
          ) : (
            <p className=" text-white rounded-[8px] z-10">
              A partir de {formatterCurrency(gameShow.price)}
            </p>
          )}
        </div>
        <div className="w-1/5 flex items-center justify-between flex-col min-h-[750px]">
          {games.map((game) => (
            <div
              onClick={() => handleGameClick(game)}
              className="w-full cursor-pointer px-8 py-4 rounded-[8px] flex items-center justify-between flex-row gap-2 hover:bg-[#292929] transition-all"
            >
              <img
                src={game.banner}
                alt={game.name}
                className="w-1/4 rounded-[8px]"
              />
              <p className="text-white w-2/3 text-center">{game.name}</p>
            </div>
          ))}
        </div>
      </div>
    </LimitScreen>
  );
}
