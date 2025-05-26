import Button from '../../../button/Button';
import './EditAddressesContent.css';
import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import { Address } from '../../../../types/address.types';
import BillingAddressForm from '../../../address/BillingAddressForm';
import ShippingAddressForm from '../../../address/ShippingAddressForm';
import { BillingAddressModal, ShippingAddressModal } from '../../../../schemas/aditAddressSchema';
import { deleteBillingAddress, deleteShippingAddress } from '../../../../services/profile.service';
import { toast } from 'react-toastify';

interface BaseEditAddressProps {
  id: number;
  isDisabled: boolean;
  addressData: Address;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface BillingEditAddressProps extends BaseEditAddressProps {
  addressType: 'billing';
  formData: BillingAddressModal;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<BillingAddressModal>;
  errors: FieldErrors<BillingAddressModal>;
  handleSubmit?: (
    onSubmit: SubmitHandler<BillingAddressModal>
  ) => (e: React.BaseSyntheticEvent) => void;
}

interface ShippingEditAddressProps extends BaseEditAddressProps {
  addressType: 'shipping';
  formData: ShippingAddressModal;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<ShippingAddressModal>;
  errors: FieldErrors<ShippingAddressModal>;
  handleSubmit?: (
    onSubmit: SubmitHandler<ShippingAddressModal>
  ) => (e: React.BaseSyntheticEvent) => void;
}

type EditAddressProps = BillingEditAddressProps | ShippingEditAddressProps;

export const EditAddressesContent = (props: EditAddressProps) => {
  const onSubmit: SubmitHandler<ShippingAddressModal | BillingAddressModal> = async data => {
    console.log(data);
    console.log(props.id);

    if (props.onSuccess) {
      props.onSuccess();
    }
  };
  const deleteBilling = async () => {
    try {
      await deleteBillingAddress(props.id);
      if (props.onSuccess) {
        props.onSuccess();
        toast.success('Billing address removed successfully!');
      }
    } catch {
      toast.error(`Failed to remove billing address`);
    }
  };
  const deleteShipping = async () => {
    try {
      await deleteShippingAddress(props.id);
      if (props.onSuccess) {
        props.onSuccess();
        toast.success('Shipping address removed successfully!');
      }
    } catch {
      toast.error(`Failed to remove shipping address`);
    }
  };
  return (
    <div className={`edit-${props.addressType}`}>
      <h3>{`Edit ${props.addressType} address`}</h3>
      <form
        className={`edit-${props.addressType}-form`}
        onSubmit={props.handleSubmit ? props.handleSubmit(onSubmit) : e => e.preventDefault()}
      >
        {props.addressType === 'billing' ? (
          <BillingAddressForm
            formData={props.formData}
            address={props.addressData}
            isDisabled={props.isDisabled}
            onAddressChange={props.onChange}
            onDefaultAddressChange={props.onDefaultAddressChange}
            register={props.register}
            errors={props.errors}
          />
        ) : (
          <ShippingAddressForm
            formData={props.formData}
            address={props.addressData}
            isDisabled={props.isDisabled}
            onAddressChange={props.onChange}
            onDefaultAddressChange={props.onDefaultAddressChange}
            register={props.register}
            errors={props.errors}
          />
        )}
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
        <Button
          onClick={props.addressType === 'billing' ? deleteBilling : deleteShipping}
          children="Delete this address"
        ></Button>
      </form>
    </div>
  );
};
