import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import ReactSelect from 'react-select';

function UserModel({
  divisions,
  officeOptions,
  trades,
  isModalOpen,
  setIsModalOpen,
  user,
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    company_title: '',
    divisions: [],
    offices: [],
    trades: [],
  });

  useEffect(() => {
    if (user) {
      setData({
        name: user.name,
        email: user.email,
        phone:
          user.user_metas?.find(user_meta => user_meta.key === 'phone')
            ?.value || '',
        company_title:
          user.user_metas?.find(user_meta => user_meta.key === 'company_title')
            ?.value || '',
        divisions:
          user.divisions?.map(division => ({
            id: division.id,
            title: division.name,
          })) ?? [],
        offices:
          user.offices?.map(office => ({
            id: office.id,
            name: office.name,
          })) ?? [],
        trades:
          user.trades?.map(trade => ({
            id: trade.id,
            title: trade.name,
          })) ?? [],
      });
    }
  }, [user]);

  const handleAddUser = e => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDivision = selectedOptions => {
    setData(prevData => ({
      ...prevData,
      divisions: selectedOptions.map(option => ({
        id: option.value,
        title: option.label,
      })),
    }));
  };

  const handleOffice = selectedOptions => {
    setData(prevData => ({
      ...prevData,
      offices: selectedOptions.map(option => ({
        id: option.value,
        name: option.label,
      })),
    }));
  };

  const handleTrade = selectedOptions => {
    setData(prevData => ({
      ...prevData,
      trades: selectedOptions.map(option => ({
        id: option.value,
        title: option.label,
      })),
    }));
  };

  const handleChange = (name, value) => {
    setData(pre => ({
      ...pre,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const url = 'users/storeCanvaser';
    post(url, {
      onSuccess: () => {
        if (Object.keys(errors).length === 0) {
          setIsModalOpen(false);
        }
      },
    });
    reset();
  };

  const getOption = selectOption => {
    return Object.entries(selectOption)?.map(([id, label]) => ({
      value: id,
      label: label,
    }));
  };

  function onClose() {
    setIsModalOpen(false);
  }

  return (
    <Popup
      open={isModalOpen}
      setOpen={onClose}
      header={user ? 'Edit User' : 'Add New User'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="gap-3 max-xl:grid-cols-6 sm:grid xl:grid-cols-2">
          <div className="mt-3 max-xl:col-span-12 max-xl:mb-3">
            <InputLabel forInput="name" value="Name" />
            <TextInput
              type="text"
              name="name"
              value={data.name}
              handleChange={e => handleChange('name', e.target.value)}
              placeholder="Name"
              required
            />
            <InputError message={errors.name} className="mt-2" />
          </div>

          <div className="mt-3 max-xl:col-span-3 max-xl:mb-3">
            <InputLabel forInput="email" value="Email" />
            <TextInput
              type="email"
              name="email"
              value={data.email}
              handleChange={e => handleChange('email', e.target.value)}
              placeholder="Email"
              required
            />
            <InputError message={errors.email} className="mt-2" />
          </div>

          <div className="mt-3 max-xl:col-span-3 max-xl:mb-3">
            <InputLabel forInput="phone" value="Phone" />
            <TextInput
              type="number"
              name="phone"
              value={data.phone}
              handleChange={e => handleChange('phone', e.target.value)}
              placeholder="Phone"
              required
            />
            <InputError message={errors.phone} className="mt-2" />
          </div>

          <div className="mt-3 max-xl:col-span-3 max-xl:mb-3">
            <InputLabel forInput="company_title" value="Company Title" />
            <TextInput
              type="text"
              name="company_title"
              value={data.company_title}
              handleChange={e => handleChange('company_title', e.target.value)}
              placeholder="Company Title"
            />
            <InputError message={errors.company_title} className="mt-2" />
          </div>

          <div className="mt-3 max-xl:col-span-12 max-xl:mb-3">
            <InputLabel forInput="divisions" value="Divisions" />
            <ReactSelect
              options={getOption(divisions)}
              isMulti
              onChange={handleDivision}
              value={data?.divisions?.map(division => ({
                value: division.id,
                label: division.title,
              }))}
              placeholder="Select Divisions"
            />
            <InputError message={errors.divisions} className="mt-2" />
          </div>

          <div className="mt-3 max-xl:col-span-12 max-xl:mb-3">
            <InputLabel forInput="offices" value="Offices" />
            <ReactSelect
              options={getOption(officeOptions)}
              isMulti
              onChange={handleOffice}
              value={data?.offices?.map(office => ({
                value: office.id,
                label: office.name,
              }))}
              placeholder="Select Offices"
            />
            <InputError message={errors.offices} className="mt-2" />
          </div>

          <div className="mt-3 max-xl:col-span-12 max-xl:mb-3">
            <InputLabel forInput="trades" value="Trades" />
            <ReactSelect
              options={getOption(trades)}
              isMulti
              onChange={handleTrade}
              value={data.trades?.map(trade => ({
                value: trade.id,
                label: trade.title,
              }))}
              placeholder="Select Trades"
            />
            <InputError message={errors.trades} className="mt-2" />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4 border-t pt-5">
          <SecondaryButton onClick={() => onClose()}>
            <span className="px-3.5 ">Cancel</span>
          </SecondaryButton>

          <PrimaryButton type="submit" disabled={processing}>
            <span className="px-8 "> {user ? 'Update' : 'Add'} </span>
          </PrimaryButton>
        </div>
      </form>
    </Popup>
  );
}

export default UserModel;
