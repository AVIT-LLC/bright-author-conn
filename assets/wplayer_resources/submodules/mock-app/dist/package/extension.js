const mockGridRange = {
    id: 'gridRangeId',
    caption: 'Range Grid',
    type: 'gridRange',
    link: true,
    list: [
        {
            type: 'range',
            id: 'gridRangeSlider0',
            caption: 'grid range slider 1',
            min: -10,
            max: 30,
            step: 2,
            value: 10,
            property: '',
            size: 'small',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'range',
            id: 'gridRangeSlider1',
            caption: 'grid range slider 2',
            min: -20,
            max: 20,
            step: 1,
            value: 0,
            property: '',
            size: 'small',
            position: {
                x: 0,
                y: 0
            }
        }
    ],
    size: 'medium',
    position: {
        x: 30,
        y: 50
    }
};
const mockInnerAccordion = {
    type: 'accordion',
    id: 'innerAccordion',
    caption: 'Inner accordion',
    list: [
        {
            type: 'radio',
            id: 'radioSelectStyleAc01',
            caption: 'Inner radio',
            list: ['Grid', 'List'],
            value: 'Grid'
        },
        {
            type: 'divider',
            id: 'divider11'
        },
        {
            type: 'toggle',
            id: 'toggleNavAudioAc11',
            caption: 'Inner toggle - test widget manifest 2',
            value: true
        }
    ],
    size: 'medium'
};
const mockAccordion = {
    type: 'accordion',
    id: 'accordion1',
    caption: 'Logos',
    rootSection: true,
    list: [
        {
            type: 'radio',
            id: 'radioSelectStyleAc0',
            caption: 'Select a layout style.',
            list: ['Grid', 'List'],
            value: 'Grid'
        },
        {
            type: 'divider',
            id: 'divider1'
        },
        {
            type: 'toggle',
            id: 'toggleNavAudioAc1',
            caption: 'Navigation audio ',
            value: true
        },
        mockInnerAccordion,
        {
            type: 'media',
            caption: 'Image',
            id: 'image',
            mediaType: 'image',
            mode: 'single',
            value: ['images/favicon.svg']
        },
        {
            type: 'font',
            id: 'fontAc2',
            value: {
                fontFamily: 'SamsungOne 300',
                fontSize: 31
            }
        },
        {
            ...mockGridRange,
            position: {
                x: 0,
                y: 0
            }
        }
    ],
    size: 'medium',
    position: {
        x: 0,
        y: -52
    }
};
const mockTabs = {
    type: 'tabs',
    id: 'tabs',
    categories: [
        {
            name: 'Image',
            attachedComponents: ['tabel1', 'tabel2']
        },
        {
            name: 'Background',
            icon: '../images/favicon.svg',
            attachedComponents: ['tabel3', 'tabel4']
        },
        {
            name: 'Tab3',
            attachedComponents: ['tabel5']
        },
        {
            name: 'Tab6',
            attachedComponents: [],
            disabled: true
        }
    ],
    list: [
        {
            type: 'text',
            id: 'tabel1',
            caption: 'Widget Manifest test 4',
            value: '',
            multiline: false,
            label: 'Address',
            size: 'large',
            useTranslate: true
        },
        {
            type: 'number',
            id: 'tabel2',
            caption: 'Please input size of font. Alphanumeric numbers allowed only.',
            value: 10,
            label: 'Font Size',
            min: 5,
            max: 25,
            size: 'large'
        },
        {
            type: 'dropdown',
            id: 'tabel3',
            caption: 'Select your favorite fruit.',
            list: ['Mango', 'Banana', 'Cherry'],
            value: 'Mango',
            size: 'small'
        },
        {
            type: 'img',
            id: 'tabel4',
            caption: 'Apimo Logo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode64',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                },
                {
                    type: 'dropdown',
                    label: 'Dropdown',
                    id: 'dropdownListFruits65',
                    caption: 'Select your favorite fruit.',
                    list: ['Mango', 'Apple'],
                    value: 'Mango'
                }
            ],
            size: 'medium'
        },
        {
            type: 'accordion',
            id: 'tabel5',
            caption: 'Logos',
            list: [
                {
                    type: 'radio',
                    id: 'radioSelectStyleAc0',
                    caption: 'Select a layout style.',
                    list: ['Grid', 'List'],
                    value: 'Grid'
                },
                {
                    type: 'divider',
                    id: 'divider1'
                },
                {
                    type: 'toggle',
                    id: 'toggleNavAudioAc1',
                    caption: 'Navigation audio ',
                    value: true
                }
            ],
            size: 'medium',
            position: {
                x: 0,
                y: -52
            }
        }
    ]
};
const mockAccordionWithTabs = {
    type: 'accordion',
    id: 'accordion2',
    caption: 'Accordion with tabs',
    rootSection: true,
    list: [
        {
            type: 'radio',
            id: 'radioSelectStyleAc2',
            caption: 'Select a layout style.',
            list: ['Grid', 'List'],
            value: 'Grid'
        },
        {
            type: 'divider',
            id: 'divider1'
        },
        mockTabs
    ]
};
const mockGridLarge = {
    type: 'gridImage',
    id: 'logo1',
    caption: 'Logos',
    value: {
        value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
        parameters: {
            inputZipCode: '',
            dropdownListFruits: 'Mango',
            radioSelectStyle: 'Grid'
        }
    },
    list: [
        {
            type: 'img',
            id: 'apimoLogo2',
            caption: 'apimo',
            value: {
                value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
                parameters: {
                    inputZipCode: '',
                    dropdownListFruits: 'Mango',
                    radioSelectStyle: 'Grid'
                }
            },
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode3',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code',
                    size: 'large',
                    position: {
                        x: 20,
                        y: 9
                    }
                },
                {
                    type: 'dropdown',
                    label: 'Dropdown large',
                    id: 'dropdownListFruits4',
                    caption: 'Select your favorite fruit.',
                    list: ['Mango', 'Apple'],
                    value: 'Mango',
                    size: 'large',
                    position: {
                        x: 20,
                        y: 9
                    }
                },
                {
                    type: 'radio',
                    id: 'radioSelectStyle5',
                    caption: 'Select a layout style.',
                    list: ['Grid', 'List'],
                    value: 'Grid',
                    size: 'large',
                    position: {
                        x: 20,
                        y: 9
                    }
                }
            ],
            size: 'large',
            position: {
                x: 20,
                y: 9
            }
        },
        {
            type: 'img',
            id: 'apimoLogo26',
            caption: 'apimo',
            value: {
                value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
                parameters: {
                    hidden111: 'test_hidden'
                }
            },
            parameters: [
                {
                    type: 'hidden',
                    id: 'hidden111',
                    value: 'test_hidden'
                }
            ],
            size: 'large',
            position: {
                x: 20,
                y: 9
            }
        },
        {
            type: 'img',
            id: 'apimoLogo29',
            caption: 'apimo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            size: 'large',
            position: {
                x: 20,
                y: 9
            }
        }
    ],
    size: 'large',
    position: {
        x: 20,
        y: 9
    }
};
const mockGridMedium = {
    type: 'gridImage',
    id: 'logo11',
    caption: 'Logos',
    value: {
        value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
        parameters: {
            inputZipCode: 'test'
        }
    },
    list: [
        {
            type: 'img',
            id: 'apimoLogo12',
            caption: 'apimo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode13',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                }
            ],
            size: 'large',
            position: {
                x: 20,
                y: 9
            }
        },
        {
            type: 'img',
            id: 'apimoLogo214',
            caption: 'apimo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode15',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                }
            ],
            size: 'large',
            position: {
                x: 20,
                y: 9
            }
        }
    ],
    size: 'medium',
    position: {
        x: 20,
        y: 9
    }
};
const mockGridSmall = {
    type: 'gridImage',
    id: 'logo16',
    caption: 'Logos',
    value: {
        value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
        parameters: {
            inputZipCode: 'test'
        }
    },
    list: [
        {
            type: 'img',
            id: 'apimoLogo17',
            caption: 'apimo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                }
            ],
            size: 'large',
            position: {
                x: 20,
                y: 9
            }
        },
        {
            type: 'img',
            id: 'apimoLogo218',
            caption: 'apimo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode19',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                }
            ],
            size: 'large',
            position: {
                x: 20,
                y: 9
            }
        }
    ],
    size: 'small',
    position: {
        x: 20,
        y: 9
    }
};
const configMock = {
    Input: [
        {
            type: 'text',
            id: 'errorText',
            caption: 'Config error text',
            value: '',
            multiline: true,
            label: 'Config error text'
        },
        {
            type: 'webUrl',
            caption: 'Image',
            id: 'weburl',
            value: 'images/favicon.svg',
            showTagAlias: true,
            viewState: 'show'
        },
        {
            type: 'webUrl',
            caption: 'Image',
            id: 'weburl2',
            value: '',
            label: 'http://, https://, rtp://, udp://',
            showTagAlias: false,
            viewState: 'show'
        },
        {
            type: 'webUrl',
            caption: 'viewState: hide',
            id: 'weburl23',
            value: '',
            showTagAlias: false,
            viewState: 'hide'
        },
        {
            type: 'webUrl',
            caption: 'viewState: disable',
            id: 'weburl24',
            value: '',
            showTagAlias: false,
            viewState: 'disable'
        },
        {
            type: 'webUrl',
            caption: 'viewState: disable, showtagAlias: true',
            id: 'weburl2465',
            value: '',
            showTagAlias: true,
            viewState: 'disable'
        },
        {
            type: 'webUrl',
            caption: 'Custom validation disabled (no validation)',
            id: 'weburlCustom1',
            value: 'rtsp://camera.local/stream',
            customValidation: true,
            showTagAlias: false,
            viewState: 'show'
        },
        {
            type: 'webUrl',
            caption: 'Custom validation with rtsp rule',
            id: 'weburlCustom3',
            value: 'rtsp://camera.local/stream',
            customValidation: true,
            validationRules: ['rtsp'],
            showTagAlias: false,
            viewState: 'show'
        },
        {
            type: 'webUrl',
            caption: 'Custom validation with multiple protocols (https, rtsp, udp)',
            id: 'weburlCustom4',
            value: 'udp://stream.local:1234',
            customValidation: true,
            validationRules: ['https', 'rtsp', 'udp'],
            showTagAlias: false,
            viewState: 'show'
        },
        {
            type: 'tagAlias',
            caption: 'viewState: show, size: small',
            id: 'tagAlias1',
            value: '',
            viewState: 'show',
            size: 'small'
        },
        {
            type: 'tagAlias',
            caption: 'viewState: show, size: medium',
            id: 'tagAlias2',
            value: '',
            viewState: 'show',
            size: 'medium'
        },
        {
            type: 'tagAlias',
            caption: 'viewState: disable, size: medium(default), value: []',
            id: 'tagAlias3',
            value: '',
            label: 'Add values...',
            viewState: 'disable',
            size: 'medium'
        },
        {
            type: 'tagAlias',
            caption: 'viewState: hide, size: medium',
            id: 'tagAlias4',
            value: '',
            viewState: 'hide',
            size: 'medium'
        },
        {
            type: 'tagAlias',
            caption: 'viewState: show, size: large',
            id: 'tagAlias5',
            value: '',
            viewState: 'show',
            size: 'large'
        },
        {
            type: 'text',
            id: 'inputTranslation1',
            caption: 'Text with tanslation',
            value: '',
            multiline: true,
            charactersLimit: 300,
            label: 'Address',
            size: 'large',
            useTranslate: true
        },
        {
            type: 'text',
            id: 'inputTranslation2',
            caption: 'Text with tanslation',
            value: '',
            multiline: false,
            label: 'Address',
            size: 'large',
            useTranslate: true
        },
        {
            type: 'text',
            id: 'inputAddress10',
            caption: 'Please input your address',
            value: '',
            multiline: true,
            charactersLimit: 300,
            label: 'Address',
            size: 'large'
        },
        {
            type: 'text',
            id: 'inputAddress11',
            caption: 'Please input your address',
            value: '',
            multiline: true,
            charactersLimit: 300,
            label: 'Address',
            size: 'medium'
        },
        {
            type: 'text',
            id: 'inputZipCode0',
            caption: 'Not displayed',
            value: '',
            label: 'Zip code',
            size: 'large',
            viewState: 'hide'
        },
        {
            type: 'text',
            id: 'inputZipCode20',
            caption: 'Please input your ZIP code',
            value: '',
            label: 'Zip code',
            size: 'large'
        },
        {
            type: 'text',
            id: 'inputZipCode21',
            caption: 'Please input your ZIP code',
            value: '',
            label: 'Zip code',
            size: 'medium'
        },
        {
            type: 'text',
            id: 'inputZipCode22',
            caption: 'Please input your ZIP code',
            value: '',
            label: 'Zip code',
            size: 'small'
        },
        {
            type: 'text',
            id: 'inputZipCode23',
            caption: 'Disabled text input',
            value: '',
            label: 'Zip code',
            size: 'small',
            viewState: 'disable'
        },
        {
            type: 'number',
            id: 'inputFontSize0',
            caption: 'Please input size of font. Alphanumeric numbers allowed only.',
            value: 10,
            label: 'Font Size',
            min: 5,
            max: 25,
            size: 'large'
        },
        {
            type: 'number',
            id: 'inputFontSize1',
            caption: 'Please input size of font.',
            value: 16,
            label: 'Font Size',
            min: 5,
            max: 25,
            numericType: 'float',
            size: 'medium'
        },
        {
            type: 'number',
            id: 'inputFontSize2',
            caption: 'Please input size of font. Alphanumeric numbers allowed only.',
            value: 20,
            label: 'Font Size',
            min: 5,
            max: 25,
            numericType: 'decimal',
            size: 'small'
        },
        {
            type: 'number',
            id: 'inputFontSize3',
            caption: 'Please input size of font. Alphanumeric numbers allowed only.',
            value: 10,
            label: 'Font Size',
            min: 5,
            max: 25,
            units: 'px',
            size: 'large'
        },
        {
            type: 'number',
            id: 'inputFontSize4',
            caption: 'Please input size of font.',
            value: 16,
            label: 'Font Size',
            min: 5,
            max: 25,
            numericType: 'float',
            units: 'px',
            size: 'medium'
        },
        {
            type: 'number',
            id: 'inputFontSize5',
            caption: 'Please input size of font. Alphanumeric numbers allowed only.',
            value: 20,
            label: 'Font Size',
            min: 5,
            max: 25,
            numericType: 'decimal',
            units: 'px',
            size: 'small'
        },
        {
            type: 'number',
            id: 'inputFontSize6',
            caption: 'Disabled number input',
            value: 20,
            label: 'Font Size',
            min: 5,
            max: 25,
            numericType: 'decimal',
            size: 'small',
            viewState: 'disable'
        },
        {
            type: 'number',
            id: 'inputFontSize7',
            caption: 'Test disabled number for widget manifest',
            value: 15,
            label: 'Test Number',
            min: 1,
            max: 100,
            size: 'medium',
            viewState: 'disable'
        },
        {
            type: 'date',
            id: 'dateCalendar23',
            caption: 'Choose a date for meeting',
            value: '2023-01-26',
            format: 'YYYY-MM-DD',
            size: 'medium',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'date',
            id: 'dateCalendar24',
            caption: 'Choose a date for meeting',
            value: '2023-01-26',
            format: 'YYYY-MM-DD',
            size: 'large',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'date',
            id: 'dateCalendar25',
            caption: 'Choose a date for meeting',
            value: '2023-01-26',
            format: 'YYYY-MM-DD',
            size: 'small',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'date',
            id: 'dateCalendar25',
            caption: 'Disabled date input',
            value: '2023-01-26',
            format: 'YYYY-MM-DD',
            size: 'small',
            position: {
                x: 0,
                y: 0
            },
            viewState: 'disable'
        },
        {
            type: 'time',
            id: 'timeClock26',
            caption: 'Choose a time for meeting',
            value: '13:30',
            format: 'HH:MM',
            size: 'small',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'time',
            id: 'timeClock27',
            caption: 'Choose a time for meeting',
            value: '13:30',
            format: 'HH:MM',
            size: 'medium',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'time',
            id: 'timeClock28',
            caption: 'Choose a time for meeting',
            value: '13:30',
            format: 'HH:MM',
            size: 'large',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'time',
            id: 'timeClock29',
            caption: 'Disabled time input',
            value: '13:30',
            format: 'HH:MM',
            size: 'large',
            position: {
                x: 10,
                y: 30
            },
            viewState: 'disable'
        },
        {
            type: 'message',
            id: 'message',
            value: 'Test message',
            size: 'small',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'message',
            id: 'message2',
            value: 'Test message2',
            size: 'medium',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'message',
            id: 'message3',
            value: 'Test message3',
            size: 'large',
            position: {
                x: 40,
                y: -10
            }
        },
        {
            type: 'checkbox',
            id: 'checkBox29',
            caption: 'I am a robot',
            value: true,
            size: 'small',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'checkbox',
            id: 'checkBox30',
            caption: 'I am a robot',
            value: true,
            size: 'medium',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'checkbox',
            id: 'checkBox31',
            caption: 'I am a robot',
            value: true,
            size: 'large',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'checkbox',
            id: 'checkBox99',
            caption: 'Disabled checkbox',
            value: true,
            size: 'large',
            position: {
                x: 0,
                y: 0
            },
            viewState: 'disable'
        },
        {
            type: 'radio',
            id: 'checkBox32',
            caption: 'Choose your favourite fruit',
            value: 'apple',
            list: ['apple', 'mango', 'banana'],
            size: 'large',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'radio',
            id: 'checkBox33',
            caption: 'Choose your favourite fruit',
            value: 'apple',
            list: ['apple', 'mango', 'banana'],
            size: 'medium',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'radio',
            id: 'checkBox34',
            caption: 'Choose your favourite fruit',
            value: 'apple',
            list: ['apple', 'mango', 'banana'],
            size: 'small',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'radio',
            id: 'checkBox35',
            caption: 'Disabled radio input',
            value: 'apple',
            list: ['apple', 'mango', 'banana'],
            size: 'small',
            position: {
                x: 10,
                y: 30
            },
            viewState: 'disable'
        },
        {
            type: 'color',
            id: 'colorPalette34',
            caption: 'Choose your color with parameters',
            value: '#e66465',
            size: 'large',
            position: {
                x: 10,
                y: 30
            },
            parameters: [
                {
                    type: 'range',
                    id: 'rangeSlider61',
                    caption: 'Dynamic slider 1',
                    min: -10,
                    max: 20,
                    step: 2,
                    value: 5,
                    property: ''
                },
                {
                    type: 'range',
                    id: 'rangeSlider62',
                    caption: 'Dynamic slider 2',
                    min: 0,
                    max: 5,
                    step: 1,
                    value: 0,
                    property: ''
                }
            ]
        },
        {
            type: 'color',
            id: 'colorPalette35',
            caption: 'Choose your color',
            value: '#e66465',
            size: 'large',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'color',
            id: 'colorPalette36',
            caption: 'Choose your color',
            value: '#e66465',
            size: 'medium',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'color',
            id: 'colorPalette37',
            caption: 'Choose your color',
            value: '#e66465',
            size: 'small',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'color',
            id: 'colorPalette38',
            caption: 'Disabled color input',
            value: '#e66465',
            size: 'small',
            position: {
                x: 10,
                y: 30
            },
            viewState: 'disable'
        },
        {
            type: 'color',
            id: 'colorPalette39',
            caption: 'hideOpacity color input',
            value: '#e66465',
            size: 'small',
            position: {
                x: 10,
                y: 30
            },
            hideOpacity: true
        },
        {
            type: 'color',
            id: 'colorPalette40',
            caption: 'colorChips color input with default colors',
            value: '#e66465',
            size: 'medium',
            position: {
                x: 10,
                y: 30
            },
            displayType: 'colorChips'
        },
        {
            type: 'color',
            id: 'colorPalette41',
            caption: 'colorChips color input with custom colors',
            value: '#a796c9',
            size: 'medium',
            position: {
                x: 10,
                y: 30
            },
            displayType: 'colorChips',
            colorChips: [
                '#ebd8f0', '#d5b8d8', '#f8eefd', '#e5cbe2',
                '#bbb1bd', '#aa99ae', '#9e8dff', '#a28da7',
                '#e5c1ea', '#d3c6fd', '#c0adf0', '#a796c9',
            ]
        },
        {
            type: 'media',
            id: 'mediagrid0',
            display: 'grid',
            mode: 'multi',
            mediaType: 'all',
            multiLimit: 6,
            caption: 'media all - grid (object format)',
            value: [
                { src: 'images/favicon.svg', thumb: 'images/favicon.svg' },
                { src: 'images/guides.png', thumb: 'images/guides.png' }
            ],
            mediaFormat: 'object'
        },
        {
            type: 'media',
            id: 'mediagrid1',
            display: 'grid',
            mode: 'multi',
            mediaType: 'video',
            multiLimit: 3,
            caption: 'media video - grid multi multiLimit 1',
            value: ['images/favicon.svg', 'images/favicon.svg'],
            mediaFormat: 'string'
        },
        {
            type: 'media',
            id: 'mediacarousel1',
            display: 'carousel',
            mode: 'multi',
            mediaType: 'video',
            multiLimit: 3,
            caption: 'media video - carousel multi  multiLimit 3',
            value: ['images/favicon.svg', 'images/favicon.svg', 'images/favicon.svg']
        },
        {
            type: 'media',
            id: 'mediagrid2',
            display: 'grid',
            mode: 'single',
            mediaType: 'video',
            multiLimit: 9,
            caption: 'Media video - single',
            value: [
                'images/favicon.svg',
                'images/favicon.svg',
                'images/guides.svg',
                'images/favicon.svg',
                'images/guides.svg',
                'images/favicon.svg',
                'images/favicon.svg',
                'images/guides.svg',
                'images/favicon.svg'
            ]
        },
        {
            type: 'media',
            id: 'editMedia1',
            mode: 'single',
            multiLimit: 2,
            mediaType: 'image',
            caption: 'Edit image',
            value: [],
            editable: true
        },
        {
            type: 'media',
            id: 'editMedia2',
            mode: 'multi',
            display: 'grid',
            multiLimit: 6,
            mediaType: 'image',
            caption: 'Edit images',
            value: [],
            editable: true
        },
        {
            type: 'media',
            id: 'mediagrid3',
            display: 'grid',
            mode: 'multi',
            multiLimit: 9,
            mediaType: 'video',
            caption: 'Choose your video - grid 9',
            value: [
                'images/favicon.svg',
                'images/favicon.svg',
                'images/guides.svg',
                'images/favicon.svg',
                'images/guides.svg',
                'images/favicon.svg'
            ]
        },
        {
            type: 'media',
            id: 'mediacarousel2',
            display: 'carousel',
            mode: 'multi',
            multiLimit: 9,
            mediaType: 'video',
            caption: 'Choose your video - carousel 9',
            value: ['images/favicon.svg', 'images/favicon.svg', 'images/favicon.svg']
        },
        {
            type: 'media',
            id: 'mediagrid4',
            mode: 'multi',
            display: 'grid',
            mediaType: 'image',
            multiLimit: 6,
            caption: 'Choose your logo - multi 6 (object format)',
            value: [
                { src: 'images/favicon.svg', thumb: 'images/favicon.svg' }
            ],
            mediaFormat: 'object',
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediacarousel3',
            mode: 'multi',
            display: 'carousel',
            mediaType: 'image',
            multiLimit: 6,
            caption: 'Choose your logo - multi 6',
            value: ['images/favicon.svg'],
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediasingle1',
            mode: 'single',
            multiLimit: 2,
            mediaType: 'image',
            caption: 'Choose your logo - single',
            value: [],
            position: {
                x: 0,
                y: 0
            },
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediasingle2',
            mode: 'single',
            multiLimit: 2,
            mediaType: 'image',
            caption: 'Choose your logo - single',
            value: ['http://images/favicon.svg', 'http://images/favicon.svg'],
            position: {
                x: 10,
                y: 30
            },
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediasingle3',
            mode: 'single',
            mediaType: 'image',
            caption: 'Choose your logo - single http',
            value: ['http://images/favicon.svg'],
            position: {
                x: 10,
                y: 30
            },
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediasingle4',
            mode: 'single',
            mediaType: 'image',
            caption: 'Choose your logo - single empty',
            value: [''],
            position: {
                x: 10,
                y: 30
            },
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediasingle5',
            mode: 'single',
            mediaType: 'image',
            caption: 'Choose your logo',
            value: ['images/favicon.svg'],
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediasingle6',
            mode: 'single',
            mediaType: 'image',
            caption: 'Choose your logo',
            value: ['images/favicon.svg'],
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediasingle7',
            mode: 'single',
            mediaType: 'image',
            caption: 'Disabled media input',
            value: ['images/favicon.svg'],
            viewState: 'disable',
            size: 'medium'
        },
        {
            type: 'media',
            id: 'mediasingle8',
            mode: 'single',
            mediaType: 'image',
            caption: 'Media input with Selection Label tooltip',
            value: [],
            size: 'medium',
            selectionLabel: 'Selection Label tooltip'
        },
        {
            type: 'hidden',
            id: 'mode',
            value: 'horizontal'
        }
    ],
    Select: [
        {
            type: 'dropdown',
            id: 'dropdownListFruits45',
            caption: 'Select your favorite fruit.',
            list: ['Mango', 'Banana', 'Cherry'],
            value: 'Mango',
            size: 'small'
        },
        {
            type: 'dropdown',
            id: 'dropdownListFruits46',
            caption: 'Select your favorite fruit.',
            list: [
                'Mango',
                {
                    text: 'Banana',
                    icon: 'images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Cherry',
                    icon: 'images/favicon.svg'
                },
                {
                    text: '1',
                    displayText: 'Strawberry'
                }
            ],
            value: 'Mango',
            size: 'small'
        },
        {
            type: 'dropdown',
            label: 'Dropdown medium',
            id: 'dropdownListFruits47',
            caption: 'Select your favorite fruit.',
            list: [
                {
                    text: '1',
                    displayText: 'Strawberry'
                },
                'Mango',
                {
                    text: 'Banana',
                    icon: 'images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Cherry',
                    icon: 'images/favicon.svg'
                }
            ],
            value: '1',
            size: 'medium'
        },
        {
            type: 'dropdown',
            label: 'Dropdown large',
            id: 'dropdownListFruits48',
            caption: 'Select your favorite fruit.',
            list: [
                'Mango',
                {
                    text: 'Banana',
                    icon: 'images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Cherry',
                    icon: 'images/favicon.svg'
                },
                {
                    text: '1',
                    displayText: 'Strawberry'
                }
            ],
            value: 'Mango',
            size: 'large'
        },
        {
            type: 'dropdown',
            label: 'Dropdown disabled',
            id: 'dropdownListFruits49',
            caption: 'Disabled dropdown input',
            list: ['Mango', 'Apple'],
            value: 'Mango',
            size: 'large',
            viewState: 'disable'
        },
        {
            type: 'dropdown',
            label: 'Dropdown multiselect',
            id: 'dropdownListFruits50',
            caption: 'Select your favorite fruit.',
            list: [
                'Mango',
                'Strawberry',
                {
                    text: 'Cherry',
                    icon: 'images/favicon.svg'
                },
                'Apple',
                {
                    text: 'Hello',
                    icon: 'images/favicon.svg',
                    displayText: true
                },
                'baNaNa'
            ],
            value: 'Mango',
            size: 'medium',
            multiselect: true
        },
        {
            type: 'dropdown',
            label: 'Dropdown search',
            id: 'dropdownListFruits51',
            caption: 'Select your favorite fruit.',
            list: [
                'Mango',
                'Strawberry',
                {
                    text: 'Cherry',
                    icon: 'images/favicon.svg'
                },
                'Apple',
                {
                    text: 'Hello',
                    icon: 'images/favicon.svg',
                    displayText: true
                },
                'baNaNa'
            ],
            value: 'Mango',
            size: 'medium',
            search: true
        },
        {
            type: 'dropdown',
            label: 'Dropdown search+multiselect',
            id: 'dropdownListFruits52',
            caption: 'Select your favorite fruit.',
            list: [
                'Mango',
                'Strawberry',
                {
                    text: 'Cherry',
                    icon: 'images/favicon.svg'
                },
                'Apple',
                {
                    text: 'Hello',
                    icon: 'images/favicon.svg',
                    displayText: true
                },
                'baNaNa'
            ],
            value: 'Mango',
            size: 'medium',
            multiselect: true,
            search: true
        },
        {
            type: 'dropdown',
            label: 'Test disabled dropdown for widget manifest',
            id: 'dropdownListFruits53',
            caption: 'Test Dropdown',
            list: ['Mango', 'Apple', 'Strawberry'],
            value: 'Mango',
            size: 'medium',
            viewState: 'disable'
        },
        {
            type: 'font',
            id: 'font48',
            value: {
                fontFamily: 'SamsungOne 300',
                fontSize: 31
            }
        },
        {
            type: 'font',
            id: 'font49',
            hideFontSize: true,
            value: {
                fontFamily: 'SamsungOne 300'
            }
        },
        {
            type: 'checkbox',
            id: 'checkNotHuman48',
            caption: 'I\u0027m not a human',
            value: true,
            position: {
                x: 0,
                y: 0
            },
            size: 'small'
        },
        {
            type: 'checkbox',
            id: 'checkNotHuman49',
            caption: 'I\u0027m not a human',
            value: true,
            position: {
                x: 0,
                y: 0
            },
            size: 'medium'
        },
        {
            type: 'checkbox',
            id: 'checkNotHuman50',
            caption: 'I\u0027m not a human',
            value: true,
            position: {
                x: 0,
                y: 0
            },
            size: 'large'
        },
        {
            type: 'range',
            id: 'rangeDropdown',
            caption: 'Desired temperature',
            min: -20,
            max: 30,
            step: 0.5,
            value: 11,
            displayType: 'dropdown'
        },
        {
            type: 'range',
            id: 'rangeDropdownIcon',
            caption: 'Desired temperature',
            min: -20,
            max: 30,
            step: 0.5,
            value: 11,
            displayType: 'dropdown',
            iconLabel: '../images/favicon.svg'
        },
        {
            type: 'range',
            id: 'rangeSlider51',
            caption: 'Desired temperature',
            min: -20,
            max: 30,
            step: 0.5,
            value: 11,
            size: 'small',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'range',
            id: 'rangeSlider52',
            caption: 'Desired temperature',
            min: -20,
            max: 30,
            step: 0.5,
            value: 11,
            size: 'medium',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'range',
            id: 'rangeSlider53',
            caption: 'Desired temperature',
            min: -20,
            max: 30,
            step: 0.5,
            value: 11,
            size: 'large',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'range',
            id: 'rangeSlider54',
            caption: 'Disabled range input',
            min: -20,
            max: 30,
            step: 0.5,
            value: 11,
            size: 'large',
            position: {
                x: 0,
                y: 0
            },
            viewState: 'disable'
        },
        {
            type: 'range',
            id: 'rangeSlider55',
            caption: 'Range with labels',
            min: 0,
            max: 2,
            step: 1,
            labels: ['foo', 'bar', 'baz'],
            value: 0,
            position: {
                x: 0,
                y: 0
            },
        },
        {
            type: 'range',
            id: 'rangeSlider56',
            caption: 'Range dropdown with labels',
            min: 0,
            max: 2,
            step: 1,
            labels: ['foo', 'bar', 'baz'],
            value: 0,
            position: {
                x: 0,
                y: 0
            },
            displayType: 'dropdown'
        },
        {
            type: 'slider',
            id: 'smallSliderWithLabels',
            caption: 'Small Slider',
            min: 2,
            max: 4,
            step: 0.5,
            labels: ['1M'],
            value: 0,
            viewState: 'show',
            size: 'small'
        },
        {
            type: 'slider',
            id: 'mediumSliderWithLabels',
            caption: 'Medium Slider',
            min: 2,
            max: 4,
            step: 0.5,
            labels: ['1M', '3M', '9M'],
            value: 0,
            viewState: 'show'
        },
        {
            type: 'slider',
            id: 'largeSliderWithLabels',
            caption: 'Large Slider',
            min: 2,
            max: 4,
            step: 0.5,
            labels: ['1M', '3M', '6M', '8', '9M'],
            value: 0,
            viewState: 'show',
            size: 'large'
        },
        {
            type: 'slider',
            id: 'disabledSliderWithLabels',
            caption: 'Disabled slider',
            min: 0,
            max: 9,
            step: 3,
            labels: ['1M', '3M', '6M'],
            value: 5,
            viewState: 'disable'
        }
    ],
    Button: [
        {
            type: 'toggleState',
            id: 'layout1',
            caption: 'Orientation',
            viewState: 'show',
            value: 'Portrait 2',
            list: [
                {
                    text: 'Landscape 1',
                    displayText: true
                },
                {
                    text: 'Portrait 2',
                    icon: '../images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Landscape 2',
                    displayText: true
                },
                {
                    text: 'Portrait 3',
                    icon: '../images/favicon.svg',
                    displayText: true
                }
            ],
            size: 'large',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'toggleState',
            id: 'layout13',
            caption: 'Orientation hide',
            viewState: 'hide',
            value: 'Portrait 2',
            list: [
                {
                    text: 'Landscape 1',
                    icon: '../images/favicon.svg',
                    displayText: true
                },
                {
                    text: 'Portrait 2',
                    icon: '../images/favicon.svg',
                    displayText: false
                }
            ],
            size: 'large',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'toggleState',
            id: 'layout12',
            caption: 'Orientation disable',
            viewState: 'disable',
            value: 'Portrait 2',
            list: [
                {
                    text: 'Landscape 1',
                    icon: '../images/favicon.svg',
                    displayText: true
                },
                {
                    text: 'Portrait 2',
                    icon: '../images/favicon.svg',
                    displayText: false
                }
            ],
            size: 'large',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'toggleState',
            id: 'layout2',
            caption: 'Orientation',
            value: 'Portrait 4',
            list: [
                {
                    text: 'Landscape 1',
                    icon: '../images/favicon.svg',
                    displayText: true
                },
                {
                    text: 'Portrait 2',
                    icon: '../images/favicon.svg',
                    displayText: true
                },
                {
                    text: 'Landscape 3',
                    displayText: false
                },
                {
                    text: 'Portrait 4',
                    icon: '../images/favicon.svg',
                    displayText: true
                },
                {
                    text: 'Landscape 5',
                    icon: '../images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Portrait 6',
                    icon: '../images/favicon.svg',
                    displayText: true
                }
            ],
            size: 'medium',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'toggleState',
            id: 'layout3',
            caption: 'Orientation',
            value: 'Text 3',
            list: [
                {
                    text: 'Text 1'
                },
                {
                    text: 'Text 2'
                },
                {
                    text: 'Text 3',
                    icon: '../images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Text 4',
                    icon: '../images/favicon.svg',
                    displayText: true
                },
                {
                    text: 'Text 5',
                    icon: '../images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Text 6'
                },
                {
                    text: 'Text 7'
                },
                {
                    text: 'Text 8',
                    icon: '../images/favicon.svg'
                },
                {
                    text: 'Text 9',
                    icon: '../images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Text 10',
                    displayText: true
                },
                {
                    text: 'Text 11',
                    icon: '../images/favicon.svg',
                    displayText: true
                }
            ],
            size: 'small',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'divider',
            id: 'divider55'
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio54',
            caption: 'Navigation audio ',
            value: true,
            size: 'large',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'divider',
            id: 'divider2'
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio55',
            caption: 'Navigation audio ',
            value: true,
            size: 'medium',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio56',
            caption: 'Navigation audio ',
            value: true,
            size: 'small',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio57',
            caption: 'Disabled toggle',
            value: true,
            size: 'small',
            position: {
                x: 0,
                y: 10
            },
            viewState: 'disable'
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio58',
            caption: 'Right-side toggle (small)',
            value: true,
            size: 'small',
            position: {
                x: 0,
                y: 10
            },
            rightside: true
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio59',
            caption: 'Right-side toggle (medium)',
            value: true,
            size: 'medium',
            position: {
                x: 0,
                y: 10
            },
            rightside: true
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio60',
            caption: 'Right-side toggle (large)',
            value: true,
            size: 'large',
            position: {
                x: 0,
                y: 10
            },
            rightside: true
        },
        {
            type: 'divider',
            id: 'divider233'
        },
        {
            type: 'state',
            id: 'buttonState11',
            caption: 'Button State',
            value: false,
            size: 'small',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'state',
            id: 'buttonState12',
            caption: 'Button State',
            value: true,
            size: 'medium',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'state',
            id: 'buttonState13',
            caption: 'Button State',
            value: true,
            size: 'large',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'state',
            id: 'buttonStateCustom',
            caption: 'Button with custom size',
            iconButton: '../images/favicon.svg',
            value: true,
            size: 'large',
            position: {
                x: 0,
                y: 0
            },
            iconButtonSize: {
                width: 40,
                height: 40
            }
        },
        {
            type: 'state',
            id: 'buttonStateIconSm',
            caption: 'buttonStateIconSm',
            value: false,
            size: 'small',
            iconButton: '../images/favicon.svg'
        },
        {
            type: 'state',
            id: 'buttonStateIconMd',
            caption: 'buttonStateIconMd',
            value: true,
            size: 'medium',
            iconButton: '../images/favicon.svg'
        },
        {
            type: 'state',
            id: 'buttonStateIconLg',
            caption: 'buttonStateIconLg',
            value: false,
            size: 'large',
            iconButton: '../images/favicon.svg'
        },
        {
            type: 'divider',
            id: 'divider233555'
        },
        {
            type: 'radio',
            id: 'radioSelectStyle57',
            caption: 'Select a layout style.',
            list: ['Grid', 'List'],
            value: 'Grid',
            size: 'large',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'radio',
            id: 'radioSelectStyle58',
            caption: 'Select a layout style.',
            list: ['Grid', 'List'],
            value: 'Grid',
            size: 'medium',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'radio',
            id: 'radioSelectStyle59',
            caption: 'Select a layout style.',
            list: ['Grid', 'List'],
            value: 'Grid',
            size: 'small',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'url',
            id: 'metaLoginUrl56',
            caption: 'Dialog with auth',
            value: '<widget-base-path>/login-page.html',
            dialogAuthValidation: '<widget-base-path>/dialog-auth-response.json',
            size: 'large',
            openType: 'dialog',
            dialogSize: {
                width: 560,
                height: 315
            },
            dialogCloseOnConfirm: true
        },
        {
            type: 'url',
            id: 'metaLoginUrlCustom',
            caption: 'Dialog with custom size',
            value: '<widget-base-path>/login-page.html',
            dialogAuthValidation: '<widget-base-path>/dialog-auth-response.json',
            iconButton: '../images/favicon.svg',
            size: 'large',
            openType: 'dialog',
            dialogSize: {
                width: 560,
                height: 315
            },
            iconButtonSize: {
                width: 40,
                height: 40
            },
            dialogCloseOnConfirm: true
        },
        {
            type: 'url',
            id: 'metaLoginUrl57',
            caption: 'Dialog with auth (empty response)',
            value: '<widget-base-path>/login-page.html',
            dialogAuthValidation: '<widget-base-path>/dialog-auth-empty.json',
            size: 'large',
            openType: 'dialog',
            dialogSize: {
                width: 560,
                height: 315
            }
        },
        {
            type: 'url',
            id: 'metaLoginUrl58',
            caption: 'Dialog with auth (invalid response)',
            value: '<widget-base-path>/login-page.html',
            dialogAuthValidation: '<widget-base-path>/login-page.html',
            size: 'large',
            openType: 'dialog',
            dialogSize: {
                width: 560,
                height: 315
            },
            dialogCloseOnConfirm: true
        },
        {
            type: 'url',
            id: 'metaLoginUrl59',
            caption: 'Dialog',
            value: 'https://www.youtube.com/embed/wcrvKdubd5c',
            size: 'small',
            openType: 'dialog',
            dialogSize: {
                width: 560,
                height: 315
            }
        },
        {
            type: 'url',
            id: 'metaLoginUrl60',
            caption: 'Dialog with <widget-base-path>',
            value: '<widget-base-path>/login-page.html',
            dialogAuthValidation: '<widget-base-path>/dialog-auth-empty.json',
            size: 'large',
            openType: 'dialog',
            dialogSize: {
                width: 560,
                height: 315
            },
            dialogCloseOnConfirm: true
        },
        {
            type: 'url',
            id: 'metaLoginUrl61',
            caption: 'Dialog',
            value: 'https://www.youtube.com/embed/wcrvKdubd5c',
            size: 'small',
            openType: 'dialog',
            position: {
                x: 20,
                y: 20
            },
            dialogCloseOnConfirm: true
        },
        {
            type: 'url',
            id: 'metaLoginUrl612',
            caption: 'Dialog with response',
            withResponse: { hidden: true },
            value: '<widget-base-path>/dialog.html',
            size: 'small',
            openType: 'dialog'
        },
        {
            type: 'url',
            id: 'metaLoginUrl613',
            caption: 'Dialog with response',
            iconButton: '../images/favicon.svg',
            withResponse: { hidden: true },
            value: '<widget-base-path>/dialog.html',
            size: 'small',
            openType: 'dialog'
        },
        {
            type: 'url',
            id: 'metaLoginUrl614',
            caption: 'Dialog with response',
            iconButton: '../images/favicon.svg',
            withResponse: {
                prompt: 'Response prompt'
            },
            value: '<widget-base-path>/dialog.html',
            size: 'small',
            openType: 'dialog'
        },
        {
            type: 'url',
            id: 'metaLoginUrl65',
            caption: 'Facebook window',
            value: 'https://www.facebook.com/login.php?skip_api_login\u003d1\u0026api_key\u003d...',
            size: 'medium',
            position: {
                x: 0,
                y: 0
            },
            openType: 'window'
        },
        {
            type: 'url',
            id: 'metaLoginUrl66',
            caption: 'Continue with facebook (new window)',
            value: 'https://www.facebook.com/login.php?skip_api_login\u003d1\u0026api_key\u003d...',
            size: 'large',
            position: {
                x: 0,
                y: 0
            },
            openType: 'window'
        },
        {
            type: 'url',
            id: 'metaLoginUrl67',
            caption: 'Continue with facebook (new tab)',
            value: 'https://www.facebook.com/login.php?skip_api_login\u003d1\u0026api_key\u003d...',
            size: 'large',
            position: {
                x: 0,
                y: 0
            },
            openType: 'tab'
        },
        {
            type: 'img',
            id: 'apimoLogo463',
            caption: 'Apimo Logo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode64',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                },
                {
                    type: 'dropdown',
                    label: 'Dropdown',
                    id: 'dropdownListFruits65',
                    caption: 'Select your favorite fruit.',
                    list: ['Mango', 'Apple'],
                    value: 'Mango'
                },
                {
                    type: 'radio',
                    id: 'radioSelectStyle66',
                    caption: 'Select a layout style.',
                    list: ['Grid', 'List'],
                    value: 'Grid',
                    size: 'small',
                    position: {
                        x: 10,
                        y: 30
                    }
                },
                {
                    type: 'font',
                    id: 'font67',
                    value: {
                        fontFamily: 'SamsungOne 300',
                        fontSize: 31
                    }
                }
            ],
            size: 'medium',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'img',
            id: 'apimoLogo467',
            caption: 'Apimo Logo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode68',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                }
            ],
            size: 'large',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'img',
            id: 'apimoLogo469',
            caption: 'Apimo Logo',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode70',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                }
            ],
            size: 'small',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'img',
            id: 'apimoLogo4690',
            caption: 'Disabled image button',
            value: 'https://csv1.blob.core.windows.net/csblob1/widgets/catalog/sources/logo/apimo_logo.png',
            parameters: [
                {
                    type: 'text',
                    id: 'inputZipCode70',
                    caption: 'Please input your ZIP code.',
                    value: '',
                    label: 'Zip Code'
                }
            ],
            size: 'small',
            position: {
                x: 0,
                y: 10
            },
            viewState: 'disable'
        }
    ],
    Show: [
        {
            type: 'message',
            id: 'disclaimerLong',
            value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse gravida lacus tellus, ac pulvinar tortor tincidunt non. Duis at pretium lacus. Praesent mollis malesuada erat id placerat. Sed auctor eleifend eleifend. Suspendisse sit amet sapien quis mauris cursus fermentum. Nunc pellentesque metus et nisi convallis dictum. Sed tincidunt ac mauris quis tincidunt. Ut ut gravida nulla. Duis facilisis tincidunt facilisis. Quisque vel dictum nisi. Mauris tempor suscipit tortor. Ut elementum nisi quis dolor malesuada rutrum. Sed condimentum tristique mi, ac.',
            position: {
                x: 0,
                y: 10
            },
            mode: 'disclaimer'
        },
        {
            type: 'message',
            id: 'disclaimerLongSingle',
            value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse gravida lacus tellus, ac pulvinar tortor tincidunt non. Duis at pretium lacus. Praesent mollis malesuada erat id placerat. Sed auctor eleifend eleifend. Suspendisse sit amet sapien quis mauris cursus fermentum. Nunc pellentesque metus et nisi convallis dictum. Sed tincidunt ac mauris quis tincidunt. Ut ut gravida nulla. Duis facilisis tincidunt facilisis. Quisque vel dictum nisi. Mauris tempor suscipit tortor. Ut elementum nisi quis dolor malesuada rutrum. Sed condimentum tristique mi, ac.',
            position: {
                x: 0,
                y: 10
            },
            mode: 'disclaimer',
            singleLine: true
        },
        {
            type: 'message',
            id: 'messageLong',
            value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse gravida lacus tellus, ac pulvinar tortor tincidunt non. Duis at pretium lacus. Praesent mollis malesuada erat id placerat. Sed auctor eleifend eleifend. Suspendisse sit amet sapien quis mauris cursus fermentum. Nunc pellentesque metus et nisi convallis dictum. Sed tincidunt ac mauris quis tincidunt. Ut ut gravida nulla. Duis facilisis tincidunt facilisis. Quisque vel dictum nisi. Mauris tempor suscipit tortor. Ut elementum nisi quis dolor malesuada rutrum. Sed condimentum tristique mi, ac.',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'message',
            id: 'messageLongSingle',
            value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse gravida lacus tellus, ac pulvinar tortor tincidunt non. Duis at pretium lacus. Praesent mollis malesuada erat id placerat. Sed auctor eleifend eleifend. Suspendisse sit amet sapien quis mauris cursus fermentum. Nunc pellentesque metus et nisi convallis dictum. Sed tincidunt ac mauris quis tincidunt. Ut ut gravida nulla. Duis facilisis tincidunt facilisis. Quisque vel dictum nisi. Mauris tempor suscipit tortor. Ut elementum nisi quis dolor malesuada rutrum. Sed condimentum tristique mi, ac.',
            position: {
                x: 0,
                y: 10
            },
            singleLine: true
        },
        {
            type: 'message',
            id: 'tip1',
            value: 'You can only belong to one orhanization at a time. If you accept a new invitation, you will leave your current organization',
            position: {
                x: 0,
                y: 10
            },
            mode: 'tip'
        },
        {
            type: 'message',
            id: 'tip2Long',
            value: 'You can only belong to one orhanization at a time. If you accept a new invitation, you will leave your current organization',
            position: {
                x: 0,
                y: 10
            },
            singleLine: true,
            mode: 'tip'
        },
        {
            type: 'message',
            id: 'message',
            value: 'Test message',
            size: 'small',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'message',
            id: 'message2',
            value: 'Test message2',
            size: 'medium',
            position: {
                x: 10,
                y: 30
            }
        },
        {
            type: 'message',
            id: 'message3',
            value: 'Test message3',
            size: 'large',
            position: {
                x: 40,
                y: -10
            }
        },
        {
            type: 'guide',
            id: 'guide1',
            value: 'Blanditiis voluptas laborum exercitationem qui harum occaecati ea.',
            size: 'small'
        },
        {
            type: 'guide',
            id: 'guide2',
            value:
                'Voluptatem a et eum maiores. Nihil dolorum odio possimus qui. Mollitia aut quos quam non necessitatibus. Vero illum odit laborum est vel velit.',
            size: 'medium',
            position: {
                x: 10,
                y: 25
            }
        },
        {
            type: 'guide',
            id: 'guide3',
            value:
                'Consectetur assumenda eum quia. Quam omnis dolores architecto eum alias eos. Sit quae blanditiis quas itaque possimus non fugit. Voluptate temporibus veritatis ipsum et molestias consequatur eius. Et sint sit sit.',
            size: 'large',
            position: {
                x: 50,
                y: 10
            }
        },
        {
            type: 'guide',
            id: 'guide4',
            value: 'Blanditiis voluptas laborum.',
            viewState: 'hide',
            size: 'medium'
        },
        {
            type: 'guide',
            id: 'guide5',
            value: 'Blanditiis voluptas laborum.',
            viewState: 'disable',
            size: 'medium'
        }
    ],
    Display: [
        {
            type: 'guide',
            id: 'guide6',
            value: 'Guide next to the Accordion component.',
            size: 'medium',
            position: {
                x: 74,
                y: 0
            }
        },
        mockAccordion,
        mockAccordionWithTabs,
        mockGridRange,
        {
            type: 'custom',
            id: 'customComponent',
            htmlTag: 'some-widget',
            src: '<widget-base-path>/self-render/style.js',
            value: {
                buttonText: 'Open dialog',
                title: 'Custom component'
            },
            position: {
                x: 0,
                y: 0
            }
        },
        mockGridLarge,
        mockGridMedium,
        mockGridSmall
    ],
    ActionTab: [
        {
            type: 'action',
            id: 'actionTabActionBtn',
            action: 'dispatchConfig',
            caption: 'save',
            size: 'medium',
            viewState: 'show',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'radio',
            id: 'radioSelectStyle58ActionTab',
            caption: 'Select a layout style.',
            list: ['Grid', 'List'],
            value: 'Grid',
            size: 'medium',
            position: {
                x: 0,
                y: 10
            }
        },
        {
            type: 'webUrl',
            caption: 'Image',
            id: 'weburlAction',
            value: 'images/favicon.svg',
            showTagAlias: true,
            viewState: 'show'
        },
        {
            type: 'dropdown',
            id: 'dropdownListFruitsAction',
            caption: 'Select your favorite fruit.',
            list: [
                'Mango',
                {
                    text: 'Banana',
                    icon: 'images/favicon.svg',
                    displayText: false
                },
                {
                    text: 'Cherry',
                    icon: 'images/favicon.svg'
                },
                {
                    text: '1',
                    displayText: 'Strawberry'
                }
            ],
            value: 'Mango',
            size: 'small'
        },
        {
            type: 'guide',
            id: 'guide2Action',
            value:
                'Voluptatem a et eum maiores. Nihil dolorum odio possimus qui. Mollitia aut quos quam non necessitatibus. Vero illum odit laborum est vel velit.',
            size: 'medium',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'guide',
            id: 'guide3Action',
            value:
                'Consectetur assumenda eum quia. Quam omnis dolores architecto eum alias eos. Sit quae blanditiis quas itaque possimus non fugit. Voluptate temporibus veritatis ipsum et molestias consequatur eius. Et sint sit sit.',
            size: 'large',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio57Action',
            caption: 'Disabled toggle',
            value: true,
            size: 'small',
            position: {
                x: 0,
                y: 0
            },
            viewState: 'disable'
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio58Action',
            caption: 'Right-side toggle (small)',
            value: true,
            size: 'small',
            position: {
                x: 0,
                y: 0
            },
            rightside: true
        },
        {
            type: 'toggle',
            id: 'toggleNavAudio59Action',
            caption: 'Right-side toggle (medium)',
            value: true,
            size: 'medium',
            position: {
                x: 0,
                y: 0
            },
            rightside: true
        },
        {
            type: 'action',
            id: 'actionTabActionBtnCustom',
            action: 'dispatchConfig',
            caption: 'Button with custom size',
            iconButton: '../images/favicon.svg',
            size: 'medium',
            viewState: 'show',
            position: {
                x: 0,
                y: 0
            },
            iconButtonSize: {
                width: 40,
                height: 40
            }
        },

    ],
    Canvas: [
        {
            type: 'capabilities',
            id: 'capabilities',
            i18n: {
                en: {
                    COM_MESSAGE: 'Message'
                }
            }
        }
    ]
};
const resourceDesc =
    ' Maecenas imperdiet, tellus nec lobortis imperdiet, mauris ipsum sagittis ligula, eget ultrices tortor sem at turpis. Nam dictum lorem arcu, ut commodo orci rhoncus ac. Nullam eu finibus elit, sit amet sodales leo. Curabitur sit amet eleifend magna. Nullam eget lacus sit amet dui eleifend sollicitudin a eget eros. Praesent rutrum felis nisi, vel porta quam euismod nec. In nulla lacus, ullamcorper id maximus a, malesuada vitae lacus. Nunc rutrum tempus venenatis.';

function isLogger() {
    return localStorage.getItem('app-verbose') === 'true';
}

function createChannel() {
    const channel = $vxt.createChannel($vxtSubChannelId);
    let counter = 0;
    setInterval(() => {
        counter++;
        channel.publish('set', {
            type: 'storage',
            payload: {
                mock: {
                    'extension-key': `extension-value-${counter}`
                }
            }
        });
    }, 10000);
    setTimeout(() => {
        channel.publish('set', {
            type: 'broadcast',
            payload: {
                'broadcast-test': {
                    'extension-key': `extension-value-${counter}`,
                    'extension-key-2': `extension-value-${counter}`
                },
                'broadcast-test-2': {
                    'extension-key': `extension-value-${counter}`
                }
            }
        });
    }, 10000);
    channel.subscribe('data:broadcast-test', (payload) => {
        if (isLogger()) {
            console.debug('[VXT App] data:broadcast-test', JSON.stringify(payload));
        }
    });
    channel.subscribe('data:mock', (payload) => {
        if (isLogger()) {
            console.debug('[VXT App] data:mock', JSON.stringify(payload));
        }
    });
    channel.subscribe('get', (data) => {
        if (isLogger()) {
            console.debug('[VXT App] get', JSON.stringify(data));
        }

        if (data.payload && data.payload.configErrorAccordion && data.payload.configErrorAccordion.errorCheckbox) {
            sendConfigError(channel, false);
            return;
        }
        if (data.payload && data.payload.errorCheckboxPartial) {
            sendConfigError(channel, true);
            return;
        }
        if (data.type === 'contents') {
            // get templates form backned API
            // conver to canvas format
            const categories = [
                'Test 1',
                {
                    name: 'Test 2',
                    displayMode: 'carousel'
                },
                {
                    name: 'Test 3',
                    displayMode: 'grid',
                    guide: {
                        sid: "COM_ALERT_DUPLICATE"
                    }
                }
            ];
            let content = [
                {
                    resourceId: '1',
                    resourceName: 'Backward compatibility - 1',
                    thumbnailPath: '../images/favicon.svg',
                    viewEdit: {
                        message: 'Click buttons to update Property Panel > Input tab'
                    },
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1',
                    resourceDesc: 'Resource type is undefined',
                    config: {
                        ...configMock
                    }
                },
                {
                    resourceType: 'random type',
                    resourceId: '2',
                    resourceName: 'Backward compatibility - 2',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'portrait',
                    keywords: 'test1, application1',
                    resourceDesc: 'Resource type is a random text'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '3',
                    resourceName: 'Web Component test',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1, web_component',
                    config: {
                        ...configMock
                    },
                    resourceDesc,
                    widgetSettings: {
                        widgetId: 'widgetA',
                        widgetType: 'webComponent',
                        htmlTag: 'div'
                    }
                },
                {
                    resourceId: '4',
                    resourceName: 'Sound capability',
                    thumbnailPath: '../images/favicon.svg',
                    viewEdit: {
                        message: 'Click buttons to update Property Panel > Input tab'
                    },
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1',
                    resourceDesc: 'Resource type is undefined',
                    config: {
                        ...configMock,
                        Canvas: [
                            {
                                type: 'capabilities',
                                id: 'capabilities',
                                sound: {
                                    mute: false,
                                    contentName: 'My audio'
                                }
                            }
                        ]
                    }
                },
                {
                    resourceId: '5',
                    resourceName: 'Video capability',
                    thumbnailPath: '../images/favicon.svg',
                    viewEdit: {
                        message: 'Click buttons to update Property Panel > Input tab'
                    },
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1',
                    resourceDesc: 'Resource type is undefined',
                    config: {
                        ...configMock,
                        Canvas: [
                            {
                                type: 'capabilities',
                                id: 'capabilities',
                                video: {
                                    mute: false,
                                    contentName: 'My video'
                                }
                            }
                        ]
                    }
                },
                {
                    resourceId: '6',
                    resourceName: 'Grid capability',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1',
                    resourceDesc: 'Resource type is undefined',
                    config: {
                        ...configMock,
                        Canvas: [
                            {
                                type: 'capabilities',
                                id: 'grid',
                                grid: {
                                    support: true
                                }
                            }
                        ]
                    }
                },
                {
                    resourceId: '7',
                    resourceName: 'Control capability',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1',
                    resourceDesc: 'Resource type is undefined',
                    config: {
                        ...configMock,
                        Canvas: [
                            {
                                type: 'capabilities',
                                id: 'capabilities',
                                control: {
                                    pageDuration: {
                                        value: 0,
                                        disable: true
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    resourceId: '8',
                    resourceName: 'Epaper capability',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1',
                    resourceDesc: 'Resource type is undefined',
                    config: {
                        ...configMock,
                        Canvas: [
                            {
                                type: 'capabilities',
                                id: 'manifestId',
                                epaper: {
                                    support: true
                                }
                            }
                        ]
                    }
                },
                {
                    resourceId: '27',
                    resourceName: 'ShowOnTop capability',
                    thumbnailPath: '../images/favicon.svg',
                    viewEdit: {
                        message: 'Click buttons to update Property Panel > Input tab'
                    },
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1',
                    resourceDesc: 'Resource type is undefined',
                    config: {
                        ...configMock,
                        Canvas: [
                            {
                                type: 'capabilities',
                                id: 'capabilities',
                                showOnTop: {
                                    support: true
                                }
                            }
                        ]
                    }
                },
                {
                    resourceType: 'FOLDER',
                    resourceName: 'Folder 1 Name',
                    category: 'Test 1',
                    keywords: 'folder1, application1',
                    resourceDesc: 'Resource type is a random text',
                    children: [
                        {
                            resourceType: 'CONTENT',
                            resourceId: '1',
                            resourceName: 'Folder 1 content 1 Name',
                            thumbnailPath: '../images/favicon.svg',
                            category: 'Test 1',
                            orientation: 'portrait',
                            keywords: 'test1, application1',
                            resourceDesc
                        },
                        {
                            resourceType: 'CONTENT',
                            resourceId: '2',
                            resourceName: 'Folder 1 content 2 Name',
                            thumbnailPath: '../images/favicon.svg',
                            category: 'Test 1',
                            orientation: 'landscape',
                            keywords: 'test1, application1',
                            config: {
                                ...configMock
                            },
                            resourceDesc
                        },
                        {
                            resourceType: 'FOLDER',
                            resourceName: 'Folder 1.1 Name',
                            category: 'Test 1',
                            keywords: 'folder1, application1',
                            resourceDesc: 'Resource type is a random text',
                            children: [
                                {
                                    resourceType: 'FOLDER',
                                    resourceName: 'Folder 1.1.1 Name',
                                    category: 'Test 1',
                                    keywords: 'folder1, application1',
                                    resourceDesc: 'Resource type is a random text',
                                    children: [
                                        {
                                            resourceType: 'CONTENT',
                                            resourceId: '1',
                                            resourceName: 'Folder 1.1.1 content 1 Name',
                                            thumbnailPath: '../images/favicon.svg',
                                            category: 'Test 1',
                                            orientation: 'portrait',
                                            keywords: 'test1, application1',
                                            resourceDesc
                                        },
                                        {
                                            resourceType: 'CONTENT',
                                            resourceId: '2',
                                            resourceName: 'Folder 1.1.1 content 2 Name',
                                            thumbnailPath: '../images/favicon.svg',
                                            category: 'Test 1',
                                            orientation: 'landscape',
                                            keywords: 'test1, application1',
                                            config: {
                                                ...configMock
                                            },
                                            resourceDesc
                                        },
                                        {
                                            resourceType: 'FOLDER',
                                            resourceName: 'Folder 1.1.1.1 Name',
                                            category: 'Test 1',
                                            keywords: 'folder1, application1',
                                            resourceDesc: 'Resource type is a random text',
                                            children: [
                                                {
                                                    resourceType: 'FOLDER',
                                                    resourceName: 'Folder 1.1.1.1.1 Name',
                                                    category: 'Test 1',
                                                    keywords: 'folder1, application1',
                                                    resourceDesc: 'Resource type is a random text',
                                                    children: [
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '1',
                                                            resourceName: 'Folder 1.1.1.1 content 1 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 1',
                                                            orientation: 'portrait',
                                                            keywords: 'test1, application1',
                                                            resourceDesc
                                                        },
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '2',
                                                            resourceName: 'Folder 1.1.1.1 content 2 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 1',
                                                            orientation: 'landscape',
                                                            keywords: 'test1, application1',
                                                            config: {
                                                                ...configMock
                                                            },
                                                            resourceDesc
                                                        },
                                                        {
                                                            resourceType: 'FOLDER',
                                                            resourceName: 'Folder 1.1.1.1.1.1 Name',
                                                            category: 'Test 1',
                                                            keywords: 'folder1, application1',
                                                            resourceDesc: 'Resource type is a random text',
                                                            children: [
                                                                {
                                                                    resourceType: 'FOLDER',
                                                                    resourceName: 'Folder 1.1.1.1.1.1.1 Name',
                                                                    keywords: 'folder1, application1',
                                                                    resourceDesc: 'Resource type is a random text',
                                                                    category: 'Test 1',
                                                                    children: [
                                                                        {
                                                                            resourceType: 'CONTENT',
                                                                            resourceId: '1',
                                                                            resourceName:
                                                                                'Folder 1.1.1.1.1.1.1 content 1 Name',
                                                                            thumbnailPath: '../images/favicon.svg',
                                                                            category: 'Test 1',
                                                                            orientation: 'portrait',
                                                                            keywords: 'test1, application1',
                                                                            resourceDesc
                                                                        },
                                                                        {
                                                                            resourceType: 'CONTENT',
                                                                            resourceId: '2',
                                                                            resourceName:
                                                                                'Folder 1.1.1.1.1.1.1 content 2 Name',
                                                                            thumbnailPath: '../images/favicon.svg',
                                                                            category: 'Test 1',
                                                                            orientation: 'landscape',
                                                                            keywords: 'test1, application1',
                                                                            config: {
                                                                                ...configMock
                                                                            },
                                                                            resourceDesc
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    resourceType: 'CONTENT',
                                                                    resourceId: '2',
                                                                    resourceName: 'Folder 1.1.1.1.1.1 content 1 Name',
                                                                    thumbnailPath: '../images/favicon.svg',
                                                                    category: 'Test 1',
                                                                    orientation: 'portrait',
                                                                    keywords: 'test1, application1',
                                                                    resourceDesc
                                                                },
                                                                {
                                                                    resourceType: 'CONTENT',
                                                                    resourceId: '3',
                                                                    resourceName: 'Folder 1.1.1.1.1.1 content 2 Name',
                                                                    thumbnailPath: '../images/favicon.svg',
                                                                    category: 'Test 1',
                                                                    orientation: 'landscape',
                                                                    keywords: 'test1, application1',
                                                                    config: {
                                                                        ...configMock
                                                                    },
                                                                    resourceDesc
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    resourceType: 'CONTENT',
                                                    resourceId: '2',
                                                    resourceName: 'Folder 1.1.1.1 content 1 Name',
                                                    thumbnailPath: '../images/favicon.svg',
                                                    category: 'Test 1',
                                                    orientation: 'portrait',
                                                    keywords: 'test1, application1',
                                                    resourceDesc
                                                },
                                                {
                                                    resourceType: 'CONTENT',
                                                    resourceId: '3',
                                                    resourceName: 'Folder 1.1.1.1 content 2 Name',
                                                    thumbnailPath: '../images/favicon.svg',
                                                    category: 'Test 1',
                                                    orientation: 'landscape',
                                                    keywords: 'test1, application1',
                                                    config: {
                                                        ...configMock
                                                    },
                                                    resourceDesc
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    resourceType: 'CONTENT',
                                    resourceId: '2',
                                    resourceName: 'Folder 1.1 content 1 Name',
                                    thumbnailPath: '../images/favicon.svg',
                                    category: 'Test 1',
                                    orientation: 'portrait',
                                    keywords: 'test1, application1',
                                    resourceDesc
                                },
                                {
                                    resourceType: 'CONTENT',
                                    resourceId: '3',
                                    resourceName: 'Folder 1.1 content 2 Name',
                                    thumbnailPath: '../images/favicon.svg',
                                    category: 'Test 1',
                                    orientation: 'landscape',
                                    keywords: 'test1, application1',
                                    config: {
                                        ...configMock
                                    },
                                    resourceDesc
                                }
                            ]
                        }
                    ]
                },
                {
                    resourceType: 'FOLDER',
                    resourceName: 'Folder 2 Name',
                    category: 'Test 2',
                    keywords: 'folder2, application2',
                    resourceDesc: 'Resource type is a random text',
                    children: [
                        {
                            resourceType: 'CONTENT',
                            resourceId: '1',
                            resourceName: 'Folder 2 content 1 Name',
                            thumbnailPath: '../images/favicon.svg',
                            category: 'Test 2',
                            orientation: 'landscape',
                            keywords: 'test2, application2',
                            resourceDesc
                        },
                        {
                            resourceType: 'CONTENT',
                            resourceId: '2',
                            resourceName: 'Folder 2 content 2 Name',
                            thumbnailPath: '../images/favicon.svg',
                            category: 'Test 2',
                            orientation: 'portrait',
                            keywords: 'test2, application2',
                            config: {
                                ...configMock
                            },
                            resourceDesc
                        },
                        {
                            resourceType: 'FOLDER',
                            resourceName: 'Folder 2.1 Name',
                            category: 'Test 2',
                            keywords: 'folder2, application2',
                            resourceDesc: 'Resource type is a random text',
                            children: [
                                {
                                    resourceType: 'FOLDER',
                                    resourceName: 'Folder 2.1.1 Name',
                                    category: 'Test 2',
                                    keywords: 'folder2, application2',
                                    resourceDesc: 'Resource type is a random text',
                                    children: [
                                        {
                                            resourceType: 'CONTENT',
                                            resourceId: '1',
                                            resourceName: 'Folder 2.1.1 content 1 Name',
                                            thumbnailPath: '../images/favicon.svg',
                                            category: 'Test 2',
                                            orientation: 'landscape',
                                            keywords: 'test2, application2',
                                            resourceDesc
                                        },
                                        {
                                            resourceType: 'CONTENT',
                                            resourceId: '2',
                                            resourceName: 'Folder 2.1.1 content 2 Name',
                                            thumbnailPath: '../images/favicon.svg',
                                            category: 'Test 3',
                                            orientation: 'portrait',
                                            keywords: 'test2, application2',
                                            config: {
                                                ...configMock
                                            },
                                            resourceDesc
                                        },
                                        {
                                            resourceType: 'FOLDER',
                                            resourceName: 'Folder 2.1.1.1 Name',
                                            category: 'Test 2',
                                            keywords: 'folder2, application2',
                                            resourceDesc: 'Resource type is a random text',
                                            children: [
                                                {
                                                    resourceType: 'FOLDER',
                                                    resourceName: 'Folder 2.1.1.1.1 Name',
                                                    category: 'Test 1',
                                                    keywords: 'folder2, application2',
                                                    resourceDesc: 'Resource type is a random text',
                                                    children: [
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '1',
                                                            resourceName: 'Folder 2.1.1.1.1 content 1 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 2',
                                                            orientation: 'landscape',
                                                            keywords: 'test2, application2',
                                                            resourceDesc
                                                        },
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '2',
                                                            resourceName: 'Folder 2.1.1.1.1 content 2 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 2',
                                                            orientation: 'portrait',
                                                            keywords: 'test2, application2',
                                                            config: {
                                                                ...configMock
                                                            },
                                                            resourceDesc
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    resourceType: 'FOLDER',
                                    resourceName: 'Folder 2.1.2 Name',
                                    category: 'Test 2',
                                    keywords: 'folder2, application2',
                                    resourceDesc: 'Resource type is a random text',
                                    children: [
                                        {
                                            resourceType: 'CONTENT',
                                            resourceId: '1',
                                            resourceName: 'Folder 2.1.2 content 1 Name',
                                            thumbnailPath: '../images/favicon.svg',
                                            category: 'Test 2',
                                            orientation: 'landscape',
                                            keywords: 'test2, application2',
                                            resourceDesc
                                        },
                                        {
                                            resourceType: 'CONTENT',
                                            resourceId: '2',
                                            resourceName: 'Folder 2.1.2 content 2 Name',
                                            thumbnailPath: '../images/favicon.svg',
                                            category: 'Test 3',
                                            orientation: 'portrait',
                                            keywords: 'test2, application2',
                                            config: {
                                                ...configMock
                                            },
                                            resourceDesc
                                        },
                                        {
                                            resourceType: 'FOLDER',
                                            resourceName: 'Folder 2.1.2.1 Name',
                                            category: 'Test 2',
                                            keywords: 'folder2, application2',
                                            resourceDesc: 'Resource type is a random text',
                                            children: [
                                                {
                                                    resourceType: 'FOLDER',
                                                    resourceName: 'Folder 2.1.2.1.1 Name',
                                                    category: 'Test 1',
                                                    keywords: 'folder2, application2',
                                                    resourceDesc: 'Resource type is a random text',
                                                    children: [
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '1',
                                                            resourceName: 'Folder 2.1.2.1.1 content 1 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 2',
                                                            orientation: 'landscape',
                                                            keywords: 'test2, application2',
                                                            resourceDesc
                                                        },
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '2',
                                                            resourceName: 'Folder 2.1.2.1.1 content 2 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 2',
                                                            orientation: 'portrait',
                                                            keywords: 'test2, application2',
                                                            config: {
                                                                ...configMock
                                                            },
                                                            resourceDesc
                                                        }
                                                    ]
                                                },
                                                {
                                                    resourceType: 'FOLDER',
                                                    resourceName: 'Folder 2.1.2.1.2 Name',
                                                    category: 'Test 1',
                                                    keywords: 'folder2, application2',
                                                    resourceDesc: 'Resource type is a random text',
                                                    children: [
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '1',
                                                            resourceName: 'Folder 2.1.2.1.2 content 1 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 2',
                                                            orientation: 'landscape',
                                                            keywords: 'test2, application2',
                                                            resourceDesc
                                                        },
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '2',
                                                            resourceName: 'Folder 2.1.2.1.2 content 2 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 2',
                                                            orientation: 'portrait',
                                                            keywords: 'test2, application2',
                                                            config: {
                                                                ...configMock
                                                            },
                                                            resourceDesc
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            resourceType: 'FOLDER',
                            resourceName: 'Folder 2.2 Name',
                            category: 'Test 2',
                            keywords: 'folder2, application2',
                            resourceDesc: 'Resource type is a random text',
                            children: [
                                {
                                    resourceType: 'FOLDER',
                                    resourceName: 'Folder 2.2.1 Name',
                                    category: 'Test 2',
                                    keywords: 'folder2, application2',
                                    resourceDesc: 'Resource type is a random text',
                                    children: [
                                        {
                                            resourceType: 'CONTENT',
                                            resourceId: '1',
                                            resourceName: 'Folder 2.2.1 content 1 Name',
                                            thumbnailPath: '../images/favicon.svg',
                                            category: 'Test 2',
                                            orientation: 'landscape',
                                            keywords: 'test2, application2',
                                            resourceDesc
                                        },
                                        {
                                            resourceType: 'CONTENT',
                                            resourceId: '2',
                                            resourceName: 'Folder 2.2.1 content 2 Name',
                                            thumbnailPath: '../images/favicon.svg',
                                            category: 'Test 2',
                                            orientation: 'portrait',
                                            keywords: 'test2, application2',
                                            config: {
                                                ...configMock
                                            },
                                            resourceDesc
                                        },
                                        {
                                            resourceType: 'FOLDER',
                                            resourceName: 'Folder 2.2.1.1 Name',
                                            category: 'Test 2',
                                            keywords: 'folder2, application2',
                                            resourceDesc: 'Resource type is a random text',
                                            children: [
                                                {
                                                    resourceType: 'FOLDER',
                                                    resourceName: 'Folder 2.2.1.1.1 Name',
                                                    category: 'Test 2',
                                                    keywords: 'folder2, application2',
                                                    resourceDesc: 'Resource type is a random text',
                                                    children: [
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '1',
                                                            resourceName: 'Folder 2.2.1.1.1 content 1 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 2',
                                                            orientation: 'landscape',
                                                            keywords: 'test2, application2',
                                                            resourceDesc
                                                        },
                                                        {
                                                            resourceType: 'CONTENT',
                                                            resourceId: '2',
                                                            resourceName: 'Folder 2.2.1.1.1 content 2 Name',
                                                            thumbnailPath: '../images/favicon.svg',
                                                            category: 'Test 2',
                                                            orientation: 'portrait',
                                                            keywords: 'test2, application2',
                                                            config: {
                                                                ...configMock
                                                            },
                                                            resourceDesc
                                                        },
                                                        {
                                                            resourceType: 'FOLDER',
                                                            resourceName: 'Folder 2.2.1.1.1.1 Name',
                                                            category: 'Test 2',
                                                            keywords: 'folder2, application2',
                                                            resourceDesc: 'Resource type is a random text',
                                                            children: [
                                                                {
                                                                    resourceType: 'FOLDER',
                                                                    resourceName: 'Folder 2.2.1.1.1.1.1 Name',
                                                                    category: 'Test 2',
                                                                    keywords: 'folder2, application2',
                                                                    resourceDesc: 'Resource type is a random text',
                                                                    children: [
                                                                        {
                                                                            resourceType: 'CONTENT',
                                                                            resourceId: '1',
                                                                            resourceName:
                                                                                'Folder 2.2.1.1.1.1.1 content 1 Name',
                                                                            thumbnailPath: '../images/favicon.svg',
                                                                            category: 'Test 2',
                                                                            orientation: 'landscape',
                                                                            keywords: 'test2, application2',
                                                                            resourceDesc
                                                                        },
                                                                        {
                                                                            resourceType: 'CONTENT',
                                                                            resourceId: '2',
                                                                            resourceName:
                                                                                'Folder 2.2.1.1.1.1.1 content 2 Name',
                                                                            thumbnailPath: '../images/favicon.svg',
                                                                            category: 'Test 2',
                                                                            orientation: 'portrait',
                                                                            keywords: 'test2, application2',
                                                                            config: {
                                                                                ...configMock
                                                                            },
                                                                            resourceDesc
                                                                        },
                                                                        {
                                                                            resourceType: 'FOLDER',
                                                                            resourceName: 'Folder 2.2.1.1.1.1.1.1 Name',
                                                                            category: 'Test 2',
                                                                            keywords: 'folder2, application2',
                                                                            resourceDesc:
                                                                                'Resource type is a random text',
                                                                            children: [
                                                                                {
                                                                                    resourceType: 'FOLDER',
                                                                                    resourceName:
                                                                                        'Folder 2.2.1.1.1.1.1.1.1 Name',
                                                                                    category: 'Test 2',
                                                                                    keywords: 'folder2, application2',
                                                                                    resourceDesc:
                                                                                        'Resource type is a random text',
                                                                                    children: [
                                                                                        {
                                                                                            resourceType: 'CONTENT',
                                                                                            resourceId: '1',
                                                                                            resourceName:
                                                                                                'Folder 2.2.1.1.1.1.1.1.1 content 1 Name',
                                                                                            thumbnailPath:
                                                                                                '../images/favicon.svg',
                                                                                            category: 'Test 2',
                                                                                            orientation: 'landscape',
                                                                                            keywords:
                                                                                                'test2, application2',
                                                                                            resourceDesc
                                                                                        },
                                                                                        {
                                                                                            resourceType: 'CONTENT',
                                                                                            resourceId: '2',
                                                                                            resourceName:
                                                                                                'Folder 2.2.1.1.1.1.1.1.1 content 2 Name',
                                                                                            thumbnailPath:
                                                                                                '../images/favicon.svg',
                                                                                            category: 'Test 2',
                                                                                            orientation: 'portrait',
                                                                                            keywords:
                                                                                                'test2, application2',
                                                                                            config: {
                                                                                                ...configMock
                                                                                            },
                                                                                            resourceDesc
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    resourceType: 'CONTENT',
                                                    resourceId: '2',
                                                    resourceName: 'Folder 2.2.1.1 content 1 Name',
                                                    thumbnailPath: '../images/favicon.svg',
                                                    category: 'Test 2',
                                                    orientation: 'landscape',
                                                    keywords: 'test2, application2',
                                                    resourceDesc
                                                },
                                                {
                                                    resourceType: 'CONTENT',
                                                    resourceId: '3',
                                                    resourceName: 'Folder 2.2.1.1 content 2 Name',
                                                    thumbnailPath: '../images/favicon.svg',
                                                    category: 'Test 2',
                                                    orientation: 'portrait',
                                                    keywords: 'test2, application2',
                                                    config: {
                                                        ...configMock
                                                    },
                                                    resourceDesc
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    resourceType: 'CONTENT',
                                    resourceId: '1',
                                    resourceName: 'Folder 2.2 content 1 Name',
                                    thumbnailPath: '../images/favicon.svg',
                                    category: 'Test 2',
                                    orientation: 'portrait',
                                    keywords: 'test2, application2',
                                    resourceDesc
                                },
                                {
                                    resourceType: 'CONTENT',
                                    resourceId: '2',
                                    resourceName: 'Folder 2.2 content 2 Name',
                                    thumbnailPath: '../images/favicon.svg',
                                    category: 'Test 2',
                                    orientation: 'landscape',
                                    keywords: 'test2, application2',
                                    config: {
                                        ...configMock
                                    },
                                    resourceDesc
                                },
                                {
                                    resourceType: 'CONTENT',
                                    resourceId: '3',
                                    resourceName: 'Folder 2.2 content 3 Name',
                                    thumbnailPath: '../images/favicon.svg',
                                    category: 'Test 2',
                                    orientation: 'portrait',
                                    keywords: 'test2, application2',
                                    config: {
                                        ...configMock
                                    },
                                    resourceDesc
                                }
                            ]
                        }
                    ]
                },
                {
                    resourceType: 'FOLDER',
                    resourceName: 'Folder 3 Name',
                    category: 'Test 3',
                    keywords: 'folder3, application3',
                    resourceDesc: 'Resource type is a random text',
                    children: [
                        {
                            resourceType: 'CONTENT',
                            resourceId: '1',
                            resourceName: 'Folder 3 content 1 Name',
                            thumbnailPath: '../images/favicon.svg',
                            category: 'Test 3',
                            orientation: 'portrait',
                            keywords: 'test3, application3',
                            resourceDesc
                        },
                        {
                            resourceType: 'CONTENT',
                            resourceId: '2',
                            resourceName: 'Folder 3 content 2 Name',
                            thumbnailPath: '../images/favicon.svg',
                            category: 'Test 3',
                            orientation: 'landscape',
                            keywords: 'test3, application3',
                            config: {
                                ...configMock
                            },
                            resourceDesc
                        }
                    ]
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '8',
                    resourceName: 'Test 8 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'portrait',
                    keywords: 'test3, application3',
                    resourceDesc
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '9',
                    resourceName: 'Test 9 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'landscape',
                    keywords: 'test3, application3'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '10',
                    resourceName: 'Test 10 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'landscape',
                    keywords: 'test1, application1',
                    resourceDesc
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '11',
                    resourceName: 'Test 11 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'portrait',
                    keywords: 'test1, application1'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '12',
                    resourceName: 'Test 12 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'portrait',
                    keywords: 'test1, application1',
                    resourceDesc
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '13',
                    resourceName: 'Test 13 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'portrait',
                    keywords: 'test1, application1'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '14',
                    resourceName: 'Test 14 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 1',
                    orientation: 'portrait',
                    keywords: 'test1, application1'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '15',
                    resourceName: 'Test 15 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 2',
                    orientation: 'portrait',
                    keywords: 'test2, application2',
                    resourceDesc
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '16',
                    resourceName: 'Test 16 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 2',
                    orientation: 'portrait',
                    keywords: 'test2, application2'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '17',
                    resourceName: 'Test 17 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 2',
                    orientation: 'portrait',
                    keywords: 'test2, application2',
                    resourceDesc
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '18',
                    resourceName: 'Test 18 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 2',
                    orientation: 'landscape',
                    keywords: 'test2, application2'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '19',
                    resourceName: 'Test 19 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 2',
                    orientation: 'landscape',
                    keywords: 'test2, application2'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '20',
                    resourceName: 'Test 20 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'landscape',
                    keywords: 'test3, application3',
                    resourceDesc
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '21',
                    resourceName: 'Test 21 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'landscape',
                    keywords: 'test3, application3'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '22',
                    resourceName: 'Test 22 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'landscape',
                    keywords: 'test3, application3',
                    resourceDesc
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '23',
                    resourceName: 'Test 23 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'portrait',
                    keywords: 'test3, application3'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '24',
                    resourceName: 'Test 24 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'portrait',
                    keywords: 'test3, application3'
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '25',
                    resourceName: 'Test 25 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'portrait',
                    keywords: 'test3, application3',
                    resourceDesc
                },
                {
                    resourceType: 'CONTENT',
                    resourceId: '26',
                    resourceName: 'Test 26 Name',
                    thumbnailPath: '../images/favicon.svg',
                    category: 'Test 3',
                    orientation: 'portrait',
                    keywords: 'test3, application3',
                    description: ''
                }
            ];

            if (data.payload.searchQuery) {
                content = searchElementByKeyword(content, data.payload.searchQuery);
            }

            if (data.payload.orientation) {
                content = filterElementByOrientation(content, localStorage.getItem('app-content-orientation') || data.payload.orientation);
            }

            publishEvent(
                channel,
                {
                    type: 'contents',
                    payload: {
                        categories,
                        content,
                        filtersOff: localStorage.getItem('app-content-filters-off') === 'true',
                        searchOff: localStorage.getItem('app-content-search-off') === 'true',
                        showAppTitle: localStorage.getItem('app-show-title') === 'true',
                        showAppBadges: localStorage.getItem('app-show-badges') === 'true'
                    }
                },
                2000
            );
        } else if (data.type === 'auth') {
            const appAuthLocalStorige = localStorage.getItem('app-auth-storage') === 'true';
            let getServicesUrl = '<extension-base-path>/app-auth-services.json';
            let disconnectServiceUrl = '<extension-base-path>/app-auth-disconnect.json';

            if (isLogger()) {
                console.debug('[VXT App][auth] use services from HTTP');
            }

            if (appAuthLocalStorige) {
                getServicesUrl = 'localStorage/key-in-localstorage';
                disconnectServiceUrl = 'localStorage/key-in-localstorage';

                localStorage.setItem('key-in-localstorage', '[]');

                if (isLogger()) {
                    console.debug('[VXT App][auth] switch services to localStorage');
                }
            }

            publishEvent(
                channel,
                {
                    type: 'auth',
                    payload: {
                        customizations: {
                            message: 'Authenticate your service',
                            button: 'Connect',
                            servicesTitle: 'App Services'
                        },
                        fixedServices: [
                            {
                                name: 'Fixed service 1 - vxt authentication service number 1'
                            },
                            {
                                name: 'Fixed service 2  - vxt authentication service number 2'
                            },
                            {
                                name: 'Fixed service 3'
                            }
                        ],
                        dialogUrl: '<extension-base-path>/login-page.html',
                        getServicesUrl,
                        disconnectServiceUrl
                    }
                },
                1000
            );
        } else if (data.type === 'metadata') {
            const payload = [
                {
                    type: 'view',
                    showAppTitle: localStorage.getItem('app-show-title') === 'true',
                    showAppBadges: localStorage.getItem('app-show-badges') === 'true'
                },
                {
                    type: 'header',
                    title: 'Metadata driven app'
                },
                {
                    type: 'paragraph',
                    title: 'Paragraph',
                    description: 'Description'
                }
            ];

            if(localStorage.getItem('app-metadata-allow-upload')) {
                const dynamicContent = {
                    type: 'dynamicContent',
                    title: 'dynamicContentTest',
                    description: 'dynamicContentTest upload',
                    allowUpload: true,
                    showUploadProgress: true,
                    items: [
                        {
                            title: "test image.jpg",
                            url: '<extension-base-path>/assets/fox.png',
                            width: 300,
                            height: 300
                        },
                        {
                            title: 'test video.mp4',
                            url:'<extension-base-path>/assets/bigbuckbunny_trailer_480p.mp4',
                            width:450,
                            height:300,
                            thumb: '<extension-base-path>/assets/bigbuckbunny_trailer_thumb.png',
 		                    duration: 38
                        },
                        {
                            title: "test sound.mp3",
                            url: '<extension-base-path>/assets/sunshine-strum-parade.mp3',
                            duration: 130
                        }
                    ]
                }
                payload.push(dynamicContent);
                payload.push({
                    ...dynamicContent,
                    display: 'carousel'
                });
            }

            if (localStorage.getItem('app-target') === 'events') {
                payload.push({
                    type: 'target',
                    value: 'events'
                });
            }

            publishEvent(
                channel,
                {
                    type: 'metadata',
                    payload
                },
                1500
            );
        }
    });
}

function publishEvent(channel, payload, timeout) {
    if (isLogger()) {
        console.debug('[VXT App] data', JSON.stringify(payload));
    }
    setTimeout(() => {
        channel.publish('data', payload);
    }, timeout);
}

function sendConfigError(channel, partial) {
    const partialPayload = [
        {
            id: 'messagePartial',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        }
    ];
    const payload = [
        {
            id: 'errorCheckbox',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        },
        {
            id: 'error-weburl',
            error:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!',
            errorDetails: 'There is an error in the checkbox.'
        },
        {
            id: 'error-text',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        },
        {
            id: 'error-number',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        },
        {
            id: 'error-date',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        },
        {
            id: 'error-time',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        },
        {
            id: 'error-radio',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        },
        {
            id: 'error-color',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        },
        {
            id: 'error-media',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        },
        {
            id: 'error-text2',
            error: 'Error in the sent config.',
            errorDetails:
                'There is an error in the checkbox. It should be checked. But it is not. Please check it. Thank you. Have a nice day!'
        }
    ];
    setTimeout(() => {
        channel.publish('data', {
            type: 'configError',
            payload: partial ? partialPayload : payload
        });
    }, 2000);
}

function searchElementByKeyword(content, keyword) {
    return content
        .map((element) => {
            const filteredChildren = element.children ? searchElementByKeyword(element.children, keyword) : [];
            return {
                ...element,
                children: filteredChildren.length > 0 ? filteredChildren : undefined
            };
        })
        .filter(
            (element) =>
                element.resourceName.toLowerCase().includes(keyword.toLowerCase()) ||
                element.keywords.toLowerCase().includes(keyword.toLowerCase())
        );
}

function filterElementByOrientation(content, orientation) {
    return content
        .map((element) => {
            const filteredChildren = element.children ? filterElementByOrientation(element.children, orientation) : [];
            return {
                ...element,
                children: filteredChildren.length > 0 ? filteredChildren : undefined
            };
        })
        .filter((element) => element.orientation === orientation || !element.orientation);
}

function waitForVxtApi() {
    const interval = setInterval(() => {
        if (window.$vxt) {
            clearInterval(interval);
            createChannel();
        }
    }, 100);
}
waitForVxtApi();
