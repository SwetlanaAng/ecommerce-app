import Button from '../../../button/Button';
import { useEffect, useState } from 'react';
import './EditBillingContent.css';
import { getCustomer } from '../../../../services/profile.service';

import Select from '../../../select/Select';
import { countryId } from '../../../../services/registration.service';
import Input from '../../../input/Input';
import { ProfileAddressData } from '../../../../types/interfaces';

type EditBillingProps = {
  id: number;
};
export const EditBillingAddressesContent = ({ id }: EditBillingProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [billingAddresses, setBillingAddresses] = useState<ProfileAddressData[]>([]);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [defaultId, setDefaultId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const { addresses, billingAddressIds, defaultBillingAddressId } = await getCustomer();

        addresses.filter(address => {
          billingAddressIds.includes(address.id);
        });
        setCountry(addresses[id].country);
        setCity(addresses[id].city);
        setStreet(addresses[id].streetName);
        setPostalCode(addresses[id].postalCode);
        setDefaultId(defaultBillingAddressId);
        setBillingAddresses(addresses);
      } catch (err) {
        setError(
          `Error loading profile information. ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomerData();
  }, [id]);

  if (error) {
    return (
      <div className="edit-personal">
        <p>{error}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="edit-personal">
        <p>Loading personal information...</p>
      </div>
    );
  }

  return (
    <div className="edit-billing">
      <h3>Edit billing address</h3>
      <form className="edit-billing-form">
        {billingAddresses.length === 0 ? (
          <p>No existing billing addresses found</p>
        ) : (
          <>
            <Select
              labelText="Country"
              className="select"
              name="billing_country"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required={true}
              disabled={false}
              optionsList={countryId}
              autoComplete="country"
            />
            <Input
              labelText="City"
              name="billing_city"
              id="billing_city"
              value={city}
              onChange={e => setCity(e.target.value)}
            ></Input>
            <Input
              labelText="Street"
              name="billing_street"
              id="billing_street"
              value={street}
              onChange={e => setStreet(e.target.value)}
            ></Input>
            <Input
              labelText="Postal Code"
              name="billing_postalCode"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              id="billing_postalCode"
            ></Input>
            <Input
              labelText="Set as default billing address for future orders"
              type="checkbox"
              name="billing_isDefault"
              id="billing_isDefault"
              onChange={() => {
                if (defaultId) {
                  setDefaultId(undefined);
                } else setDefaultId(billingAddresses[id].id);
              }}
              checked={defaultId && billingAddresses[id].id === defaultId ? true : false}
            ></Input>
          </>
        )}
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
        <Button children="Delete this address"></Button>
      </form>
      <Button children="Add a new address"></Button>
    </div>
  );
};
