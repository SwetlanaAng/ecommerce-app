import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import Button from '../../../button/Button';
import './AddNewAddressContent.css';
import { BillingAddressModal, ShippingAddressModal } from '../../../../schemas/aditAddressSchema';
import BillingAddressForm from '../../../address/BillingAddressForm';
import ShippingAddressForm from '../../../address/ShippingAddressForm';

interface BaseAddressFormProps {
  isDisabled: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface BillingAddressFormProps extends BaseAddressFormProps {
  type: 'billing';
  formData: BillingAddressModal;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<BillingAddressModal>;
  errors: FieldErrors<BillingAddressModal>;
  handleSubmit?: (
    onSubmit: SubmitHandler<BillingAddressModal>
  ) => (e: React.BaseSyntheticEvent) => void;
}

interface ShippingAddressFormProps extends BaseAddressFormProps {
  type: 'shipping';
  formData: ShippingAddressModal;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDefaultAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<ShippingAddressModal>;
  errors: FieldErrors<ShippingAddressModal>;
  handleSubmit?: (
    onSubmit: SubmitHandler<ShippingAddressModal>
  ) => (e: React.BaseSyntheticEvent) => void;
}

type AddNewAddressFormProps = BillingAddressFormProps | ShippingAddressFormProps;

export const AddNewAddressContent: React.FC<AddNewAddressFormProps> = props => {
  const onSubmit = () => {
    if (props.onSuccess) {
      props.onSuccess();
    }
  };

  return (
    <div className="add-address">
      <h3>{`Add new ${props.type} address`}</h3>
      <form
        onSubmit={props.handleSubmit ? props.handleSubmit(onSubmit) : e => e.preventDefault()}
        className="add-address-form"
      >
        {props.type === 'billing' ? (
          <BillingAddressForm
            formData={props.formData}
            isDisabled={props.isDisabled}
            onAddressChange={props.onChange}
            onDefaultAddressChange={props.onDefaultAddressChange}
            register={props.register}
            errors={props.errors}
          />
        ) : (
          <ShippingAddressForm
            formData={props.formData}
            isDisabled={props.isDisabled}
            onAddressChange={props.onChange}
            onDefaultAddressChange={props.onDefaultAddressChange}
            register={props.register}
            errors={props.errors}
          />
        )}
        <Button className="submit-button " type="submit">
          Save new address
        </Button>
      </form>
    </div>
  );
};
