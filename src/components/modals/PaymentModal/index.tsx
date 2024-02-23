import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/button";
import { formatterCurrency } from "@/utils/shared";
import { IoCloseOutline } from "react-icons/io5";
import Input from "@/components/input";
import { useFormik } from "formik";
import * as Yup from "yup";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: selectedPaymentMethodType;
  value: number;
}

type selectedPaymentMethodType =
  | "pix"
  | "creditCard"
  | "boleto"
  | "paypal"
  | "userCreditCard";

const PaymentModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  value,
}) => {
  const validationSchema = Yup.object({
    cardNumber: Yup.string()
      .required("Número do cartão é obrigatório")
      .length(16, "Número do cartão deve conter exatamente 16 dígitos")
      .matches(/^\d+$/, "Número do cartão inválido"),

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
      .min(3, "Nome do titular deve conter no mínimo 3 caracteres")
      .max(25, "Nome do titular deve conter no máximo 25 caracteres")
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
    onSubmit: (values) => {
      if (paymentMethod === "creditCard") {
        console.log("Pagamento via novo cartão do usuário");
      } else {
        console.log("Pagamento via cartão já existente do usuário");
      }
      console.log(values);
    },
  });

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
                  Ao prosseguir, você confirma que é adulto de acordo com a
                  legislação do seu país/estado e que concorda com nossos termos
                  de serviço.
                </p>
              </div>
              <div className="flex items-center justify-end w-full px-4 py-3 bg-gray-50 sm:px-6">
                <Button
                  label={`Pagar ${formatterCurrency(value)}`}
                  style="finally"
                  disabled={!formik.isValid}
                  onClick={formik.handleSubmit}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PaymentModal;
