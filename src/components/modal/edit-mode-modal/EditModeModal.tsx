import { useState } from 'react';
import Button from '../../button/Button';
import './EditModeModal.css';
import { ChangePasswordContent } from '../modal-content/change-password/ChangePasswordContent';
import { EditPersonalInformationContent } from '../modal-content/edit-personal-info/EditPersonalInformationContent';

export const EditModeModal = () => {
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [changePersonalInfoMode, setChangePersonalInfoMode] = useState(false);
  function onClickPersonal() {
    setChangePasswordMode(false);
    setChangePersonalInfoMode(true);
  }
  function onClickPassword() {
    setChangePasswordMode(true);
    setChangePersonalInfoMode(false);
  }
  if (changePasswordMode) {
    return <ChangePasswordContent></ChangePasswordContent>;
  }
  if (changePersonalInfoMode) {
    return <EditPersonalInformationContent></EditPersonalInformationContent>;
  }

  return (
    <div className="edit-mode">
      <h3>Please select what information you would like to edit.</h3>
      <Button className="edit" onClick={onClickPersonal}>
        Edit personal information
      </Button>
      <Button className="edit">Edit billing addresses</Button>
      <Button className="edit">Edit shipping addresses</Button>
      <Button className="edit" onClick={onClickPassword}>
        Change password
      </Button>
    </div>
  );
};
