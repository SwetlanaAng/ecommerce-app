import { useEffect, useState, useCallback } from 'react';
import { getCustomer } from '../../services/profile.service';
import { CustomerInfo } from '../../types/interfaces';
import './Profile.css';
import { InfoBox } from '../../components/profile-info-box/InfoBox';
import Button from '../../components/button/Button';
import { AddressBox } from '../../components/address-profile-box/AddressBox';
import { Modal } from '../../components/modal/Modal';
import { ChangePasswordContent } from '../../components/modal/modal-content/change-password/ChangePasswordContent';
import { EditPersonalInformationContent } from '../../components/modal/modal-content/edit-personal-info/EditPersonalInformationContent';
import { useChangePasswordForm } from '../../features/auth/hooks/useChangePasswordForm';
import { useEditPersonalInfoForm } from '../../features/auth/hooks/useEditPersonalInfoForm';
import { AddNewAddressContent } from '../../components/modal/modal-content/add-address/AddNewAddressContent';
import {
  useBillingAddressForm,
  useShippingAddressForm,
} from '../../features/auth/hooks/useEditAddressForm';

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

  const { formData, handleSubmit, errors, isSubmitting, register, handleChange } =
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

  const billingForm = useBillingAddressForm();
  const shippingForm = useShippingAddressForm();

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
          onSuccess={() => {
            setModalOpen(false);
          }}
        ></ChangePasswordContent>
      );
    }
    if (modalContent === 'changePersonalInfo') {
      console.log(formDataPersonal);
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
          formData={billingForm.formData}
          isDisabled={billingForm.isSubmitting}
          type="billing"
          onChange={billingForm.handleChange}
          onDefaultAddressChange={billingForm.handleChange}
          register={billingForm.register}
          errors={billingForm.errors}
          handleSubmit={billingForm.handleSubmit}
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
          formData={shippingForm.formData}
          isDisabled={shippingForm.isSubmitting}
          type="shipping"
          onChange={shippingForm.handleChange}
          onDefaultAddressChange={shippingForm.handleChange}
          register={shippingForm.register}
          errors={shippingForm.errors}
          handleSubmit={shippingForm.handleSubmit}
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
        <h1>Profile information</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="profile-page">
        <h1>Profile information</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Profile information</h1>
      <div className="personal-information-container">
        <h2>Personal information</h2>
        <Button
          className="edit-pen"
          onClick={() => {
            setModalContent('changePersonalInfo');
            setModalOpen(true);
          }}
        >
          Edit
        </Button>
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
          spanText="Date of birth: "
          infoText={customer.dateOfBirth}
        ></InfoBox>
      </div>

      <h2>Addresses</h2>

      <h3>Billing Addresses</h3>

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
          ></AddressBox>
        ))
      )}

      <Button
        className={isLoading ? 'disabled edit' : 'edit'}
        onClick={() => {
          setModalContent('billing');
          setModalOpen(true);
        }}
      >
        Add new billing address{' '}
      </Button>

      <h3>Shipping Addresses</h3>
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
          ></AddressBox>
        ))
      )}
      <Button
        className={isLoading ? 'disabled edit' : 'edit'}
        onClick={() => {
          setModalContent('shipping');
          setModalOpen(true);
        }}
      >
        Add new shipping address{' '}
      </Button>
      <br />
      <Button
        className={isLoading ? 'disabled edit' : 'edit'}
        onClick={() => {
          setModalContent('changePassword');
          setModalOpen(true);
        }}
      >
        Change password
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onClose={() => setModalOpen(false)}
        children={getModalChild()}
      ></Modal>
    </div>
  );
};

export default Profile;
