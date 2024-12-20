import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ReactSelect from '@/Components/ReactSelect';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import TextAreaInput from '@/Components/TextAreaInput';
import TimeInput from '@/Components/TimeInput';
import moment from 'moment';
import InputError from '@/Components/InputError';
import { useRef } from 'react';
import { loadModules } from 'esri-loader';
import _ from 'lodash';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Point from '@arcgis/core/geometry/Point.js';
import PhoneInput from '@/Components/PhoneInput';
function LeadForm({
  setIsAddLeadFormPopUp,
  mapPointAddress,
  view,
  mapPointCoordinates,
  isAddLeadFormPopUp,
  leadData,
  isLeadEdit,
  setLeadData,
  setIsLeadEdit = () => {},
  setIsLeadAdded,
}) {
  const { canvasFields, canvasStages, offices } = usePage().props;
  const [officeOptions, setOfficeOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [isAddressManual, setIsAddressManual] = useState(true);
  const searchWidgetRef = useRef(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const { data, setData, errors, setError, clearErrors } = useForm();

  useEffect(() => {
    setStageOptions(
      canvasStages?.map(stage => ({
        value: stage?.id,
        label: stage?.name,
      }))
    );
    setOfficeOptions(
      offices?.map(office => ({
        label: office?.name,
        value: office?.id,
      }))
    );
  }, [canvasStages, offices]);

  const userOptions = useMemo(() => {
    const office = offices.find(office => office.id === data?.office_id);
    const newUsers =
      office?.users?.length > 0
        ? office?.users?.map(user => ({
            value: user?.id,
            label: user?.name,
          }))
        : [];
    return newUsers;
  }, [data?.office_id, offices]);

  useEffect(() => {
    setData(pre => ({
      ...pre,
      address: mapPointAddress,
      ...mapPointCoordinates,
    }));
  }, [mapPointAddress, mapPointCoordinates]);

  useEffect(() => {
    if (isLeadEdit && leadData) {
      const addressDefaults = {
        street: '',
        house_number: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
      };

      const dataObject = {
        id: leadData?.id,
        canvas_stage_id: leadData?.canvas_stage_id || '',
        office_id: leadData?.office_id || '',
        owner_id: leadData?.owner_id || '',
        address: { ...addressDefaults, ...leadData?.address },
        latitude: leadData?.latitude || '',
        longitude: leadData?.longitude || '',
        meta_data: canvasFields
          ?.map(field => {
            const key = field.is_default
              ? field.name.toLowerCase().replace(/\s+/g, '_')
              : `field_${field.name.toLowerCase().replace(/\s+/g, '_')}`;

            return {
              field_id: field.id,
              id: field.id,
              key: field.name,
              type: field.input_type,
              value: leadData[key] || '',
              is_required: field.is_read_only || false,
              order: field.order,
            };
          })
          .sort((a, b) => a.order - b.order),
      };

      setData(dataObject);
    } else {
      const defaultMetaData = canvasFields.map(field => ({
        field_id: field.id,
        id: field.id,
        key: field.name,
        type: field.input_type,
        value: field?.value || '',
        is_required: field?.is_required || false,
        order: field?.order,
      }));
      let dataObject = {
        canvas_stage_id: leadData?.canvas_stage_id || '',
        office_id: leadData?.office_id || '',
        owner_id: leadData?.owner_id || '',
        address: {
          street: leadData?.address?.street || '',
          house_number: leadData?.address?.house_number || '',
          city: leadData?.address?.city || '',
          state: leadData?.address?.state || '',
          zip_code: leadData?.address?.zip_code || '',
          country: leadData?.address?.country || '',
        },
        latitude: leadData?.latitude || '',
        longitude: leadData?.longitude || '',
        meta_data: defaultMetaData.sort((a, b) => a.order - b.order),
      };
      setData(dataObject);
    }
  }, [canvasFields, leadData, isLeadEdit]);

  const handleAddressChange = (name, value) => {
    let newData = _.cloneDeep(data);
    newData['address'] = {
      ...newData.address,
      [name]: value,
    };
    setData(newData);
  };

  const onClose = e => {
    e.preventDefault();
    clearErrors();
    setIsLeadEdit(false);
    setIsAddLeadFormPopUp(false);
    setLeadData({});
  };
  useEffect(() => {
    if (!_.isEmpty(leadData)) {
      setIsLeadEdit(true);
    } else {
      setIsLeadEdit(false);
    }
  }, [leadData]);

  function Save(e) {
    e.preventDefault();
    clearErrors();
    if (isLeadEdit) {
      router.patch(route('tenant.canvas.leads.update', data?.id), data, {
        onSuccess: () => {
          clearErrors();
          view.goTo(
            {
              target: new Point({
                longitude: data?.longitude,
                latitude: data?.latitude,
              }),
              zoom: 19,
            },
            { duration: 500 }
          );
          setIsAddLeadFormPopUp(false);
          setData(dataObject);
          setIsLeadAdded(true);
        },
        onError: error => {
          setError(error);
        },
      });
    } else {
      router.post(route('tenant.canvas.leads.store'), data, {
        onSuccess: () => {
          clearErrors();
          view.goTo(
            {
              target: new Point({
                longitude: data?.longitude,
                latitude: data?.latitude,
              }),
              zoom: 19,
            },
            { duration: 500 }
          );
          setIsAddLeadFormPopUp(false);
          setData(dataObject);
          setIsLeadAdded(true);
        },
        onError: error => {
          setError(error);
        },
      });
    }
  }

  useEffect(() => {
    loadModules(['esri/widgets/Search']).then(([Search]) => {
      const searchWidget = new Search({
        view: view,
        popupEnabled: false,
        resultGraphicEnabled: false,
      });
      searchWidgetRef.current = searchWidget;
    });
  }, [view]);

  const handleInputChange = value => {
    if (searchWidgetRef.current) {
      searchWidgetRef.current
        .suggest(value)
        .then(response => {
          setSuggestions(response?.results[0]?.results || []);
        })
        .catch(err => {
          console.error('Error fetching suggestions:', err);
        });
    }
  };

  const handleSuggestionClick = async (suggestion, fieldId) => {
    const suggestionArray =
      suggestion?.text?.split(',').map(item => item.trim()) || [];

    const address = {
      country: suggestionArray[suggestionArray.length - 1] || '',
      zip_code: suggestionArray[suggestionArray.length - 2] || '',
      state: suggestionArray[suggestionArray.length - 3] || '',
      city: suggestionArray[suggestionArray.length - 4] || '',
      street:
        suggestionArray.slice(0, suggestionArray.length - 4).join(', ') || '',
      house_number: '',
    };

    if (searchWidgetRef.current) {
      try {
        const response = await searchWidgetRef.current.search(suggestion, {
          include: [],
          popupEnabled: false,
        });
        const results = response?.results[0]?.results;

        if (results && results.length > 0) {
          const extent = results[0].extent;
          const { ymin, ymax, xmin, xmax } = extent;
          setSelectedCoordinates({
            ymin,
            ymax,
            xmin,
            xmax,
          });
          const [SpatialReference, webMercatorUtils] = await loadModules([
            'esri/geometry/SpatialReference',
            'esri/geometry/support/webMercatorUtils',
          ]);
          const webMercatorExtent = {
            xmin,
            ymin,
            xmax,
            ymax,
            spatialReference: SpatialReference.WebMercator,
          };
          const geoExtent =
            webMercatorUtils.webMercatorToGeographic(webMercatorExtent);
          const {
            xmin: minLon,
            ymin: minLat,
            xmax: maxLon,
            ymax: maxLat,
          } = geoExtent;
          setData(prev => ({
            ...prev,
            address: suggestion?.text,
            latitude: minLat,
            longitude: maxLon,
          }));
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestion:', error);
      }
    }
  };

  const handleLead = (name, value) => {
    const newData = _.cloneDeep(data);
    newData[name] = value;
    setData(newData);
  };

  const handleLeadMeta = (id, value) => {
    let newData = _.cloneDeep(data);
    newData['meta_data'] = newData?.meta_data?.map(field => {
      if (field?.id === id) {
        return {
          ...field,
          value: value,
        };
      } else {
        return field;
      }
    });
    setData(newData);
  };

  useEffect(() => {
    let newData = _.cloneDeep(data);
    const isFieldRequired = (fieldStages, stageId) => {
      return fieldStages?.some(stage => stage.id === stageId);
    };

    if (newData?.meta_data?.length > 0) {
      newData['meta_data'] = newData?.meta_data?.map(metaData => {
        const current_field = canvasFields?.find(
          canvasField => canvasField?.id === metaData?.id
        );

        const newMetadata = {
          ...metaData,
          is_required: isFieldRequired(
            current_field?.stages,
            newData?.canvas_stage_id
          ),
        };
        return newMetadata;
      });
      setData(newData);
    }
  }, [data?.canvas_stage_id, isLeadEdit, canvasFields]);

  return (
    <div className="flex h-full flex-col gap-4 lg:w-3/12">
      <div className="z-50 flex w-full justify-between border-b bg-white p-4 ">
        <h1 className="flex flex-wrap items-end justify-start gap-2 text-base font-semibold text-latisGray-900">
          {' '}
          <span className="flex items-center gap-2">
            {isLeadEdit ? 'Edit Lead' : 'Add Lead'}
            {Object.keys(errors)?.length > 0 && (
              <span>
                <ExclamationCircleIcon className="mb-1 h-6 w-6 text-latisRed-900" />
              </span>
            )}
          </span>
        </h1>

        <span
          className="cursor-pointer"
          onClick={e => {
            setIsAddLeadFormPopUp(false);
          }}
        >
          <XMarkIcon className="h-6 w-6 text-latisGray-800" />
        </span>
      </div>
      <div className="scrollbar-hide flex-1 overflow-auto">
        <div className="border-b px-4 pb-4 ">
          <div className="col-span-2 ">
            <InputLabel className="pb-2 text-base" value="Stage" required />
            <ReactSelect
              required
              name="canvas_stage_id"
              options={stageOptions}
              onChange={stage => handleLead('canvas_stage_id', stage?.value)}
              value={data?.canvas_stage_id || ''}
              className=""
            />
            <InputError
              message={errors['canvas_stage_id']}
              className="mt-1.5"
            />
          </div>
        </div>
        {data?.meta_data?.length > 0 &&
          data?.meta_data?.map((field, index) =>
            field?.type ? (
              <>
                <div className="px-4 py-2 " key={index}>
                  <div className="flex w-full justify-between">
                    <InputLabel
                      className="mb-2 "
                      value={field.key}
                      required={field?.is_required}
                    />
                    {field?.type === 'Address' && (
                      <span
                        className="cursor-pointer select-none text-xs text-latisGray-700 hover:text-latisSecondary-800"
                        onClick={() => {
                          if (isAddressManual) {
                            setData({
                              ...data,
                              latitude: '',
                              longitude: '',
                              address: '',
                            });
                          } else {
                            setData({
                              ...data,
                              address: {},
                              latitude: '',
                              longitude: '',
                            });
                          }
                          setIsAddressManual(pre => !pre);
                        }}
                      >
                        {isAddressManual ? 'Search Address' : 'Adjust manually'}
                      </span>
                    )}
                  </div>

                  {field?.type === 'Address' ? (
                    <>
                      {' '}
                      {isAddressManual ? (
                        <div className="mt-1 grid w-full flex-wrap gap-3 pb-2 sm:grid-cols-2">
                          <div className="w-full">
                            <InputLabel className="mb-2 " value="Street" />
                            <TextInput
                              name="street"
                              value={data?.address?.street || ''}
                              placeholder="Street"
                              handleChange={e =>
                                handleAddressChange('street', e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full">
                            <InputLabel
                              className="mb-2 "
                              value="House Number"
                            />
                            <TextInput
                              name="house_number"
                              value={data?.address?.house_number || ''}
                              placeholder="House Number"
                              handleChange={e =>
                                handleAddressChange(
                                  'house_number',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="w-full">
                            <InputLabel className="mb-2 " value="City" />
                            <TextInput
                              name="city"
                              value={data?.address?.city || ''}
                              placeholder="City"
                              handleChange={e =>
                                handleAddressChange('city', e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full">
                            <InputLabel
                              className="mb-2 "
                              value="State/Region"
                            />
                            <TextInput
                              name="state"
                              value={data?.address?.state || ''}
                              placeholder="State/Region"
                              handleChange={e =>
                                handleAddressChange('state', e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full">
                            <InputLabel className="mb-2 " value="Zip Code" />
                            <TextInput
                              name="zip_code"
                              value={data?.address?.zip_code || ''}
                              placeholder="Zip Code"
                              handleChange={e =>
                                handleAddressChange('zip_code', e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full">
                            <InputLabel className="mb-2 " value="Country" />
                            <TextInput
                              name="country"
                              value={data?.address?.country || ''}
                              placeholder="Country"
                              handleChange={e =>
                                handleAddressChange('country', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <ReactSelect
                          isClearable
                          className="mt-2"
                          value={''}
                          handleInputChange={handleInputChange}
                          options={suggestions?.map(suggestion => ({
                            label: suggestion?.text,
                            value: suggestion?.key,
                            sourceIndex: suggestion?.sourceIndex,
                          }))}
                          onChange={address => {
                            if (address) {
                              handleSuggestionClick({
                                text: address.label,
                                key: address.value,
                                sourceIndex: address.sourceIndex,
                              });
                            }
                          }}
                        />
                      )}{' '}
                    </>
                  ) : ['Multi Choice', 'Single Choice'].includes(
                      field?.type
                    ) ? (
                    <ReactSelect
                      required={field?.is_required}
                      name={field?.key}
                      options={canvasFields
                        ?.find(
                          canvasField =>
                            canvasField?.id ==
                            (isLeadEdit ? field?.canvas_field_id : field?.id)
                        )
                        ?.options?.map(option => ({
                          label: option?.title,
                          value: option?.id,
                        }))}
                      onChange={e => handleLeadMeta(field.id, e.value)}
                      value={field.value || ''}
                      className="mt-2.5"
                      isMulti={field?.type == 'Multi Choice'}
                    />
                  ) : field?.type === 'Date' ? (
                    <Flatpickr
                      required={field?.is_required}
                      value={field.value}
                      onChange={([time], date) => {
                        handleLeadMeta(field.id, date);
                      }}
                      className="mt-2 w-full rounded-md border border-latisGray-600 p-2 text-sm"
                      options={{ dateFormat: 'Y-m-d' }}
                    />
                  ) : field?.type === 'Date Time' ? (
                    <>
                      <Flatpickr
                        required={field?.is_required}
                        value={field.value}
                        onChange={([time]) => {
                          handleLeadMeta(
                            field.id,
                            moment(time).format('Y-m-d H:i:s')
                          );
                        }}
                        className="mt-2 w-full rounded-md border border-latisGray-600 p-2 text-sm"
                        options={{
                          dateFormat: 'Y-m-d H:i:s',
                          enableTime: true,
                        }}
                      />
                    </>
                  ) : field?.type === 'Multi Line' ? (
                    <TextAreaInput
                      required={field?.is_required}
                      name={`meta_${field.id}`}
                      value={
                        data?.meta_data?.find(meta => meta.id === field.id)
                          ?.value || ''
                      }
                      placeholder={field.name}
                      handleChange={e =>
                        handleLeadMeta(field.id, e.target.value)
                      }
                    />
                  ) : field?.type === 'Phone' ? (
                    <PhoneInput
                      required={field?.is_required}
                      handleChange={phoneNumber =>
                        handleLeadMeta(field.id, phoneNumber)
                      }
                      value={field?.value || ''}
                    />
                  ) : (
                    <TextInput
                      required={field?.is_required}
                      type={field?.type === 'Phone' ? 'Number' : field?.type}
                      name={field.key}
                      value={field?.value || ''}
                      placeholder={field.name}
                      handleChange={e =>
                        handleLeadMeta(field.id, e.target.value)
                      }
                    />
                  )}
                  <InputError
                    message={errors[`meta_data.${index}.value`]}
                    className="mt-2"
                  />
                </div>
              </>
            ) : null
          )}
        <div className="px-4 py-2 ">
          <InputLabel className="mb-2 " value="Office" required />
          <ReactSelect
            required
            name="office_id"
            options={officeOptions}
            onChange={office => handleLead('office_id', office.value)}
            value={data?.office_id || ''}
            className="mt-2.5"
          />
          <InputError message={errors.office_id} className="mt-2" />
        </div>
        <div className="col-span-2 px-4 ">
          <InputLabel className="text-semibold mb-2" value="Owner" required />
          <ReactSelect
            required
            name="owner_id"
            options={userOptions}
            onChange={owner => handleLead('owner_id', owner.value)}
            value={data?.owner_id || ''}
            className="mt-2.5"
          />
          <InputError message={errors.owner_id} className="mt-2" />
        </div>
      </div>

      <div className="col-span-2 flex flex-wrap items-center justify-center gap-4 border-t p-4">
        <SecondaryButton onClick={onClose} className="flex-1">
          Cancel
        </SecondaryButton>
        <PrimaryButton type="button" className="flex-1 " onClick={e => Save(e)}>
          {isLeadEdit ? 'Save' : 'Create'}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default LeadForm;
