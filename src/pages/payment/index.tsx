/* eslint-disable react/style-prop-object */
import LimitScreen from "@/components/limitScreen";
import { useCart } from "@/context/cart";
import games from "@/mocks/games";
import { useEffect, useState } from "react";
import { formatterCurrency } from "@/utils/shared";
import Button from "@/components/button";
import CreditCardDropdown, {
  creditCardsProps,
} from "@/components/creditCardDropdown";
import { useCreditCard } from "@/context/creditCard";

export default function Payment() {
  const { state, dispatch, totalPriceInCart } = useCart();

  // TESTE PARA MOCKAR JOGOS NO CARRINHO
  useEffect(() => {
    dispatch({ type: "SET_MOCKED_GAMES", payload: games.slice(0, 3) });
  }, []);

  const [allCreditCards, setAllCreditCards] = useState<creditCardsProps[]>([]);

  const { creditCards } = useCreditCard();

  useEffect(() => {
    setSelectedCard(creditCards[0]);
    setAllCreditCards(creditCards);
  }, [creditCards]);

  const [selectedCard, setSelectedCard] = useState(allCreditCards[0]);

  const handleSelectCard = (selected: creditCardsProps) => {
    setSelectedCard(selected);
  };

  return (
    <main className="bg-white h-[100vh]">
      <LimitScreen className="px-10">
        <div className="flex items-start justify-center w-full gap-10">
          <div className="flex flex-col items-start justify-start w-7/12 gap-3 pt-10">
            <p className="mb-6 text-2xl text-black">Finalizar compra</p>
            <div className="bg-[#5069cf] w-full h-[4px] my-6" />
            <div className="w-full">
              <p className="my-4 text-xl text-black">
                Selecione um cartão de crédito
              </p>
              <CreditCardDropdown
                creditCards={allCreditCards}
                selectedCard={selectedCard}
                onSelectCard={handleSelectCard}
              />
            </div>
            <div className="bg-[#5069cf] w-full h-[4px] my-6" />
            <p className="my-4 text-xl text-black">
              Outros métodos de pagamento
            </p>
            <div className="bg-[#5069cf] w-full h-[4px] my-6" />
          </div>
          <div className="flex bg-[#f4f4f4] flex-col px-10 h-[100vh] items-end justify-start w-3/12 gap-3 pt-10">
            <p className="mb-10 text-2xl text-black text-end">
              Resumo do pedido
            </p>
            <div className="flex items-center justify-between w-full">
              <p className="text-black">Desconto</p>
              <p className="text-black">-R$ 0,00</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-black">Preço: </p>
              <span className="text-black">
                {formatterCurrency(totalPriceInCart(state.cart))}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="my-6 text-black">Subtotal: </p>
              <span className="text-[22px] text-black">
                {formatterCurrency(totalPriceInCart(state.cart))}
              </span>
            </div>
            <div>
              <Button
                style="finally"
                disabled={state.cart.length === 0}
                onClick={() => {}}
                label="Finalizar pedido"
              />
            </div>
          </div>
        </div>
      </LimitScreen>
    </main>
  );
}
