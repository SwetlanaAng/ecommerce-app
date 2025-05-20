import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Button from '../../../button/Button';

import { editAddressModal } from '../../../../schemas/editAddressSchema';
import { useNewAddressForm } from '../../../../features/auth/hooks/useNewAddressForm';
import AddressForm from '../../../address/AddressForm';

interface AddNewAddressFormProps {
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<editAddressModal>;
  errors: FieldErrors<editAddressModal>;
}

export const AddNewAddressContent: React.FC<AddNewAddressFormProps> = ({
  isDisabled,
  onChange,
  register,
  errors,
}) => {
  const { handleSubmit, formData, handleAddressChange } = useNewAddressForm();
  const onSubmit = () => {};
  return (
    <div className="add-address">
      <form onSubmit={handleSubmit(onSubmit)} className="add-address-form">
        <AddressForm
          type="billing"
          address={formData}
          isDisabled={isDisabled}
          onAddressChange={handleAddressChange}
          onDefaultAddressChange={onChange}
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
