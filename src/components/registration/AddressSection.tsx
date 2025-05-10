import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { AddressData } from '../../types/address.types';
import Input from '../input/Input';
import AddressForm from '../address/AddressForm';
import { FormFields } from '../../schemas/signInSchema';

interface AddressSectionProps {
  addressData: AddressData;
  sameAsShipping: boolean;
  isDisabled: boolean;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSameAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  addressData,
  sameAsShipping,
  isDisabled,
  onAddressChange,
  onDefaultAddressChange,
  onSameAddressChange,
  register,
  errors,
}) => {
  return (
    <>
      <h2>Billing Address</h2>
      <AddressForm
        type="billing"
        address={addressData.billingAddress}
        isDisabled={isDisabled}
        onAddressChange={onAddressChange}
        onDefaultAddressChange={onDefaultAddressChange}
        register={register}
        errors={errors}
      />

      <Input
        labelText="Use same address for shipping"
        type="checkbox"
        name="sameAsShipping"
        id="sameAsShipping"
        checked={sameAsShipping}
        onChange={onSameAddressChange}
        disabled={isDisabled}
        register={register}
        error={errors.sameAsShipping}
      />

      {!sameAsShipping && (
        <>
          <h2>Shipping Address</h2>
          <AddressForm
            type="shipping"
            address={addressData.shippingAddress}
            isDisabled={isDisabled || sameAsShipping}
            onAddressChange={onAddressChange}
            onDefaultAddressChange={onDefaultAddressChange}
            register={register}
            errors={errors}
          />
        </>
      )}
    </>
  );
};

export default AddressSection;
