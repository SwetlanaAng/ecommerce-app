import { countryId } from '../../../../services/registration.service';
import Button from '../../../button/Button';
import Input from '../../../input/Input';
import Select from '../../../select/Select';

export const EditBillingAddressesContent = () => {
  return (
    //change rendering through mapping
    <div className="edit-billing">
      <form className="edit-billing-form">
        <Select
          labelText="Country"
          className="select"
          name="billing_country"
          value="US"
          required={true}
          disabled={false}
          optionsList={countryId}
          autoComplete="country"
        />
        <Input labelText="City" name="billing_city" id="billing_city"></Input>
        <Input labelText="Street" name="billing_street" id="billing_street"></Input>
        <Input labelText="Postal Code" name="billing_postalCode" id="billing_postalCode"></Input>
        <Input
          labelText="Set as default billing address for future orders"
          type="checkbox"
          name="billing_isDefault"
          id="billing_isDefaulth"
        ></Input>
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
        <Button children="Delete this address"></Button>
      </form>
      <Button children="Add new billing Address"></Button>
    </div>
  );
};
