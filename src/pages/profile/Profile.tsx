import { useEffect, useState, useCallback } from 'react';
import { getCustomer } from '../../services/profile.service';
import { CustomerInfo } from '../../types/interfaces';
import './Profile.css';
import { InfoBox } from '../../components/profile-info-box/InfoBox';
import Button from '../../components/button/Button';
import Loader from '../../components/loader/Loader';
import { AddressBox } from '../../components/address-profile-box/AddressBox';
import { Modal } from '../../components/modal/Modal';
import { ChangePasswordContent } from '../../components/modal/modal-content/change-password/ChangePasswordContent';
import { EditPersonalInformationContent } from '../../components/modal/modal-content/edit-personal-info/EditPersonalInformationContent';
import { useChangePasswordForm } from '../../features/auth/hooks/useChangePasswordForm';
import { useEditPersonalInfoForm } from '../../features/auth/hooks/useEditPersonalInfoForm';
import { AddNewAddressContent } from '../../components/modal/modal-content/add-address/AddNewAddressContent';
import editIcon from '../../assets/pencil-edit-button-svgrepo-com.svg';
import {
  useAddBillingAddressForm,
  useAddShippingAddressForm,
} from '../../features/auth/hooks/useAddAddressForm';

const Profile: React.FC = () => {
  const [customer, setCustomer] = useState<CustomerInfo>({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    addresses: [],
    shippingAddressIds: [],
    billingAddressIds: [],
    dateOfBirth: '',
    version: 0,
  });

  const [defaultBillingId, setDefaultBillingId] = useState('');
  const [defaultShippingId, setDefaultShippingId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const { formData, handleSubmit, errors, reset, isSubmitting, register, handleChange } =
    useChangePasswordForm();

  const refreshProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCustomer();
      setCustomer(data);

      setDefaultBillingId(data.defaultBillingAddressId || '');
      setDefaultShippingId(data.defaultShippingAddressId || '');
    } catch (err) {
      setError(
        `Error loading profile information. ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsLoading(false);
      document.body.style.overflow = 'auto';
    }
  }, []);

  useEffect(() => {
    refreshProfileData();
  }, [refreshProfileData]);

  const {
    formDataPersonal,
    errorsPersonal,
    isSubmittingPersonal,
    registerPersonal,
    handleChangePersonal,
    handleSubmit: handleSubmitPersonal,
  } = useEditPersonalInfoForm();

  const addBillingForm = useAddBillingAddressForm();
  const addShippingForm = useAddShippingAddressForm();

  function getModalChild() {
    if (modalContent === 'changePassword') {
      return (
        <ChangePasswordContent
          formData={formData}
          isDisabled={isSubmitting}
          onChange={handleChange}
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          reset={reset}
          onSuccess={() => {
            setModalOpen(false);
          }}
        ></ChangePasswordContent>
      );
    }
    if (modalContent === 'changePersonalInfo') {
      return (
        <EditPersonalInformationContent
          formData={formDataPersonal}
          isDisabled={isSubmittingPersonal}
          onChange={handleChangePersonal}
          register={registerPersonal}
          errors={errorsPersonal}
          handleSubmit={handleSubmitPersonal}
          onSuccess={() => {
            setModalOpen(false);
            refreshProfileData();
          }}
        ></EditPersonalInformationContent>
      );
    }
    if (modalContent === 'billing') {
      return (
        <AddNewAddressContent
          reset={addBillingForm.reset}
          formData={addBillingForm.formData}
          isDisabled={addBillingForm.isSubmitting}
          type="billing"
          onChange={addBillingForm.handleChange}
          onDefaultAddressChange={addBillingForm.handleChange}
          register={addBillingForm.register}
          errors={addBillingForm.errors}
          handleSubmit={addBillingForm.handleSubmit}
          onSuccess={() => {
            setModalOpen(false);
            refreshProfileData();
          }}
        />
      );
    }

    if (modalContent === 'shipping') {
      return (
        <AddNewAddressContent
          reset={addShippingForm.reset}
          formData={addShippingForm.formData}
          isDisabled={addShippingForm.isSubmitting}
          type="shipping"
          onChange={addShippingForm.handleChange}
          onDefaultAddressChange={addShippingForm.handleChange}
          register={addShippingForm.register}
          errors={addShippingForm.errors}
          handleSubmit={addShippingForm.handleSubmit}
          onSuccess={() => {
            setModalOpen(false);
            refreshProfileData();
          }}
        />
      );
    }
  }
  const billingAddresses = customer.addresses.filter(address =>
    customer.billingAddressIds.includes(address.id)
  );
  const shippingAddresses = customer.addresses.filter(address =>
    customer.shippingAddressIds.includes(address.id)
  );

  if (error) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <Loader />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="wrapper">
        <div className="card">
          <h4>Personal information</h4>
          <Button
            className="edit-personal-pen"
            onClick={() => {
              setModalContent('changePersonalInfo');
              setModalOpen(true);
            }}
          >
            <img src={editIcon} alt="edit" />
            Edit
          </Button>

          <div className="info-box-wrapper">
            <InfoBox
              className="first-name"
              spanText="First name: "
              infoText={customer.firstName}
            ></InfoBox>
            <InfoBox
              className="last-name"
              spanText="Last name: "
              infoText={customer.lastName}
            ></InfoBox>
            <InfoBox className="email" spanText="Email: " infoText={customer.email}></InfoBox>
            <InfoBox
              className="birth-date"
              spanText="Birth date: "
              infoText={customer.dateOfBirth}
            ></InfoBox>
          </div>
          <Button
            className={isLoading ? 'disabled edit' : 'edit'}
            onClick={() => {
              setModalContent('changePassword');
              setModalOpen(true);
            }}
          >
            Change password
          </Button>
        </div>
      </div>

      <div className="wrapper">
        <h3>Billing Addresses</h3>
        <Button
          className={isLoading ? 'disabled edit' : 'edit'}
          onClick={() => {
            setModalContent('billing');
            setModalOpen(true);
          }}
        >
          + Add new
        </Button>
        {billingAddresses.length === 0 ? (
          <p>No billing addresses found</p>
        ) : (
          billingAddresses.map((billingAddress, index) => (
            <AddressBox
              key={index}
              addressNumber={index}
              addressType="billing"
              country={billingAddress?.country}
              city={billingAddress?.city}
              street={billingAddress?.streetName}
              postalCode={billingAddress?.postalCode}
              defaultId={defaultBillingId}
              addressId={billingAddress?.id}
              refresh={refreshProfileData}
            ></AddressBox>
          ))
        )}
      </div>

      <div className="wrapper">
        <h3>Shipping Addresses</h3>
        <Button
          className={isLoading ? 'disabled edit' : 'edit'}
          onClick={() => {
            setModalContent('shipping');
            setModalOpen(true);
          }}
        >
          + Add new
        </Button>
        {shippingAddresses.length === 0 ? (
          <p>No shipping addresses found</p>
        ) : (
          shippingAddresses.map((shippingAddress, index) => (
            <AddressBox
              key={index}
              addressNumber={index}
              addressType="shipping"
              country={shippingAddress?.country}
              city={shippingAddress?.city}
              street={shippingAddress?.streetName}
              postalCode={shippingAddress?.postalCode}
              defaultId={defaultShippingId}
              addressId={shippingAddress?.id}
              refresh={refreshProfileData}
            ></AddressBox>
          ))
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onClose={() => {
          if (modalContent === 'billing') {
            addBillingForm.reset();
          } else if (modalContent === 'shipping') {
            addShippingForm.reset();
          } else if (modalContent === 'changePassword') {
            reset();
          }
          setModalOpen(false);
        }}
        children={getModalChild()}
      ></Modal>
    </div>
  );
};

export default Profile;
