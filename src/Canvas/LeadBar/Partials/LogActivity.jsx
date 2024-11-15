import React, { useEffect, useMemo, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Popup from '@/Components/Popup';
import { router, useForm, usePage } from '@inertiajs/react';
import ReactSelect from '@/Components/ReactSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import ToggleSwitch from '@/Components/ToggleSwitch';
import TimeInput from '@/Components/TimeInput';
import { route } from '@/Providers/helpers';
import _ from 'lodash';
function LogActivity({
  isEdit,
  isLogModalOpen,
  setIsLogModalOpen,
  divisions,
  officeOptions,
  trades,
  user,
  leadData,
  getLeadPropData,
  logData,
  isLogEdit,
  setIsLogEdit,
}) {
  const { auth } = usePage().props;
  const [isLoading, setIsLoading] = useState(false);
  const default_Log = {
    activity_id: '',
    result_id: '',
    is_log: 1,
    visit_result: [],
    notes: '',
    title: '',
    type: [],
    assign_to: [],
    reminder: false,
    reminder_time: '',
    reminder_unit: 'Minutes',
  };
  const { data, setData, post, errors, setError, clearErrors } =
    useForm(default_Log);

  useEffect(() => {
    if (isLogEdit && !_.isEmpty(logData)) {
      setData(logData);
    }
  }, [logData, isLogEdit]);

  const validateFields = () => {
    let formErrors = {};
    const requiredFields = ['result_id', 'activity_id', 'notes'];

    requiredFields.forEach(field => {
      if (
        !data[field] ||
        (typeof data[field] === 'string' && data[field].trim() === '')
      ) {
        formErrors[field] = `${field} is Required`;
      }
    });
    if (data?.reminder) {
      if (!data?.reminder_data?.period) {
        formErrors['period'] = `period is Required`;
      }
      if (!data?.reminder_data?.time) {
        formErrors['time'] = `time is Required`;
      }
    }
    return formErrors;
  };

  const [isFollowUp, setIsFollowUp] = useState(false);
  const radius = [
    { label: '20 Miles', value: '20 Miles' },
    { label: '10 Miles', value: '10 Miles' },
    { label: '5 Miles', value: '5 Miles' },
    { label: '100 Miles', value: '100 Miles' },
  ];

  function onClose(e) {
    e?.preventDefault();
    clearErrors();
    setIsLogModalOpen(false);
    setData(default_Log);
    setIsLogEdit(false);
    setIsLoading(false);
  }

  const handleFollowUpToggle = enabled => {
    setIsFollowUp(enabled);
  };

  const resultOptions = useMemo(() => {
    const results = leadData?.activityTypeOptions?.find(
      activity => activity?.id === data?.activity_id
    )?.result_options;
    const newResultOptions =
      results?.map(result_option => ({
        label: result_option?.name,
        value: result_option?.id,
      })) || [];
    return newResultOptions;
  }, [data?.activity_id, leadData]);

  useEffect(() => {
    setData(pre => ({
      ...pre,
      canvas_lead_id: leadData?.lead?.id,
      created_by: auth?.user?.id,
      assigned_to: auth?.user?.id,
    }));
  }, [leadData, auth]);

  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    clearErrors();
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setError(formErrors);
      setIsLoading(false);
    } else {
      if (isLogEdit) {
        router.patch(
          route('tenant.canvas-activity-logs.update', data?.id),
          data,
          {
            onSuccess: () => {
              setIsLogModalOpen(false);
              setIsLoading(false);
              clearErrors();
              setData(default_Log);
              getLeadPropData(leadData?.lead?.id);
            },
            onError: error => {
              setError(error);
              setIsLoading(false);
            },
          }
        );
      } else {
        router.post(route('tenant.canvas-lead-activity-store'), data, {
          onSuccess: mes => {
            setIsLogModalOpen(false);
            setIsLoading(false);
            clearErrors();
            setData(default_Log);
            getLeadPropData(leadData?.lead?.id);
          },
          onError: error => {
            setError(error);
            setIsLoading(false);
          },
        });
      }
    }
  };

  return (
    <Popup
      open={isLogModalOpen}
      setOpen={onClose}
      header={isLogEdit ? 'Edit Log Activity' : 'Add Log Activity'}
      size="md"
    >
      <div className="grid-cols-12 gap-5 max-xl:grid-cols-6 sm:grid">
        <div className="col-span-7 max-sm:mb-3">
          <div className="whitespace-nowrap rounded-lg text-sm text-latisGray-900">
            Lead :-{' '}
            <span className="text-medium text-sm">
              {leadData?.lead?.formatted_name}
            </span>
          </div>
        </div>

        <div className="col-span-6 max-sm:mb-3">
          <InputLabel
            className="mb-1 text-sm"
            forInput="activity_type"
            value="Activity Type"
          />
          <ReactSelect
            id="activity_type"
            className="text-sm"
            value={data?.activity_id}
            placeholder="Select Activity Type"
            options={leadData?.activityTypeOptions?.map(activity => ({
              value: activity?.id,
              label: activity?.name,
            }))}
            onChange={val =>
              setData(pre => ({
                ...pre,
                activity_id: val.value,
                title: `${val.label} log`,
              }))
            }
          />
          <InputError message={errors?.activity_id} className="mt-2" />
        </div>
        <div className="col-span-6 max-sm:mb-3">
          <InputLabel
            className="mb-1 text-sm"
            forInput="visit_result"
            value="Visit Result"
          />
          <ReactSelect
            id="visit_result"
            className="text-sm"
            placeholder="Select Visit Result"
            disabled={resultOptions?.length === 0}
            value={data?.result_id}
            options={resultOptions}
            onChange={val => setData('result_id', val.value)}
          />
          <InputError message={errors?.result_id} className="mt-2" />
        </div>
        <div className="col-span-12 pb-2 max-sm:mb-3">
          <InputLabel className="mb-1 text-sm" forInput="notes" value="Notes" />
          <textarea
            style={{ height: '90px' }}
            id="notes"
            placeholder="Notes"
            value={data?.notes}
            onChange={e => setData('notes', e.target.value)}
            className="w-full resize-y rounded-md border border-gray-300 p-2 text-xs"
          />
          <InputError message={errors?.notes} className="mt-2" />
        </div>

        {/* <div className="col-span-12 max-sm:mb-3">
          <ToggleSwitch enabled={isFollowUp} onChange={handleFollowUpToggle} />
          <span className="ml-5">Follow Up</span>
        </div> */}

        {isFollowUp && (
          <>
            <div className="col-span-6 max-sm:mb-3">
              <InputLabel className="mb-1" value="From" />
              <div className="flex gap-2">
                <TextInput
                  type="date"
                  name="from_date"
                  value={data?.from_date}
                  handleChange={e => setData('from_date', e.target.value)}
                />
                <TimeInput
                  placeholder="00:00"
                  value={data?.from_time}
                  onChange={value => {
                    setData('from_time', value);
                  }}
                />
              </div>
            </div>
            <div className="col-span-6 max-sm:mb-3">
              <InputLabel className="mb-1" forInput="title" value="Title" />
              <TextInput
                readOnly={true}
                type="text"
                name="to_time"
                value={data?.to_time}
                handleChange={e => setData('to_time', e.target.value)}
                placeholder="Matthew Ikemeier"
              />
              <InputError message={errors?.title} className="mt-2" />
            </div>
            <div className="col-span-6 max-sm:mb-3">
              <InputLabel className="mb-1" forInput="type" value="Type" />
              <ReactSelect
                id="type"
                placeholder="Type"
                value={data?.type}
                options={leadData?.activityTypeOptions?.map(activity => ({
                  value: activity?.id,
                  label: activity?.name,
                }))}
                onChange={val => setData('type', val.value)}
              />
              <InputError message={errors?.type} className="mt-2" />
            </div>
            <div className="col-span-6 max-sm:mb-3">
              <InputLabel
                className="mb-1"
                forInput="assign_to"
                value="Assign To"
              />
              <ReactSelect
                id="assign_to"
                value={data?.assign_to}
                placeholder="Select Assign To"
                options={leadData?.ownerOptions?.map(owner => ({
                  value: owner?.id,
                  label: owner?.name,
                }))}
                onChange={val => setData('assign_to', val.value)}
              />
              <InputError message={errors?.assign_to} className="mt-2" />
            </div>
            <div className="col-span-6 max-sm:mb-3">
              <InputLabel className="mb-1" value="Reminder" />
              <div className="flex items-center space-x-4">
                <Checkbox
                  type="checkbox"
                  name="reminder"
                  checked={data?.reminder}
                  onChange={e => setData('reminder', e.target.checked)}
                />
                <TextInput
                  name="reminder_time"
                  value={data?.reminder_time}
                  handleChange={e => setData('reminder_time', e.target.value)}
                  className="max-w-20"
                />
                <ReactSelect
                  id="reminder_unit"
                  placeholder="Minutes"
                  value={data?.reminder_unit}
                  options={radius}
                  onChange={val => setData('reminder_unit', val.value)}
                  className="w-[1100px]"
                />
                <span className="text-sm text-gray-700">Before</span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-5 flex justify-end space-x-4 pt-5 ">
        <SecondaryButton onClick={onClose}>
          <span className="px-3.5">Cancel</span>
        </SecondaryButton>
        <PrimaryButton processing={isLoading} onClick={handleSubmit}>
          <span className="px-8 "> {isLogEdit ? 'Save' : 'Create'} </span>
        </PrimaryButton>
      </div>
    </Popup>
  );
}

export default LogActivity;
