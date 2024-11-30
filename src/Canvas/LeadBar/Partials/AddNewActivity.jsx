import React, { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Popup from '@/Components/Popup';
import { router, useForm, usePage } from '@inertiajs/react';
import ReactSelect from '@/Components/ReactSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import TimeInput from '@/Components/TimeInput';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { formatDate, formatTime, route } from '@/Providers/helpers';
import _ from 'lodash';
function AddNewActivity({
  isActivity,
  setIsActivity,
  divisions,
  officeOptions,
  trades,
  user,
  leadData,
  setLeadData,
  getLeadPropData,
  isActivityEdit,
  selectedActivity,
  setIsActivityEdit,
  isLogging,
  setIsLogging,
}) {
  const { auth } = usePage().props;
  const default_Activity = {
    title: '',
    from_date: formatDate(moment()),
    to_date: formatDate(moment().add(1, 'day')),
    from_time: '',
    is_log: false,
    to_time: '',
    all_day: false,
    repeat: '',
    reminder: false,
    reminder_data: {
      time: 15,
      period: '',
    },
    canvas_lead_id: '',
    result_id: '',
    activity_id: '',
    assigned_to: '',
    created_by: '',
    notes: '',
  };
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData, errors, setError, clearErrors } =
    useForm(default_Activity);

  useEffect(() => {
    if (isActivityEdit && !_.isEmpty(selectedActivity)) {
      setData({
        ...selectedActivity,
        assigned_to: selectedActivity?.assigned_to?.id,
        is_log: isLogging,
      });
    }
  }, [selectedActivity, isActivityEdit, isActivity, isLogging]);
  function onClose() {
    clearErrors();
    setIsActivity(false);
    setTimeout(() => {
      setData(default_Activity);
      setIsActivityEdit(false);
      setIsLogging(false);
    }, 200);
  }

  const validateFields = () => {
    let formErrors = {};
    const requiredFields = [
      'title',
      'from_date',
      'to_date',
      'from_time',
      'to_time',
      'repeat',
      'canvas_lead_id',
      'activity_id',
      'assigned_to',
      'created_by',
      'notes',
    ];

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

  const handleSubmit = e => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setError(formErrors);
      setIsLoading(false);
    } else {
      if (isActivityEdit) {
        router.patch(
          route('tenant.canvas-activity-logs.update', data?.id),
          data,
          {
            onSuccess: () => {
              setIsActivity(false);
              setIsLoading(false);
              clearErrors();
              setData(default_Activity);
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
          onSuccess: () => {
            setIsActivity(false);
            setIsLoading(false);
            clearErrors();
            setData(default_Activity);
            getLeadPropData(leadData?.lead?.id);
          },
          onError: error => {
            console.log(error);
            setError(error);
            setIsLoading(false);
          },
        });
      }
    }
  };

  useEffect(() => {
    setData(pre => ({
      ...pre,
      canvas_lead_id: leadData?.lead?.id,
      created_by: auth?.user?.id,
    }));
  }, [leadData, auth]);

  return (
    <Popup
      open={isActivity}
      setOpen={onClose}
      header={
        isActivityEdit
          ? isLogging
            ? `Log ${selectedActivity?.activity_name}`
            : 'Edit Activity'
          : 'Add New Activity'
      }
      size="md"
    >
      <div className="gap-5 sm:grid sm:grid-cols-12">
        <div className="col-span-6 ">
          <InputLabel className="mb-1" forInput="type" value="Type" />
          <ReactSelect
            id="type"
            placeholder="Type"
            value={data?.activity_id}
            options={leadData?.activityTypeOptions?.map(activity => ({
              value: activity?.id,
              label: activity?.name,
            }))}
            onChange={val => setData('activity_id', val.value)}
          />
          <InputError message={errors?.activity_id} className="mt-2" />
        </div>
        <div className="col-span-6 ">
          <InputLabel className="mb-1" forInput="title" value="Title" />
          <TextInput
            readOnly={true}
            type="text"
            name="title"
            value={data?.title}
            handleChange={e => setData('title', e.target.value)}
            placeholder="Enter title"
          />
          <InputError message={errors?.title} className="mt-2" />
        </div>
        <div className="col-span-12 border-t border-latisGray-400 pt-3 max-sm:mb-3 ">
          <div className="mt-2 flex items-center">
            <Checkbox
              id="all_day"
              type="checkbox"
              name="all_day"
              checked={data?.all_day}
              handleChange={e => {
                setData(pre => ({
                  ...pre,
                  from_time: '00:00:00',
                  to_time: '23:59:00',
                  all_day: e.target.checked,
                }));
              }}
            />
            <label
              htmlFor="all_day"
              className="ml-2 cursor-pointer select-none text-sm text-gray-700"
            >
              All Day
            </label>
          </div>
        </div>
        <div className="grid gap-4 border-latisGray-400 pb-5 sm:col-span-12 sm:grid-cols-2 sm:border-b">
          <div className="">
            <InputLabel className="mb-1" value="From" />
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <div className="w-full">
                {' '}
                <Flatpickr
                  value={data?.from_date}
                  onChange={([time], date) => {
                    setData('from_date', formatDate(date));
                  }}
                  className="w-full rounded-md border border-latisGray-600 p-2 text-sm"
                  options={{ dateFormat: 'Y-m-d', enableTime: false }}
                />
                <InputError message={errors?.from_date} className="mt-2" />
              </div>
              <div className="w-full ">
                <TimeInput
                  disabled={data?.all_day}
                  use12Hours={false}
                  format="HH:mm:ss"
                  className="w-full "
                  name="time"
                  type="number"
                  placeholder="0.00"
                  value={data?.from_time || ''}
                  onChange={value => {
                    setData({ ...data, from_time: formatTime(value) });
                  }}
                />
                <InputError message={errors?.from_time} className="mt-2" />
              </div>
            </div>
          </div>
          <div className=" max-sm:mb-3">
            <InputLabel className="mb-1" value="To" />
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <div className="w-full">
                {' '}
                <Flatpickr
                  value={data?.to_date}
                  onChange={([time], date) => {
                    setData('to_date', formatDate(date));
                  }}
                  className="w-full rounded-md border border-latisGray-600 p-2 text-sm"
                  options={{
                    dateFormat: 'Y-m-d',
                    enableTime: false,
                    minDate: data?.from_date,
                  }}
                />
                <InputError message={errors?.to_date} className="mt-2" />
              </div>

              <div className="w-full ">
                <TimeInput
                  disabled={data?.all_day}
                  use12Hours={false}
                  className="w-full "
                  format="HH:mm:ss"
                  name="time"
                  type="number"
                  placeholder="0.00"
                  value={data?.to_time || ''}
                  onChange={value => {
                    setData({ ...data, to_time: formatTime(value) });
                  }}
                />
                <InputError message={errors?.to_time} className="mt-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6 max-sm:mb-3">
          <InputLabel className="mb-1" forInput="repeat" value="Repeat" />
          <ReactSelect
            id="repeat"
            placeholder="Repeat"
            value={data?.repeat}
            options={leadData?.repeatTypeOptions?.map(repeat => ({
              value: repeat?.id,
              label: repeat?.name,
            }))}
            onChange={repeat => setData('repeat', repeat.value)}
          />
          <InputError message={errors?.repeat} className="mt-2" />
        </div>
        <div className="col-span-6 max-sm:mb-3">
          <InputLabel
            forInput={'reminder'}
            className="mb-1 cursor-pointer select-none"
            value="Reminder"
          />
          <div className="flex items-center space-x-4">
            <div className="h-8">
              <Checkbox
                type="checkbox"
                name="reminder"
                id="reminder"
                checked={data?.reminder}
                handleChange={e => {
                  setData(pre => ({
                    ...pre,
                    reminder: e.target.checked,
                    reminder_data: {
                      time: '',
                      period: '',
                    },
                  }));
                }}
              />
            </div>

            {data?.reminder && (
              <>
                <div>
                  <TextInput
                    name="reminder_time"
                    value={data?.reminder_data?.time}
                    handleChange={e => {
                      setData(pre => ({
                        ...pre,
                        reminder_data: {
                          ...pre?.reminder_data,
                          time: e.target.value,
                        },
                      }));
                    }}
                    className="max-w-20"
                    placeholder="00"
                  />
                  <InputError message={errors?.time} />
                </div>
                <div>
                  <ReactSelect
                    id="reminder_unit"
                    placeholder="Minutes"
                    value={data?.reminder_data?.period}
                    options={[
                      { label: 'Hours', value: 'hours' },
                      {
                        label: 'Minutes',
                        value: 'minutes',
                      },
                      { label: 'Days', value: 'days' },
                    ]}
                    onChange={period =>
                      setData(pre => ({
                        ...pre,
                        reminder_data: {
                          ...pre?.reminder_data,
                          period: period.value,
                        },
                      }))
                    }
                  />
                  <InputError message={errors?.period} />
                </div>

                <span className="text-sm text-gray-700">Before</span>
              </>
            )}
          </div>
        </div>
        <div className="col-span-12 border-t border-latisGray-400 pt-3 max-sm:mb-3">
          <div>
            <InputLabel
              className="mb-1"
              forInput="assign_to"
              value="Assign To"
            />
            <ReactSelect
              id="assign_to"
              value={data?.assigned_to}
              placeholder="Select Assign To"
              options={leadData?.ownerOptions?.map(owner => ({
                value: owner?.id,
                label: owner?.name,
              }))}
              onChange={val => setData('assigned_to', val.value)}
            />
            <InputError message={errors?.assigned_to} className="mt-2" />
          </div>
        </div>
        <div className="col-span-12 border-t border-latisGray-400 pt-2 max-sm:mb-3">
          <InputLabel className="mb-1" forInput="notes" value="Notes" />
          <textarea
            style={{ height: '90px' }}
            id="notes"
            placeholder="Notes"
            value={data?.notes}
            onChange={e => setData('notes', e.target.value)}
            className="w-full resize-y rounded-md border border-gray-300 p-2"
          />
          <InputError message={errors?.notes} className="mt-2" />
        </div>
      </div>
      <div className="mt-5 flex justify-end space-x-4 border-t pt-5">
        <SecondaryButton onClick={onClose}>
          <span className="px-3.5">Cancel</span>
        </SecondaryButton>
        <PrimaryButton processing={isLoading} onClick={handleSubmit}>
          <span className="px-8">{isActivityEdit ? 'Save' : 'Create'}</span>
        </PrimaryButton>
      </div>
    </Popup>
  );
}

export default AddNewActivity;
