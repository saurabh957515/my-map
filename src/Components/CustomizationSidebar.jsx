import React, { Fragment, useState } from 'react';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/Providers/helpers';
import RangeSlider from './RangeSlider';
import { useEditor, useNode } from '@craftjs/core';
import ReactSelect from './ReactSelect';

function CustomizationSidebar({ show, onClose, size, className }) {
  const {
    actions: { setProp },
    border,
    fontSize,
    fontWeight,
    textDecoration,
    color,
    fontStyle,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    title,
    hideInApp,
    allowCopyPaste,
    parent,
    displayName,
    fontFamily,
  } = useNode(node => ({
    border: node.data.props.border,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    textDecoration: node.data.props.textDecoration,
    color: node.data.props.color,
    fontStyle: node.data.props.fontStyle,
    paddingTop: node.data.props.paddingTop,
    paddingBottom: node.data.props.paddingBottom,
    paddingLeft: node.data.props.paddingLeft,
    paddingRight: node.data.props.paddingRight,
    title: node.data.props.title,
    hideInApp: node.data.props.hideInApp,
    allowCopyPaste: node.data.props.allowCopyPaste,
    parent: node.data.parent,
    displayName: node.data.displayName,
    fontFamily: node.data?.props.fontFamily,
  }));

  const [FontWeight, setFontWeight] = useState(fontWeight);
  const [TextDecoration, setUnderline] = useState(textDecoration);
  const [FontStyle, setFontStyle] = useState(fontStyle);
  const [FontFamily, setFontFamily] = useState(fontFamily);

  function handleRangeSlider(value, type) {
    setProp(props => {
      switch (type) {
        case 'left':
          return (props.paddingLeft = Number(value));
        case 'right':
          return (props.paddingRight = Number(value));
        case 'top':
          return (props.paddingTop = Number(value));
        case 'bottom':
          return (props.paddingBottom = Number(value));
        case 'size':
          return (props.fontSize = value);
        default:
          return;
      }
    });
  }

  function handleFontProperty(type, value) {
    if (type === 'fontWeight') {
      const fontWeight = FontWeight === 'normal' ? 'bold' : 'normal';
      setFontWeight(fontWeight);
      setProp(props => {
        props.fontWeight = fontWeight;
      });
    } else if (type === 'fontStyle') {
      const fontStyle = FontStyle === 'normal' ? 'italic' : 'normal';
      setFontStyle(fontStyle);
      setProp(props => {
        props.fontStyle = fontStyle;
      });
    } else if (type === 'textDecoration') {
      const underline = TextDecoration === 'underline' ? null : 'underline';
      setUnderline(underline);
      setProp(props => {
        props.textDecoration = underline;
      });
    } else if (type === 'fontFamily') {
      setFontFamily(value);
      setProp(props => {
        props.fontFamily = value;
      });
    }
  }
  const fontOptions = [
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
  ];

  const sizeOptions = [
    { value: '24', label: '24' },
    { value: '22', label: '22' },
    { value: '20', label: '20' },
  ];
  console.log(FontFamily);
  return (
    <Transition.Root show={show}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 w-0"
          enterTo="opacity-100 w-[100%]"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 w-[100%]"
          leaveTo="opacity-0 w-[0%]"
        >
          <div
            className={classNames(
              'fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity'
            )}
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 w-0 duration-300"
          enterTo="opacity-100 w-[20%]"
          leave="ease-in w-0 duration-200"
          leaveFrom="opacity-100 w-[25%]"
          leaveTo="opacity-0 w-0 duration-300"
        >
          <div
            className={classNames(
              'duration-400 fixed right-0  top-0 z-10 h-[100vh] overflow-y-auto bg-white transition-all'
            )}
          >
            <Dialog.Panel
              className={classNames('w-full  transition-all', className)}
            >
              <h2 className="flex justify-between border-b px-7 py-5 text-xl font-semibold leading-6">
                Setting
                <span onClick={onClose}>
                  <XMarkIcon className="h-6 w-6 cursor-pointer" />
                </span>
              </h2>
              <div className="px-7 py-6">
                <Tab.Group>
                  <Tab.List>
                    <div className="z-0 flex space-x-4 border-b">
                      {['Customization', 'Link Price Guide']?.map((tab, i) => (
                        <Tab
                          key={i}
                          className={({ selected }) =>
                            classNames(
                              'pb-2 text-left text-sm focus:outline-none',
                              selected
                                ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                                : 'text-latisGray-800'
                            )
                          }
                        >
                          {tab}
                        </Tab>
                      ))}
                    </div>
                  </Tab.List>
                  <Tab.Panels className="mt-4">
                    <Tab.Panel>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="col-span-2 mt-4 space-y-2">
                          <div className="text-sm font-normal text-latisGray-800">
                            Title Font Size
                          </div>
                          <RangeSlider
                            value={fontSize}
                            onSlide={value => handleRangeSlider(value, 'size')}
                          />
                        </div>
                        {displayName === 'Container' && (
                          <>
                            <div className="col-span-2 text-sm font-normal text-latisGray-800">
                              padding
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-normal text-latisGray-800">
                                Left
                              </div>
                              <RangeSlider
                                value={parseInt(paddingLeft)}
                                onSlide={value =>
                                  handleRangeSlider(value, 'left')
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-normal text-latisGray-800">
                                Right
                              </div>
                              <RangeSlider
                                value={parseInt(paddingRight)}
                                onSlide={value =>
                                  handleRangeSlider(value, 'right')
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-normal text-latisGray-800">
                                Top
                              </div>
                              <RangeSlider
                                value={parseInt(paddingTop)}
                                onSlide={value =>
                                  handleRangeSlider(value, 'top')
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-normal text-latisGray-800">
                                Bottom
                              </div>
                              <RangeSlider
                                value={parseInt(paddingBottom)}
                                onSlide={value =>
                                  handleRangeSlider(value, 'bottom')
                                }
                              />
                            </div>
                          </>
                        )}

                        <div className="flex items-center text-sm font-normal text-latisGray-800">
                          Text Formating
                        </div>

                        <div className="flex h-14 justify-between border p-2">
                          <div
                            onClick={() => handleFontProperty('fontWeight')}
                            className={classNames(
                              'w-fit  px-3 py-1 italic text-[#b5b5c3]',
                              FontWeight === 'bold' && 'border border-black'
                            )}
                          >
                            B
                          </div>
                          <div
                            onClick={() => handleFontProperty('fontStyle')}
                            className={classNames(
                              'w-fit  px-4 py-1 italic text-[#b5b5c3]',
                              FontStyle === 'italic' && 'border border-black'
                            )}
                          >
                            I
                          </div>
                          <div
                            onClick={() => handleFontProperty('textDecoration')}
                            className={classNames(
                              'w-fit  px-3 py-1 italic text-[#b5b5c3]',
                              TextDecoration === 'underline' &&
                                'border border-black'
                            )}
                          >
                            U
                          </div>
                        </div>
                        <div className="flex items-center text-sm font-normal text-latisGray-800">
                          Text Color
                        </div>
                        <div className="border p-2">
                          <input
                            onChange={e => {
                              setProp(props => {
                                props.color = e.target.value;
                              });
                            }}
                            className="w-full"
                            type="color"
                            id="head"
                            name="head"
                            value={color}
                          />
                        </div>
                        <div className="col-span-2 mt-3 space-y-4">
                          <div className="flex flex-col">
                            <label className="mb-2 text-sm font-normal text-latisGray-900">
                              Header
                            </label>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                              <ReactSelect
                                options={fontOptions}
                                placeholder="Robot"
                                value={FontFamily}
                                onChange={e =>
                                  handleFontProperty('fontFamily', e?.value)
                                }
                              />
                              <ReactSelect
                                options={sizeOptions}
                                placeholder="24"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <label className="mb-2 text-sm font-normal text-latisGray-900">
                              Question
                            </label>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                              <ReactSelect
                                options={fontOptions}
                                placeholder="Robot"
                                value={FontFamily}
                                onChange={e =>
                                  handleFontProperty('fontFamily', e?.value)
                                }
                              />
                              <ReactSelect
                                options={sizeOptions}
                                placeholder="24"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <label className="mb-2 text-sm font-normal text-latisGray-900">
                              Text
                            </label>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                              <ReactSelect
                                options={fontOptions}
                                placeholder="Robot"
                              />
                              <ReactSelect
                                options={sizeOptions}
                                placeholder="24"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>Content 2</Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}

export default CustomizationSidebar;
