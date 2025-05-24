import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditAddress } from '../../types/address.types';
import Input from '../input/Input';
import Select from '../select/Select';
import { countryId } from '../../services/registration.service';
import { BillingAddressModal } from '../../schemas/aditAddressSchema';

interface BillingAddressFormProps {
  formData?: EditAddress;
  address?: EditAddress;
  isDisabled: boolean;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<BillingAddressModal>;
  errors: FieldErrors<BillingAddressModal>;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  formData,
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
        name="billing_country"
        value={address ? address.billing_country : formData ? formData.billing_country : ''}
        required={true}
        disabled={isDisabled}
        optionsList={countryId}
        autoComplete="country"
      />

      <Input
        labelText="City"
        name="billing_city"
        id="billing_city"
        onChange={onAddressChange}
        placeholder="New York"
        value={address ? address.billing_city : formData ? formData.billing_city : ''}
        disabled={isDisabled}
        register={register}
        error={errors.billing_city}
        autoComplete="address-level2"
      />

      <Input
        labelText="Street"
        name="billing_street"
        id="billing_street"
        onChange={onAddressChange}
        placeholder="123 Main St"
        value={address ? address.billing_street : formData ? formData.billing_street : ''}
        disabled={isDisabled}
        register={register}
        error={errors.billing_street}
        autoComplete="street-address"
      />

      <Input
        labelText="Postal Code"
        name="billing_postalCode"
        id="billing_postalCode"
        onChange={onAddressChange}
        placeholder="10001"
        value={address ? address.billing_postalCode : formData ? formData.billing_postalCode : ''}
        disabled={isDisabled}
        register={register}
        error={errors.billing_postalCode}
        autoComplete="postal-code"
      />

      <Input
        labelText="Set as default billing address for future orders"
        type="checkbox"
        id="default_billing"
        name="billing_isDefault"
        checked={
          address ? address.billing_isDefault : formData ? formData.billing_isDefault : false
        }
        onChange={onDefaultAddressChange}
        disabled={isDisabled}
        register={register}
        error={errors.billing_isDefault}
      />
    </>
  );
};

export default BillingAddressForm;
