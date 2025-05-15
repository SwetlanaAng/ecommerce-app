import Button from '../../../button/Button';
import Input from '../../../input/Input';
import './ChangePasswordContent.css';

export const ChangePasswordContent = () => {
  return (
    <div className="edit-password">
      <form className="edit-password-form">
        <Input labelText="Password" type="password" name="password" id="password"></Input>
        <Input
          labelText="New Password"
          type="password"
          name="new-password"
          id="new-password"
        ></Input>
        <Button className="submit-button " type="submit">
          Change Password
        </Button>
      </form>
    </div>
  );
};
