import Button from '../../../button/Button';
import Input from '../../../input/Input';
import './EditPersonalInformationContent.css';

export const EditPersonalInformationContent = () => {
  return (
    <div className="edit-personal">
      <form className="edit-password-form">
        <Input labelText="First Name" name="firstName" id="firstName"></Input>
        <Input labelText="Last Name" name="lastName" id="lastName"></Input>
        <Input labelText="Email" name="email" id="email"></Input>
        <Input labelText="Date of birth" type="date" name="dateOfBirth" id="dateOfBirth"></Input>
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
      </form>
    </div>
  );
};
