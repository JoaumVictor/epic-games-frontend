import { useState } from "react";

import games, { gameProps } from "@/mocks/games";
import LimitScreen from "../limitScreen";
import { CiSearch } from "react-icons/ci";
import { classNames, formatterCurrency } from "@/utils/shared";
import "./style.scss";
import Button from "@/components/button";
import { useCart } from "@/context/cart";
import { motion } from "framer-motion";

export default function HeroBanner() {
  const { dispatch } = useCart();
  const tags = ["Descobrir", "Navegar", "Novidades"];

  const [gameShow, setGameShow] = useState(games[0]);
  const [exitAnimate, setExitAnimate] = useState(false);

  const handleGameClick = (game: gameProps) => {
    setExitAnimate(true);
    setTimeout(() => {
      setGameShow(game);
      setExitAnimate(false);
    }, 200);
  };

  const handleAddGameToCart = (game: gameProps) => {
    dispatch({ type: "ADD_TO_CART", payload: game });
  };

  const gameBannerVariants = {
    hidden: { x: "4%", opacity: 0.2 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-8%", opacity: 0.4 },
  };

  const GameTitleVariants = {
    hidden: { x: "5%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-10%", opacity: 0.4 },
  };

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
            className="text-gray-300 transition-all hover:text-white"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between w-full gap-3">
        <div className="w-4/5 overflow-hidden">
          <motion.div
            variants={gameBannerVariants}
            key={gameShow.name}
            initial="hidden"
            animate={exitAnimate ? "exit" : "visible"}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
              stiffness: 1000,
            }}
            className="min-h-[750px] rounded-[14px] flex items-start justify-end gap-4 flex-col p-10 shadow-inner bg-[#2d2d2d] text-white transition-all hover:shadow-2xl heroBanner"
            style={{
              backgroundImage: `url(${gameShow.cover})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <motion.img
              variants={GameTitleVariants}
              key={gameShow.name}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.2,
                ease: "easeInOut",
                delay: 0.4,
              }}
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
            <Button
              onClick={() => handleAddGameToCart(gameShow)}
              label="Adicionar ao carrinho"
              className="z-10 transition-all"
              style="tertiary"
            />
          </motion.div>
        </div>
        <div className="w-1/5 flex items-center justify-between flex-col min-h-[750px]">
          {games.map((game) => (
            <div
              onClick={() => handleGameClick(game)}
              className={classNames(
                "w-full cursor-pointer px-8 py-4 rounded-[8px] flex items-center justify-between flex-row gap-2 hover:bg-[#292929] transition-all",
                gameShow.name === game.name && "bg-[#292929]"
              )}
            >
              <img
                src={game.banner}
                alt={game.name}
                className="w-1/4 rounded-[8px]"
              />
              <p className="w-2/3 text-center text-white">{game.name}</p>
            </div>
          ))}
        </div>
      </div>
    </LimitScreen>
  );
}
