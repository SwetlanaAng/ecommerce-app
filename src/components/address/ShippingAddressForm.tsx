import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditAddress } from '../../types/address.types';
import Input from '../input/Input';
import Select from '../select/Select';
import { countryId } from '../../services/registration.service';
import { ShippingAddressModal } from '../../schemas/aditAddressSchema';

interface ShippingAddressFormProps {
  formData?: EditAddress;
  address?: EditAddress;
  isDisabled: boolean;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<ShippingAddressModal>;
  errors: FieldErrors<ShippingAddressModal>;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
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
        name="shipping_country"

        value={address?.shipping_country || formData?.shipping_country || 'US'}

        required={true}
        disabled={isDisabled}
        optionsList={countryId}
        autoComplete="country"
      />

      <Input
        labelText="City"
        name="shipping_city"
        id="shipping_city"
        onChange={onAddressChange}
        placeholder="New York"
        value={address ? address.shipping_city : formData ? formData.shipping_city : ''}
        disabled={isDisabled}
        register={register}
        error={errors.shipping_city}
        autoComplete="address-level2"
      />

      <Input
        labelText="Street"
        name="shipping_street"
        id="shipping_street"
        onChange={onAddressChange}
        placeholder="123 Main St"
        value={address ? address.shipping_street : formData ? formData.shipping_street : ''}
        disabled={isDisabled}
        register={register}
        error={errors.shipping_street}
        autoComplete="street-address"
      />

      <Input
        labelText="Postal Code"
        name="shipping_postalCode"
        id="shipping_postalCode"
        onChange={onAddressChange}
        placeholder="10001"
        value={address ? address.shipping_postalCode : formData ? formData.shipping_postalCode : ''}
        disabled={isDisabled}
        register={register}
        error={errors.shipping_postalCode}
        autoComplete="postal-code"
      />

      <Input
        labelText="Set as default shipping address for future orders"
        type="checkbox"
        id="default_shipping"
        name="shipping_isDefault"
        checked={
          address ? address.shipping_isDefault : formData ? formData.shipping_isDefault : false
        }
        onChange={onDefaultAddressChange}
        disabled={isDisabled}
        register={register}
        error={errors.shipping_isDefault}
      />
    </>
  );
};

export default ShippingAddressForm;
