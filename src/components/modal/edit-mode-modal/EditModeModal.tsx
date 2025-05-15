import { useState } from 'react';
import Button from '../../button/Button';
import './EditModeModal.css';
import { ChangePasswordContent } from '../modal-content/change-password/ChangePasswordContent';
import { EditPersonalInformationContent } from '../modal-content/edit-personal-info/EditPersonalInformationContent';
import { EditBillingAddressesContent } from '../modal-content/edit-billing-addresses/EditBillingContent';

export const EditModeModal = () => {
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [changePersonalInfoMode, setChangePersonalInfoMode] = useState(false);
  const [changeBillingAddressMode, setChangeBillingAddressMode] = useState(false);
  function onClickPersonal() {
    setChangePasswordMode(false);
    setChangePersonalInfoMode(true);
    setChangeBillingAddressMode(false);
  }
  function onClickPassword() {
    setChangePasswordMode(true);
    setChangePersonalInfoMode(false);
    setChangeBillingAddressMode(false);
  }
  function onClickBilling() {
    setChangePasswordMode(false);
    setChangePersonalInfoMode(false);
    setChangeBillingAddressMode(true);
  }
  if (changePasswordMode) {
    return <ChangePasswordContent></ChangePasswordContent>;
  }
  if (changePersonalInfoMode) {
    return <EditPersonalInformationContent></EditPersonalInformationContent>;
  }
  if (changeBillingAddressMode) {
    return <EditBillingAddressesContent></EditBillingAddressesContent>;
  }

  return (
    <div className="edit-mode">
      <h3>Please select what information you would like to edit.</h3>
      <Button className="edit" onClick={onClickPersonal}>
        Edit personal information
      </Button>
      <Button className="edit" onClick={onClickBilling}>
        Edit billing addresses
      </Button>
      <Button className="edit">Edit shipping addresses</Button>
      <Button className="edit" onClick={onClickPassword}>
        Change password
      </Button>
    </div>
  );
};
