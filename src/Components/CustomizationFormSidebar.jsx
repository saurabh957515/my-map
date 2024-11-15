import React, { Fragment, useMemo } from 'react';
import { Dialog, Disclosure, Tab, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import uuidv4, { classNames } from '@/Providers/helpers';
import ReactSelect from './ReactSelect';
import InputLabel from './InputLabel';
import TextInput from './TextInput';
import ToggleSwitch from './ToggleSwitch';
import NoSelectedWarning from './NoSelectedWarning';

function CustomizationFormSidebar({
  show,
  onClose,
  selectedField,
  setSelectField,
  components,
  className,
}) {
  function handleChange(name, value, type) {
    setSelectField(pre => ({
      ...pre,
      [name]: value,
    }));
  }
  const ruleField = {
    id: uuidv4(),
    fieldId: '',
    operator: '',
    value: '',
  };
  const checkAddRule =
    components?.fields?.length - 2 ===
    selectedField?.conditionalLogic?.rules?.length;
  const addRule = () => {
    setSelectField(pre => ({
      ...pre,
      conditionalLogic: {
        ...pre?.conditionalLogic,
        rules: [...pre?.conditionalLogic?.rules, ruleField],
      },
    }));
  };

  const handleOptions = (value, newLabel) => {
    setSelectField(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.value === value
          ? { ...option, label: newLabel, value: newLabel }
          : option
      ),
    }));
  };

  const handleRule = (name, value, index) => {
    const newField = _.cloneDeep(selectedField);
    newField['conditionalLogic']['rules'][index][name] = value;
    setSelectField(newField);
  };
  const removeRule = id => {
    setSelectField(pre => ({
      ...pre,
      conditionalLogic: {
        ...pre?.conditionalLogic,
        rules: pre?.conditionalLogic?.rules?.filter(rule => rule?.id !== id),
      },
    }));
  };

  const ruleOptions = useMemo(() => {
    let currentRules = [];

    selectedField?.conditionalLogic?.rules?.forEach(field => {
      if (field?.fieldId) {
        currentRules.push(field?.fieldId);
      }
    });

    const newOptions = components?.fields
      ?.filter(
        field =>
          field?.id !== selectedField?.id &&
          field?.type !== 'button' &&
          !currentRules?.includes(field?.id)
      )
      ?.map(field => ({
        label: field?.label,
        value: field?.id,
      }));
    return newOptions;
  }, [selectedField]);
  return (
    <>
      {show && (
        <div
          className={classNames(
            'duration-400h-full scrollbar-hide overflow-y-auto  border-l bg-white transition-all',
            className
          )}
        >
          <div className={classNames('w-full  transition-all ')}>
            <h2 className="sticky top-0 z-50 mb-1 flex justify-between border-b bg-white px-7 py-7 text-xl font-semibold leading-6">
              Setting
              <span onClick={onClose}>
                <XMarkIcon className="h-6 w-6 cursor-pointer" />
              </span>
            </h2>
            <div className="px-7 py-6">
              {Object.keys(selectedField)?.length > 0 ? (
                <div className="grid w-full grid-cols-2 space-y-2 ">
                  <Disclosure className="col-span-2 " as="div">
                    {({ open, close }) => (
                      <div className="w-full ">
                        <Disclosure.Button
                          className={classNames('flex w-full justify-between')}
                        >
                          <span className="text-sm font-semibold capitalize text-latisGray-900">
                            General
                          </span>
                          <span className="ml-6 flex h-7 items-center ">
                            <ChevronDownIcon
                              className={classNames(
                                open && 'rotate-180 ',
                                'ml-2 h-5 w-5 '
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>

                        <Disclosure.Panel className="space-y-2 pb-4" as="dd">
                          <div>
                            <InputLabel
                              className="text-sm text-latisGray-800"
                              value={'Label'}
                            />
                            <TextInput
                              handleChange={e =>
                                handleChange('label', e.target.value)
                              }
                              value={selectedField?.label}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <InputLabel
                              className="text-sm text-latisGray-800"
                              value={'Option Label'}
                            />
                            <ReactSelect
                              options={[
                                { label: 'Small', value: 'small' },
                                {
                                  label: 'Medium',
                                  value: 'medium',
                                },
                                {
                                  label: 'Large',
                                  value: 'large',
                                },
                              ]}
                              value={selectedField?.value}
                              onChange={font => {
                                handleChange('size', font?.value);
                              }}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <InputLabel
                              className="text-sm text-latisGray-800"
                              value={'Description'}
                            />
                            <TextInput
                              handleChange={e =>
                                handleChange('description', e.target.value)
                              }
                              value={selectedField?.description}
                              className="mt-2"
                            />
                          </div>
                          <div></div>
                          <div>
                            <InputLabel
                              className="text-sm text-latisGray-800"
                              value={'Default Value'}
                            />
                            <TextInput
                              handleChange={e =>
                                handleChange('defalutvalue', e.target.value)
                              }
                              value={selectedField?.defalutvalue}
                              className="mt-2"
                            />
                          </div>

                          {!selectedField?.systemField && (
                            <div className="flex items-center space-x-10">
                              <label
                                htmlFor="required-checkbox"
                                className="text-sm text-latisGray-800"
                              >
                                Required
                              </label>
                              <input
                                type="checkbox"
                                id="required-checkbox"
                                className="pb-1"
                                name="required"
                                value={selectedField?.value}
                                onChange={e =>
                                  handleChange('isRequired', e.target.checked)
                                }
                                checked={selectedField?.isRequired}
                              />
                            </div>
                          )}
                          {!selectedField?.systemField && (
                            <div className="flex items-center space-x-14">
                              <InputLabel
                                className="text-sm text-latisGray-800"
                                value={'Visible'}
                              />
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    id="visible_id"
                                    name="visibility"
                                    value="visible"
                                    checked={
                                      selectedField?.visibility === 'visible'
                                    }
                                    onChange={e => {
                                      handleChange(
                                        'visibility',
                                        e.target.value
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor="visible_id"
                                    style={{
                                      marginLeft: '4px',
                                      fontSize: '12px',
                                    }}
                                  >
                                    Visible
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="hide_id"
                                    type="radio"
                                    name="visibility"
                                    value="hide"
                                    checked={
                                      selectedField?.visibility === 'hide'
                                    }
                                    onChange={e => {
                                      handleChange(
                                        'visibility',
                                        e.target.value
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor="hide_id"
                                    style={{
                                      marginLeft: '4px',
                                      fontSize: '14px',
                                    }}
                                  >
                                    Hide
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>

                  {!selectedField?.systemField &&
                    selectedField?.options &&
                    selectedField?.options?.length > 0 && (
                      <Disclosure className="col-span-2 border-t pt-4" as="div">
                        {({ open }) => (
                          <div className="w-full">
                            <Disclosure.Button
                              className={classNames(
                                'flex w-full justify-between'
                              )}
                            >
                              <span className="text-sm font-semibold capitalize text-latisGray-900">
                                Option Value
                              </span>

                              <span className="ml-6 flex h-7 items-center">
                                <ChevronDownIcon
                                  className={classNames(
                                    open && 'rotate-180',
                                    'ml-2 h-5 w-5'
                                  )}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>

                            <Disclosure.Panel
                              className="space-y-2 pb-4"
                              as="dd"
                            >
                              {selectedField?.options?.map((option, index) => (
                                <div key={option?.id}>
                                  <InputLabel
                                    className="text-sm text-latisGray-800"
                                    value={`Option ${index + 1}`}
                                  />
                                  <TextInput
                                    handleChange={e =>
                                      handleOptions(
                                        option.value,
                                        e.target.value
                                      )
                                    }
                                    value={option?.label}
                                    className="mt-2"
                                  />
                                </div>
                              ))}
                            </Disclosure.Panel>
                          </div>
                        )}
                      </Disclosure>
                    )}
                  {!selectedField?.systemField && (
                    <Disclosure className="col-span-2 border-t pt-4" as="div">
                      {({ open, close }) => (
                        <div className="w-full ">
                          <Disclosure.Button
                            className={classNames(
                              'flex w-full justify-between'
                            )}
                          >
                            <span className="text-sm font-semibold capitalize text-latisGray-900">
                              Advanced
                            </span>
                            <span className="ml-6 flex h-7 items-center ">
                              <ChevronDownIcon
                                className={classNames(
                                  open && 'rotate-180 ',
                                  'ml-2 h-5 w-5 '
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>

                          <Disclosure.Panel className="space-y-2" as="dd">
                            <div className="col-span-2 flex w-full items-center ">
                              <span className="mr-5">
                                Enable Conditional Logic{' '}
                              </span>
                              <ToggleSwitch
                                enabled={
                                  selectedField?.conditionalLogic?.enabled
                                }
                                onChange={value => {
                                  setSelectField(pre => ({
                                    ...pre,
                                    conditionalLogic: {
                                      ...pre?.conditionalLogic,
                                      enabled: value,
                                    },
                                  }));
                                }}
                              />{' '}
                            </div>
                            <div className="col-span-2 w-full space-y-2 overflow-hidden ">
                              {selectedField?.conditionalLogic?.enabled && (
                                <>
                                  {' '}
                                  <div className="text-base font-semibold text-latisGray-900">
                                    Condition
                                  </div>
                                  <div className="flex w-full items-center gap-x-2 ">
                                    <ReactSelect
                                      onChange={type => {
                                        setSelectField(pre => {
                                          const newPre = { ...pre };
                                          newPre['conditionalLogic'][
                                            'actionType'
                                          ] = type?.value;
                                          return newPre;
                                        });
                                      }}
                                      value={
                                        selectedField?.conditionalLogic
                                          ?.actionType
                                      }
                                      options={[
                                        { label: 'Show', value: 'show' },
                                        {
                                          label: 'Hide',
                                          value: 'hide',
                                        },
                                      ]}
                                      className="w-1/4"
                                    />{' '}
                                    <span className="mx-2"> Field</span>{' '}
                                    <ReactSelect
                                      onChange={logic => {
                                        setSelectField(pre => {
                                          const newPre = { ...pre };
                                          newPre['conditionalLogic'][
                                            'logicType'
                                          ] = logic?.value;
                                          return newPre;
                                        });
                                      }}
                                      value={
                                        selectedField?.conditionalLogic
                                          ?.logicType
                                      }
                                      options={[
                                        { label: 'Any', value: 'any' },
                                        {
                                          label: 'All',
                                          value: 'all',
                                        },
                                      ]}
                                      className="w-1/4"
                                    />
                                    <span className="mx-2"> Satisfied</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="text-base font-semibold text-latisGray-900">
                                      Condition Rules
                                    </div>
                                    {selectedField?.conditionalLogic?.rules?.map(
                                      (rule, ruleIndex, rules) => (
                                        <div
                                          key={rule?.id}
                                          className="grid grid-cols-12 items-center gap-x-4"
                                        >
                                          <ReactSelect
                                            onChange={field =>
                                              handleRule(
                                                'fieldId',
                                                field?.value,
                                                ruleIndex
                                              )
                                            }
                                            value={{
                                              label: components?.fields?.find(
                                                field =>
                                                  field?.id === rule?.fieldId
                                              )?.label,
                                              value: rule?.fieldId,
                                            }}
                                            options={ruleOptions}
                                            className="col-span-4"
                                          />
                                          <ReactSelect
                                            value={rule?.operator}
                                            onChange={field =>
                                              handleRule(
                                                'operator',
                                                field?.value,
                                                ruleIndex
                                              )
                                            }
                                            options={[
                                              {
                                                label: 'Is',
                                                value: 'is',
                                              },
                                              {
                                                label: 'Is Not',
                                                value: 'is_not',
                                              },
                                              {
                                                label: 'Greater Than',
                                                value: 'greater_than',
                                              },
                                              {
                                                label: 'Less Than',
                                                value: 'less_than',
                                              },
                                              {
                                                label: 'Contains',
                                                value: 'contains',
                                              },
                                              {
                                                label: 'Starts With',
                                                value: 'starts_with',
                                              },
                                              {
                                                label: 'Ends With',
                                                value: 'ends_with',
                                              },
                                            ]}
                                            className="col-span-4"
                                          />
                                          <span className="col-span-3">
                                            <TextInput
                                              handleChange={e =>
                                                handleRule(
                                                  'value',
                                                  e.target?.value,
                                                  ruleIndex
                                                )
                                              }
                                              value={rule?.value}
                                              className="col-span-3 w-full"
                                            />
                                          </span>

                                          <span className="col-span-1 flex flex-col items-center">
                                            {rules?.length > 1 && (
                                              <MinusCircleIcon
                                                onClick={() =>
                                                  removeRule(rule?.id)
                                                }
                                                className="h-6 w-6 text-latisSecondary-800"
                                              />
                                            )}
                                            {!checkAddRule &&
                                              rules?.length - 1 ===
                                                ruleIndex && (
                                                <PlusCircleIcon
                                                  onClick={addRule}
                                                  className="h-6 w-6 text-latisSecondary-800"
                                                />
                                              )}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </Disclosure.Panel>
                        </div>
                      )}
                    </Disclosure>
                  )}
                </div>
              ) : (
                <div>
                  <NoSelectedWarning
                    title="No Form Field Selected"
                    message="Please select field to customize the form"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomizationFormSidebar;
