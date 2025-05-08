import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Address } from '../../types/address.types';
import Input from '../input/Input';
import Select from '../select/Select';
import { countryId } from '../../services/registration.service';
import { FormFields } from '../../schemas/signInSchema';

interface AddressFormProps {
  type: 'billing' | 'shipping';
  address: Address;
  isDisabled: boolean;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
}

const AddressForm: React.FC<AddressFormProps> = ({
  type,
  address,
  isDisabled,
  onAddressChange,
  onDefaultAddressChange,
  register,
  errors,
}) => {
  return (
    <>
      <Select
        labelText="Country"
        className="select"
        onChange={onAddressChange}
        name={`${type}_country`}
        value={address.country}
        required={true}
        disabled={isDisabled}
        optionsList={countryId}
        autoComplete="country"
      />

      <Input
        labelText="City"
        name={`${type}_city`}
        id={`${type}_city`}
        onChange={onAddressChange}
        placeholder="Madrid"
        value={address.city}
        disabled={isDisabled}
        register={register}
        error={errors[`${type}_city`]}
        autoComplete="address-level2"
      />

      <Input
        labelText="Street"
        name={`${type}_street`}
        id={`${type}_street`}
        onChange={onAddressChange}
        placeholder="Calle de la Princesa"
        value={address.street}
        disabled={isDisabled}
        register={register}
        error={errors[`${type}_street`]}
        autoComplete="street-address"
      />

      <Input
        labelText="Postal Code"
        name={`${type}_postalCode`}
        id={`${type}_postalCode`}
        onChange={onAddressChange}
        placeholder="28001"
        value={address.postalCode}
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
        checked={address.isDefault}
        onChange={onDefaultAddressChange}
        disabled={isDisabled}
        register={register}
        error={errors[`${type}_isDefault`]}
      />
    </>
  );
};

export default AddressForm;
