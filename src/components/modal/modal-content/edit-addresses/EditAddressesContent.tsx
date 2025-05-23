import Button from '../../../button/Button';
import './EditAddressesContent.css';
import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import { EditAddress, Address } from '../../../../types/address.types';
import AddressForm from '../../../address/AddressForm';
import { EditAddressModal } from '../../../../schemas/aditAddressSchema';

type EditAddressProps = {
  id: number;
  formData: EditAddress;
  handleSubmit?: (
    onSubmit: SubmitHandler<EditAddressModal>
  ) => (e: React.BaseSyntheticEvent) => void;
  addressType: 'billing' | 'shipping';
  isDisabled: boolean;
  addressData: Address;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  register: UseFormRegister<EditAddressModal>;
  errors: FieldErrors<EditAddressModal>;
  onSuccess?: () => void;
  onCancel?: () => void;
};
export const EditAddressesContent = ({
  id,
  addressType,
  formData,
  handleSubmit,
  isDisabled,
  onChange,
  register,
  errors,
  onSuccess,
}: EditAddressProps) => {
  console.log(id);
  const onSubmit = () => {
    if (onSuccess) {
      onSuccess();
    }
  };
  return (
    <div className={`edit-${addressType}`}>
      <h3>{`Edit ${addressType} address`}</h3>
      <form
        className={`edit-${addressType}-form`}
        onSubmit={handleSubmit ? handleSubmit(onSubmit) : e => e.preventDefault()}
      >
        <AddressForm
          formData={formData}
          type={addressType}
          isDisabled={isDisabled}
          onAddressChange={onChange}
          onDefaultAddressChange={onChange}
          register={register}
          errors={errors}
        ></AddressForm>
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
        <Button children="Delete this address"></Button>
      </form>
    </div>
  );
};
