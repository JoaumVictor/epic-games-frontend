import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/button";
import { formatterCurrency, isLuhnValid } from "@/utils/shared";
import { IoCloseOutline } from "react-icons/io5";
import Input from "@/components/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { creditCardsProps } from "@/components/creditCardDropdown";
import { FaCreditCard } from "react-icons/fa";
import { useCart } from "@/context/cart";
import { useCreditCard } from "@/context/creditCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: selectedPaymentMethodType;
  selectedCard?: creditCardsProps;
  value: number;
}

type selectedPaymentMethodType =
  | "pix"
  | "creditCard"
  | "boleto"
  | "paypal"
  | "userCreditCard";

interface handleNewCreditCardPaymentProps {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardholderName: string;
}

const PaymentModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  selectedCard,
  value,
}) => {
  const { state } = useCart();
  const { addCreditCard, removeCreditCard } = useCreditCard();

  const validationSchema = Yup.object({
    cardNumber: Yup.string()
      .required("Número do cartão é obrigatório")
      .length(16, "Número do cartão deve conter exatamente 16 dígitos")
      .transform((value) => value.replace(/\s/g, "").replace(/-/g, ""))
      .matches(/^[0-9]+$/, "Número do cartão inválido, use apenas números")
      .test(
        "luhnCheck",
        "Número do cartão inválido",
        (value) => !isLuhnValid(value.replace(/\s/g, ""))
      ),

    expirationDate: Yup.string()
      .required("Data de validade é obrigatória")
      .matches(/^(0[1-9]|1[0-2])\d{2}$/, "Data inválida. Formato aceito: MM/YY")
      .test("isValidDate", "Data inválida ou expirada", (value) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const month = parseInt(value.slice(0, 2), 10);
        const year = parseInt(`20${value.slice(2)}`, 10);

        return (
          (year > currentYear ||
            (year === currentYear && month >= currentMonth)) &&
          parseInt(String(month), 10) >= 1 &&
          parseInt(String(month), 10) <= 12
        );
      }),

    cvv: Yup.string()
      .required("CVV é obrigatório")
      .matches(/^\d{3,4}$/, "CVV inválido"),

    cardholderName: Yup.string()
      .matches(
        /^[a-zA-Z\u00C0-\u017F\s]+$/,
        "Nome do titular não deve conter números ou caracteres especiais"
      )
      .min(3, "Nome do titular deve conter no mínimo 3 caracteres")
      .max(35, "Nome do titular deve conter no máximo 35 caracteres")
      .required("Nome do titular é obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      cardholderName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => handleNewCreditCardPayment(values),
  });

  const modalContent = {
    userCreditCard: (
      <div className="flex flex-col items-start justify-center gap-3 px-4 py-3 sm:px-6">
        <p className="mb-5 text-xl text-black">
          Pagamento via cartão de crédito ou débito
        </p>
        <div className="flex items-center justify-center w-full gap-3">
          <FaCreditCard className="text-black text-[36px]" />
          <div className="flex items-center justify-between w-full gap-3 mb-1">
            <p className="text-black text-[14px] mr-10">
              {selectedCard?.label}
            </p>
            <p className="text-black">{selectedCard?.number}</p>
          </div>
        </div>
        <div className="flex items-center justify-start w-full gap-3">
          <p className="text-black text-[20px] mr-10">
            {selectedCard?.name.toUpperCase()}
          </p>
        </div>
        <p className="text-[#7b7b7b] text-[14px] my-5">
          Ao prosseguir, você confirma que é adulto de acordo com a legislação
          do seu país/estado e que concorda com nossos termos de serviço.
        </p>
      </div>
    ),
    creditCard: (
      <div className="flex flex-col items-start justify-center gap-3 px-4 py-3 sm:px-6">
        <p className="text-xl text-black">
          Pagamento via cartão de crédito ou débito
        </p>
        <Input
          id="cardholderName"
          label="Nome do titular"
          name="cardholderName"
          mask=""
          placeholder="Nome do titular"
          formik={formik}
          onBlur={formik.handleBlur}
          touched={formik.touched.cardholderName}
          value={formik.values.cardholderName}
          error={formik.errors.cardholderName}
          className="w-full"
        />
        <Input
          id="cardNumber"
          label="Número do cartão"
          name="cardNumber"
          mask="**** **** **** ****"
          placeholder="0000 0000 0000 0000"
          formik={formik}
          onBlur={formik.handleBlur}
          touched={formik.touched.cardNumber}
          value={formik.values.cardNumber}
          error={formik.errors.cardNumber}
          className="w-full"
        />
        <div className="flex items-start justify-center w-full gap-2">
          <Input
            id="expirationDate"
            label="Data de validade"
            name="expirationDate"
            mask="**/**"
            placeholder="MM/YY"
            formik={formik}
            onBlur={formik.handleBlur}
            touched={formik.touched.expirationDate}
            value={formik.values.expirationDate}
            error={formik.errors.expirationDate}
            className="w-1/2"
          />
          <Input
            id="cvv"
            label="CVV"
            name="cvv"
            mask="***"
            placeholder="000"
            formik={formik}
            onBlur={formik.handleBlur}
            touched={formik.touched.cvv}
            value={formik.values.cvv}
            error={formik.errors.cvv}
            className="w-1/2"
          />
        </div>

        <p className="text-[#7b7b7b] text-[14px] my-5">
          Ao prosseguir, você confirma que é adulto de acordo com a legislação
          do seu país/estado e que concorda com nossos termos de serviço.
        </p>
      </div>
    ),
    pix: <></>,
    boleto: <></>,
    paypal: <></>,
  };

  const handleNewCreditCardPayment = (
    values: handleNewCreditCardPaymentProps
  ) => {
    // addCreditCard({})

    console.log("Pagamento via novo cartão do usuário", {
      type: "creditCard",
      formattedValue: formatterCurrency(value),
      value: value,
      products: state.cart,
      newCreditCard: values,
    });
  };

  const handleUserCreditCardPayment = () => {
    console.log(
      "Usuário faz a compra usando o cartão selecionado, detalhes do pagamento:",
      {
        type: "creditCard",
        formatedValue: formatterCurrency(value),
        value: value,
        products: state.cart,
        cardId: selectedCard?.id,
      }
    );
  };

  const buttonContent = {
    userCreditCard: (
      <Button
        label={`Pagar ${formatterCurrency(value)}`}
        style="finally"
        onClick={handleUserCreditCardPayment}
      />
    ),
    creditCard: (
      <Button
        label={`Pagar ${formatterCurrency(value)}`}
        style="finally"
        disabled={!formik.isValid}
        onClick={formik.handleSubmit}
      />
    ),
    pix: <></>,
    boleto: <></>,
    paypal: <></>,
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center w-full h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full mt-[10%] min-w-[400px]">
              <div
                onClick={() => {
                  onClose();
                  formik.resetForm();
                }}
                className="flex items-center justify-end w-full p-2"
              >
                <IoCloseOutline className="!text-black text-[36px] cursor-pointer" />
              </div>
              {modalContent[paymentMethod]}

              <div className="flex items-center justify-end w-full px-4 py-3 bg-gray-50 sm:px-6">
                {buttonContent[paymentMethod]}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PaymentModal;
