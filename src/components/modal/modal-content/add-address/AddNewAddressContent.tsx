import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import Button from '../../../button/Button';
import './AddNewAddressContent.css';
import Select from '../../../select/Select';
import { countryId } from '../../../../services/registration.service';
import Input from '../../../input/Input';
import { AddAddress } from '../../../../types/address.types';
import { AddAddressModal } from '../../../../schemas/addAddressSchema';

interface AddNewAddressFormProps {
  formData: AddAddress;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isDisabled: boolean;
  register: UseFormRegister<AddAddressModal>;
  errors: FieldErrors<AddAddressModal>;
  type: 'billing' | 'shipping';
  handleSubmit?: (
    onSubmit: SubmitHandler<AddAddressModal>
  ) => (e: React.BaseSyntheticEvent) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddNewAddressContent: React.FC<AddNewAddressFormProps> = ({
  formData,
  isDisabled,
  onChange,
  register,
  errors,
  type,
  onSuccess,
  handleSubmit,
}) => {
  const onSubmit = () => {
    console.log('close');
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
        <Select
          labelText="Country"
          className="select"
          onChange={onChange}
          name={`${type}_country`}
          value={formData[`${type}_country`]}
          required={true}
          disabled={isDisabled}
          optionsList={countryId}
          autoComplete="country"
        />

        <Input
          labelText="City"
          name={`${type}_city`}
          id={`${type}_city`}
          onChange={onChange}
          placeholder="New York"
          value={formData[`${type}_city`]}
          disabled={isDisabled}
          register={register}
          error={errors[`${type}_city`]}
          autoComplete="address-level2"
        />

        <Input
          labelText="Street"
          name={`${type}_street`}
          id={`${type}_street`}
          onChange={onChange}
          placeholder="123 Main St"
          value={formData[`${type}_street`]}
          disabled={isDisabled}
          register={register}
          error={errors[`${type}_street`]}
          autoComplete="street-address"
        />

        <Input
          labelText="Postal Code"
          name={`${type}_postalCode`}
          id={`${type}_postalCode`}
          onChange={onChange}
          placeholder="10001"
          value={formData[`${type}_postalCode`]}
          disabled={isDisabled}
          register={register}
          error={errors[`${type}_postalCode`]}
          autoComplete="postal-code"
        />

        <Input
          labelText={`Set as default ${type} address for future orders`}
          type="checkbox"
          id={`default_${type}`}
          name={`${type}_isDefault`}
          checked={formData[`${type}_isDefault`]}
          onChange={onChange}
          disabled={isDisabled}
          register={register}
          error={errors[`${type}_isDefault`]}
        />
        <Button className="submit-button " type="submit">
          Save new address
        </Button>
      </form>
    </div>
  );
};
