import Button from '../../../button/Button';
import './EditAddressesContent.css';
import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import { Address } from '../../../../types/address.types';
import BillingAddressForm from '../../../address/BillingAddressForm';
import ShippingAddressForm from '../../../address/ShippingAddressForm';
import { BillingAddressModal, ShippingAddressModal } from '../../../../schemas/aditAddressSchema';
import {
  EditBillingAddress,
  EditShippingAddress,
  deleteAddress,
} from '../../../../services/profile.service';
import { toast } from 'react-toastify';

interface BaseEditAddressProps {
  addressId: string;
  isDisabled: boolean;
  addressData: Address;
  onSuccess?: () => void;
  onCancel?: () => void;
  refresh: () => Promise<void>;
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
  const onBillingSubmit: SubmitHandler<BillingAddressModal> = async data => {
    try {
      await EditBillingAddress(props.addressId, data);
      if (props.onSuccess) {
        props.onSuccess();
        props.refresh();
        toast.success('Address edited successfully!');
      }
    } catch {
      toast.error(`Failed to edit address`);
    }
  };
  const onShippingSubmit: SubmitHandler<ShippingAddressModal> = async data => {
    try {
      await EditShippingAddress(props.addressId, data);
      if (props.onSuccess) {
        props.onSuccess();
        props.refresh();
        toast.success('Address edited successfully!');
      }
    } catch {
      toast.error(`Failed to edit address`);
    }
  };
  const deleteAddressData = async () => {
    try {
      await deleteAddress(props.addressId);
      if (props.onSuccess) {
        props.onSuccess();
        props.refresh();
        toast.success('Address removed successfully!');
      }
    } catch {
      toast.error(`Failed to remove address`);
    }
  };

  return (
    <div className={`edit-${props.addressType}`}>
      <h3>{`Edit ${props.addressType} address`}</h3>
      <form
        className={`edit-${props.addressType}-form`}
        onSubmit={
          props.handleSubmit
            ? props.addressType === 'billing'
              ? props.handleSubmit(onBillingSubmit)
              : props.handleSubmit(onShippingSubmit)
            : e => e.preventDefault()
        }
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
        <Button onClick={deleteAddressData} children="Delete this address"></Button>
      </form>
    </div>
  );
};
