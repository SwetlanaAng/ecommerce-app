import { useState } from 'react';
import Button from '../button/Button';
import { Modal } from '../modal/Modal';
import { EditBillingAddressesContent } from '../modal/modal-content/edit-billing-addresses/EditBillingContent';
import { InfoBox } from '../profile-info-box/InfoBox';

interface AddressBoxProps {
  addressNumber: number;
  addressType: string;
  country: string | undefined;
  city: string | undefined;
  street: string | undefined;
  postalCode: string | undefined;
  defaultId: string;
  addressId: string | undefined;
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
          children=<EditBillingAddressesContent id={addressNumber}></EditBillingAddressesContent>
        ></Modal>
        {defaultId === addressId && (
          <div className="default">{`This address is set as default ${addressType} address`} </div>
        )}
      </div>
    </>
  );
};
