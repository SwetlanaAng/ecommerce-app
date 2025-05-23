import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import Button from '../../../button/Button';
import './AddNewAddressContent.css';
import { EditAddress } from '../../../../types/address.types';
import { EditAddressModal } from '../../../../schemas/aditAddressSchema';
import AddressForm from '../../../address/AddressForm';

interface AddNewAddressFormProps {
  formData: EditAddress;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
  register: UseFormRegister<EditAddressModal>;
  errors: FieldErrors<EditAddressModal>;
  type: 'billing' | 'shipping';
  handleSubmit?: (
    onSubmit: SubmitHandler<EditAddressModal>
  ) => (e: React.BaseSyntheticEvent) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddNewAddressContent: React.FC<AddNewAddressFormProps> = ({
  formData,
  isDisabled,
  onChange,
  onDefaultAddressChange,
  register,
  errors,
  type,
  onSuccess,
  handleSubmit,
}) => {
  const onSubmit = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="add-address">
      <h3>{`Add new ${type} address`}</h3>
      <form
        onSubmit={handleSubmit ? handleSubmit(onSubmit) : e => e.preventDefault()}
        className="add-address-form"
      >
        <AddressForm
          formData={formData}
          type={type}
          isDisabled={isDisabled}
          onAddressChange={onChange}
          onDefaultAddressChange={onDefaultAddressChange}
          register={register}
          errors={errors}
        ></AddressForm>
        <Button className="submit-button " type="submit">
          Save new address
        </Button>
      </form>
    </div>
  );
};
