import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Button from '../../../button/Button';
import './AddNewAddressContent.css';
import { EditAddressModal } from '../../../../schemas/editAddressSchema';
import { useNewAddressForm } from '../../../../features/auth/hooks/useNewAddressForm';
import Select from '../../../select/Select';
import { countryId } from '../../../../services/registration.service';
import Input from '../../../input/Input';
import { Address } from '../../../../types/address.types';

interface AddNewAddressFormProps {
  formData: Address;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isDisabled: boolean;
  register: UseFormRegister<EditAddressModal>;
  errors: FieldErrors<EditAddressModal>;
  type: string;
}

export const AddNewAddressContent: React.FC<AddNewAddressFormProps> = ({
  formData,
  isDisabled,
  onChange,
  register,
  errors,
  type,
}) => {
  const { handleSubmit } = useNewAddressForm();
  const onSubmit = () => {};
  return (
    <div className="add-address">
      <h3>{`Add new ${type} address`}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="add-address-form">
        <Select
          labelText="Country"
          className="select"
          onChange={onChange}
          name={`${type}_country`}
          value={formData.country}
          required={true}
          disabled={isDisabled}
          optionsList={countryId}
          autoComplete="country"
        />

        <Input
          labelText="City"
          name={`city`}
          id={`${type}_city`}
          onChange={onChange}
          placeholder="New York"
          value={formData.city}
          disabled={isDisabled}
          register={register}
          error={errors.city}
          autoComplete="address-level2"
        />

        <Input
          labelText="Street"
          name={`street`}
          id={`${type}_street`}
          onChange={onChange}
          placeholder="123 Main St"
          value={formData.street}
          disabled={isDisabled}
          register={register}
          error={errors.street}
          autoComplete="street-address"
        />

        <Input
          labelText="Postal Code"
          name={`postalCode`}
          id={`${type}_postalCode`}
          onChange={onChange}
          placeholder="10001"
          value={formData.postalCode}
          disabled={isDisabled}
          register={register}
          error={errors.postalCode}
          autoComplete="postal-code"
        />

        <Input
          labelText={`Set as default ${type} address for future orders`}
          type="checkbox"
          id={`default_${type}`}
          name={`isDefault`}
          checked={formData.isDefault}
          onChange={onChange}
          disabled={isDisabled}
          register={register}
          error={errors[`isDefault`]}
        />
        <Button className="submit-button " type="submit">
          Save new address
        </Button>
      </form>
    </div>
  );
};
