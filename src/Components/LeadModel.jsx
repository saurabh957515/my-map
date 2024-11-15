import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import ReactSelect from '@/Components/ReactSelect';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { route } from '@/Providers/helpers';
import { router, useForm, usePage } from '@inertiajs/react';
import React from 'react';

function LeadModel({ isAddLead, setIsAddLead, trades }) {
  const { auth } = usePage().props;

  const makeReactOptions = obj =>
    Object.entries(obj).map(([value, label]) => ({
      label: label,
      value: value,
    }));

  const stateOptions = obj =>
    Object.entries(obj).map(([label, value]) => ({
      label: label.replace(/_/g, ' '),
      value: value,
    }));

  const { data, setData, errors, clearErrors, setError } = useForm({
    name: '',
    state: '',
    zip: '',
    address: '',
    email: '',
    number: '',
    city: '',
    campaign_id: '',
    trades_id: '',
  });
  function onClose() {
    setIsAddLead(false);
    setData({});
  }
  function handleLead(name, value) {
    setData(name, value);
  }
  function LeadSave(e) {
    e.preventDefault();
    router.post(route('tenant.leads.store'), data, {
      onSuccess: () => {
        clearErrors();
        onClose();
      },
      onError: error => {
        setIsAddLead(false);
        setError(error);
      },
    });
  }
  return (
    <Popup open={isAddLead} setOpen={onClose} header={'Add Lead'} size="sm">
      <form onSubmit={LeadSave} className="grid-cols-3 gap-5 sm:grid">
        <div className="col-span-3">
          <InputLabel required className="" value="Name" />
          <TextInput
            required
            name="name"
            handleChange={e => handleLead('name', e.target.value)}
            value={data?.name}
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.name} />
        </div>
        <div className="col-span-3">
          <InputLabel required className="" value="Phone" />
          <TextInput
            required
            name="number"
            handleChange={e => handleLead('number', e.target.value)}
            value={data?.number}
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.number} />
        </div>
        <div className="col-span-3">
          <InputLabel required className="" value="Email" />
          <TextInput
            required
            name="email"
            handleChange={e => handleLead('email', e.target.value)}
            value={data?.email}
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.email} />
        </div>
        <div className="col-span-3">
          <InputLabel required className="" value="Address" />
          <TextInput
            required
            name="address"
            handleChange={e => handleLead('address', e.target.value)}
            value={data?.address}
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.address} />
        </div>
        <div className="col-span-1">
          <InputLabel required className="" value="State" />
          <ReactSelect
            required
            name="state"
            options={stateOptions(auth.states)}
            onChange={state => handleLead('state', state.value)}
            value={data?.state}
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.state} />
        </div>
        <div className="col-span-1">
          <InputLabel required className="" value="City" />
          <TextInput
            required
            name="city"
            handleChange={e => handleLead('city', e.target.value)}
            value={data?.city}
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.city} />
        </div>
        <div className="col-span-1">
          <InputLabel required className="" value="Zip" />
          <TextInput
            required
            name="zip"
            handleChange={e => handleLead('zip', e.target.value)}
            value={data?.zip}
            type="number"
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.zip} />
        </div>

        <div className="col-span-3">
          <InputLabel required className="" value="Interested In" />

          <ReactSelect
            required
            name="trades_id"
            isMulti={true}
            options={trades?.map(trade => ({
              label: trade?.name,
              value: trade?.id,
            }))}
            onChange={selectedOptions =>
              handleLead(
                'trades_id',
                selectedOptions
                  ? selectedOptions.map(option => option.value)
                  : []
              )
            }
            value={trades
              ?.filter(trade => data?.trades_id?.includes(trade.id))
              ?.map(trade => ({
                label: trade.name,
                value: trade.id,
              }))}
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.trades_id} />
        </div>

        <div className="col-span-3">
          <InputLabel required className="" value="Assign to Campaign" />
          <ReactSelect
            required
            name="campaign_id"
            options={makeReactOptions(auth.campaigns)}
            onChange={campaign => handleLead('campaign_id', campaign.value)}
            value={data?.campaign_id}
            className="mt-2.5"
          />
          <InputError className="mt-2" message={errors?.campaign_id} />
        </div>
        <div className="col-span-3 mt-10 flex flex-row-reverse gap-x-5 border-t pt-2.5">
          <PrimaryButton type="save">
            <span className="px-8 "> add </span>
          </PrimaryButton>
          <SecondaryButton onClick={onClose}>
            <span className="px-3.5">Cancel</span>
          </SecondaryButton>
        </div>
      </form>
    </Popup>
  );
}

export default LeadModel;
