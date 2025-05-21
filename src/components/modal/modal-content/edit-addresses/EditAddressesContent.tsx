import Button from '../../../button/Button';
import './EditAddressesContent.css';
import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import Select from '../../../select/Select';
import { countryId } from '../../../../services/registration.service';
import Input from '../../../input/Input';
import { EditAddressModal } from '../../../../schemas/editAddressSchema';
import { Address } from '../../../../types/address.types';

type EditAddressProps = {
  id: number;
  formData: Address;
  handleSubmit?: (
    onSubmit: SubmitHandler<EditAddressModal>
  ) => (e: React.BaseSyntheticEvent) => void;
  addressType: 'billing' | 'shipping';
  isDisabled: boolean;
  addressData: Address;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  register: UseFormRegister<EditAddressModal>;
  errors: FieldErrors<EditAddressModal>;
  onSuccess?: () => void;
  onCancel?: () => void;
};
export const EditAddressesContent = ({
  id,
  addressType,
  formData,
  handleSubmit,
  isDisabled,
  onChange,
  register,
  errors,
  onSuccess,
}: EditAddressProps) => {
  console.log(id);
  const onSubmit = () => {
    if (onSuccess) {
      onSuccess();
    }
  };
  return (
    <div className={`edit-${addressType}`}>
      <h3>{`Edit ${addressType} address`}</h3>
      <form
        className={`edit-${addressType}-form`}
        onSubmit={handleSubmit ? handleSubmit(onSubmit) : e => e.preventDefault()}
      >
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
            checked={formData.isDefault ? true : false}
          ></Input>
        </>
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
        <Button children="Delete this address"></Button>
      </form>
    </div>
  );
};
