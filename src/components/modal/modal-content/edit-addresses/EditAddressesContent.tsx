import Button from '../../../button/Button';
import { useEffect, useState } from 'react';
import './EditAddressesContent.css';
import { getCustomer } from '../../../../services/profile.service';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Select from '../../../select/Select';
import { countryId } from '../../../../services/registration.service';
import Input from '../../../input/Input';
import { ProfileAddressData } from '../../../../types/interfaces';
import { EditAddressModal } from '../../../../schemas/editAddressSchema';
import { useEditAddressForm } from '../../../../features/auth/hooks/useEditAddressForm';
import { Address } from '../../../../types/address.types';

type EditAddressProps = {
  id: number;
  addressType: 'billing' | 'shipping';
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  register: UseFormRegister<EditAddressModal>;
  errors: FieldErrors<EditAddressModal>;
};
export const EditAddressesContent = ({
  id,
  addressType,
  isDisabled,
  onChange,
  register,
  errors,
}: EditAddressProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<Address>({
    country: '',
    city: '',
    street: '',
    postalCode: '',
    isDefault: false,
  });
  const [addressesArray, setAddressesArray] = useState<ProfileAddressData[]>([]);
  const [defaultId, setDefaultId] = useState<string | undefined>(undefined);

  const onSubmit = () => {};
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const {
          addresses,
          billingAddressIds,
          defaultBillingAddressId,
          shippingAddressIds,
          defaultShippingAddressId,
        } = await getCustomer();
        let addressList = [];
        if (addressType === 'billing') {
          addressList = addresses.filter(address => billingAddressIds.includes(address.id));
          setDefaultId(defaultBillingAddressId);
        } else {
          addressList = addresses.filter(address => shippingAddressIds.includes(address.id));
          setDefaultId(defaultShippingAddressId);
        }
        const isDefault = addressList[id].id === defaultId ? true : false;
        setForm({
          country: addressList[id].country,
          city: addressList[id].city,
          street: addressList[id].streetName,
          postalCode: addressList[id].postalCode,
          isDefault: isDefault,
        });
        setAddressesArray(addressList);
      } catch (err) {
        setError(
          `Error loading profile information. ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomerData();
  }, [id, addressType, defaultId]);
  console.log(form);
  const { handleSubmit, formData } = useEditAddressForm(form);
  if (error) {
    return (
      <div className={`edit-${addressType}`}>
        <p>{error}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className={`edit-${addressType}`}>
        <p>Loading personal information...</p>
      </div>
    );
  }

  return (
    <div className={`edit-${addressType}`}>
      <h3>{`Edit ${addressType} address`}</h3>
      <form className={`edit-${addressType}-form`} onSubmit={handleSubmit(onSubmit)}>
        {addressesArray.length === 0 ? (
          <p>{`No existing ${addressType} addresses found`}</p>
        ) : (
          <>
            <Select
              labelText="Country"
              className="select"
              name={`${addressType}_country`}
              value={formData.country}
              onChange={onChange}
              required={true}
              disabled={isDisabled}
              optionsList={countryId}
              autoComplete="country"
            />
            <Input
              labelText="City"
              name={`city`}
              id={`${addressType}_city`}
              value={formData.city}
              onChange={onChange}
              disabled={isDisabled}
              register={register}
              error={errors[`city`]}
              autoComplete="address-level2"
            ></Input>
            <Input
              labelText="Street"
              name={`street`}
              id={`${addressType}_street`}
              value={formData.street}
              onChange={onChange}
              disabled={isDisabled}
              register={register}
              error={errors[`street`]}
              autoComplete="street-address"
            ></Input>
            <Input
              labelText="Postal Code"
              name={`postalCode`}
              value={formData.postalCode}
              onChange={onChange}
              id={`${addressType}_postalCode`}
              disabled={isDisabled}
              register={register}
              error={errors[`postalCode`]}
              autoComplete="postal-code"
            ></Input>
            <Input
              labelText={`Set as default ${addressType} address for future orders`}
              type="checkbox"
              name={`isDefault`}
              id={`${addressType}_isDefault`}
              onChange={onChange}
              disabled={isDisabled}
              register={register}
              error={errors[`isDefault`]}
              checked={defaultId && addressesArray[id].id === defaultId ? true : false}
            ></Input>
          </>
        )}
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
        <Button children="Delete this address"></Button>
      </form>
    </div>
  );
};
