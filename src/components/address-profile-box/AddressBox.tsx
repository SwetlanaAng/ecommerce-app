import { useState } from 'react';
import Button from '../button/Button';
import { Modal } from '../modal/Modal';
import { EditAddressesContent } from '../modal/modal-content/edit-addresses/EditAddressesContent';
import { InfoBox } from '../profile-info-box/InfoBox';
import editIcon from '../../assets/pencil-edit-button-svgrepo-com.svg';
import {
  useBillingAddressForm,
  useShippingAddressForm,
} from '../../features/auth/hooks/useEditAddressForm';
import { Address } from '../../types/address.types';

interface AddressBoxProps {
  addressNumber: number;
  addressType: 'billing' | 'shipping';
  country: string;
  city: string;
  street: string;
  postalCode: string;
  defaultId: string;
  addressId: string;
  refresh: () => Promise<void>;
}

export const AddressBox = ({
  addressNumber,
  addressType,
  country,
  city,
  street,
  postalCode,
  defaultId,
  addressId,
  refresh,
}: AddressBoxProps) => {
  const [modalIsOpen, setModalOpen] = useState(false);
  const addressData: Address = {
    country: country,
    city: city,
    street: street,
    postalCode: postalCode,
    isDefault: defaultId === addressId,
  };

  const billingForm = useBillingAddressForm(addressData);
  const shippingForm = useShippingAddressForm(addressData);

  const renderEditContent = () => {
    if (addressType === 'billing') {
      return (
        <EditAddressesContent
          addressId={addressId}
          addressType="billing"
          formData={billingForm.formData}
          handleSubmit={billingForm.handleSubmit}
          addressData={addressData}
          isDisabled={billingForm.isSubmitting}
          onChange={billingForm.handleChange}
          onDefaultAddressChange={billingForm.handleChange}
          register={billingForm.register}
          errors={billingForm.errors}
          refresh={refresh}
          onSuccess={() => {
            setModalOpen(false);
          }}
        />
      );
    } else {
      return (
        <EditAddressesContent
          addressId={addressId}
          addressType="shipping"
          formData={shippingForm.formData}
          handleSubmit={shippingForm.handleSubmit}
          addressData={addressData}
          isDisabled={shippingForm.isSubmitting}
          onChange={shippingForm.handleChange}
          onDefaultAddressChange={shippingForm.handleChange}
          register={shippingForm.register}
          errors={shippingForm.errors}
          refresh={refresh}
          onSuccess={() => {
            setModalOpen(false);
          }}
        />
      );
    }
  };

  return (
    <>
      <div className="card">
        <h4>{`Address #${addressNumber + 1}`}</h4>
        {defaultId === addressId && (
          <div className="default">{`default ${addressType} address`} </div>
        )}
        <Button className="edit-pen" onClick={() => setModalOpen(true)}>
          <img src={editIcon} alt="edit" />
          Edit
        </Button>

        <div className="info-box-wrapper">
          <InfoBox
            className={`${addressType}-country`}
            spanText="Country: "
            infoText={country}
          ></InfoBox>

          <InfoBox className={`${addressType}-city`} spanText="City: " infoText={city}></InfoBox>

          <InfoBox
            className={`${addressType}-street`}
            spanText="Street : "
            infoText={street}
          ></InfoBox>

          <InfoBox
            className={`${addressType}-postal-code`}
            spanText="Postal code: "
            infoText={postalCode}
          ></InfoBox>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onClose={() => setModalOpen(false)}
          children={renderEditContent()}
        ></Modal>
      </div>
    </>
  );
};
