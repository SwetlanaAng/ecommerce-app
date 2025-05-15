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
}: AddressBoxProps) => (
  <>
    <p>{`Address #${addressNumber + 1}`}</p>

    <InfoBox className={`${addressType}-country`} spanText="Country: " infoText={country}></InfoBox>

    <InfoBox className={`${addressType}-city`} spanText="City: " infoText={city}></InfoBox>

    <InfoBox className={`${addressType}-street`} spanText="Street : " infoText={street}></InfoBox>

    <InfoBox
      className={`${addressType}-postal-code`}
      spanText="Postal code: "
      infoText={postalCode}
    ></InfoBox>

    {defaultId === addressId && (
      <div className="default">{`This address is set as default ${addressType} address`} </div>
    )}
  </>
);
