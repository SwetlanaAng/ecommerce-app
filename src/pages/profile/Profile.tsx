import './Profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <h1>Profile information</h1>

      <h2>Personal information</h2>

      <div className="info-box first-name">
        <span>First name: </span>John
      </div>
      <div className="info-box last-name">
        <span>Last name: </span>Doe
      </div>
      <div className="info-box birth-date">
        <span>Date of birth: </span>09.05.2000
      </div>

      <h2>Addresses</h2>

      <h3>Billing Address</h3>
      <div className="info-box billing-country">
        <span>Country: </span>Germany
      </div>
      <div className="info-box billing-city">
        <span>City: </span>Munich
      </div>
      <div className="info-box billing-street">
        <span>Street : </span>Welfenstrabe
      </div>
      <div className="info-box billing-postal-code">
        <span>Postal code: </span>11255
      </div>
      <h3>Shipping Address</h3>
      <div className="info-box shipping-country">
        <span>Country: </span>Germany
      </div>
      <div className="info-box shipping-city">
        <span>City: </span>Munich
      </div>
      <div className="info-box shipping-street">
        <span>Street: </span>Welfenstrabe
      </div>
      <div className="info-box shipping-postal-code">
        <span>Postal code: </span>11255
      </div>

      <h2>Default Addresses</h2>

      <h3>Default Billing Address</h3>
      <div className="info-box default-billing-country">
        <span>Country: </span>Germany
      </div>
      <div className="info-box default-billing-city">
        <span>City: </span>Munich
      </div>
      <div className="info-box default-billing-street">
        <span>Street: </span>Welfenstrabe
      </div>
      <div className="info-box default-billing-postal-code">
        <span>Postal code: </span>11255
      </div>
      <h3>Default Shipping Address</h3>
      <div className="info-box default-shipping-country">
        <span>Country: </span>Germany
      </div>
      <div className="info-box default-shipping-city">
        <span>City: </span>Munich
      </div>
      <div className="info-box default-shipping-street">
        <span>Street: </span>Welfenstrabe
      </div>
      <div className="info-box default-shipping-postal-code">
        <span>Postal code: </span>11255
      </div>
    </div>
  );
};

export default Profile;
