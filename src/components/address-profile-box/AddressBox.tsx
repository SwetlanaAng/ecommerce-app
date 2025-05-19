import { useState } from 'react';
import Button from '../button/Button';
import { Modal } from '../modal/Modal';
import { EditAddressesContent } from '../modal/modal-content/edit-addresses/EditAddressesContent';
import { InfoBox } from '../profile-info-box/InfoBox';
import { useEditAddressForm } from '../../features/auth/hooks/useEditAddressForm';

interface AddressBoxProps {
  addressNumber: number;
  addressType: 'billing' | 'shipping';
  country: string;
  city: string;
  street: string;
  postalCode: string;
  defaultId: string;
  addressId: string;
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
}: AddressBoxProps) => {
  const [modalIsOpen, setModalOpen] = useState(false);
  const addressData = {
    country: country,
    city: city,
    street: street,
    postalCode: postalCode,
    isDefault: defaultId === addressId,
  };
  const { errors, isSubmitting, register, handleChange } = useEditAddressForm(addressData);
  return (
    <>
      <div className="address-information-container">
        <p>{`Address #${addressNumber + 1}`}</p>
        <Button className="edit-pen" onClick={() => setModalOpen(true)}>
          Edit
        </Button>

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
        <Modal
          isOpen={modalIsOpen}
          onClose={() => setModalOpen(false)}
          children=<EditAddressesContent
            //сюда передать функцию которая будет закрывать окгно
            addressType={addressType}
            id={addressNumber}
            isDisabled={isSubmitting}
            onChange={handleChange}
            register={register}
            errors={errors}
          ></EditAddressesContent>
        ></Modal>
        {defaultId === addressId && (
          <div className="default">{`This address is set as default ${addressType} address`} </div>
        )}
      </div>
    </>
  );
};
