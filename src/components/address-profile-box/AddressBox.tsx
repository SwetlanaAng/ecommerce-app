import { InfoBox } from '../profile-info-box/InfoBox';

interface AddressBoxProps {
  headingText: string;
  addressType: string;
  country: string | undefined;
  city: string | undefined;
  street: string | undefined;
  postalCode: string | undefined;
  defaultId: string;
  addressId: string | undefined;
}

export const AddressBox = ({
  headingText,
  addressType,
  country,
  city,
  street,
  postalCode,
  defaultId,
  addressId,
}: AddressBoxProps) => (
  <>
    <h3>{headingText}</h3>

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
