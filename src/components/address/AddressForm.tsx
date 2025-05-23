import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditAddress } from '../../types/address.types';
import Input from '../input/Input';
import Select from '../select/Select';
import { countryId } from '../../services/registration.service';
import { FormFields } from '../../schemas/signInSchema';
import { EditAddressModal } from '../../schemas/aditAddressSchema';

interface AddressFormProps {
  formData?: EditAddress;
  type: 'billing' | 'shipping';
  address?: EditAddress;
  isDisabled: boolean;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<FormFields | EditAddressModal>;
  errors: FieldErrors<FormFields | EditAddressModal>;
}

const AddressForm: React.FC<AddressFormProps> = ({
  formData,
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
        value={address ? address[`${type}_country`] : formData ? formData[`${type}_country`] : ''}
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
        placeholder="New York"
        value={address ? address[`${type}_city`] : formData ? formData[`${type}_city`] : ''}
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
        placeholder="123 Main St"
        value={address ? address[`${type}_street`] : formData ? formData[`${type}_street`] : ''}
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
        placeholder="10001"
        value={
          address ? address[`${type}_postalCode`] : formData ? formData[`${type}_postalCode`] : ''
        }
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
        checked={
          address ? address[`${type}_isDefault`] : formData ? formData[`${type}_isDefault`] : false
        }
        onChange={onDefaultAddressChange}
        disabled={isDisabled}
        register={register}
        error={errors[`${type}_isDefault`]}
      />
    </>
  );
};

export default AddressForm;
