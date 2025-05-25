import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { AddressData } from '../../types/address.types';
import Input from '../input/Input';
import { FormFields } from '../../schemas/signInSchema';
import { BillingAddressModal, ShippingAddressModal } from '../../schemas/aditAddressSchema';
import BillingAddressForm from '../address/BillingAddressForm';
import ShippingAddressForm from '../address/ShippingAddressForm';

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
  const billingFormData: BillingAddressModal = {
    billing_city: addressData.billingAddress?.city || '',
    billing_street: addressData.billingAddress?.street || '',
    billing_postalCode: addressData.billingAddress?.postalCode || '',
    billing_isDefault: addressData.billingAddress?.isDefault || false,
  };

  const shippingFormData: ShippingAddressModal = {
    shipping_city: addressData.shippingAddress?.city || '',
    shipping_street: addressData.shippingAddress?.street || '',
    shipping_postalCode: addressData.shippingAddress?.postalCode || '',
    shipping_isDefault: addressData.shippingAddress?.isDefault || false,
  };

  return (
    <>
      <div className="form-card">
        <h4>Billing Address</h4>
        <BillingAddressForm
          formData={billingFormData}
          isDisabled={isDisabled}
          onAddressChange={onAddressChange}
          onDefaultAddressChange={onDefaultAddressChange}
          register={register as unknown as UseFormRegister<BillingAddressModal>}
          errors={errors as unknown as FieldErrors<BillingAddressModal>}
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
      </div>
      {!sameAsShipping && (
        <div className="form-card">
          <h4>Shipping Address</h4>
          <ShippingAddressForm
            formData={shippingFormData}
            isDisabled={isDisabled || sameAsShipping}
            onAddressChange={onAddressChange}
            onDefaultAddressChange={onDefaultAddressChange}
            register={register as unknown as UseFormRegister<ShippingAddressModal>}
            errors={errors as unknown as FieldErrors<ShippingAddressModal>}
          />
        </div>
      )}
    </>
  );
};

export default AddressSection;
