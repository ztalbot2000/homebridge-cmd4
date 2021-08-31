/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "schema" }]*/

const schema =
{
   'schema':
   {
      'name':
      {
         'title': 'Name',
            'type': 'string',
            'default': 'MercedesPlatform',
            'description': 'Name for the log.'
      },
         'debug':
      {
         'title': 'Debug',
            'type': 'boolean',
            'description': 'Enables additional output in the log.'
      },
         'accessories':
      {
         'type': 'object',
            'properties':
         {
            'name':
            {
               'title': 'Name',
                  'description': 'The name of your accessory in HomeKit',
                  'type': 'string',
                  'required': true
            },
               'clientID':
            {
               'title': 'Client ID',
                  'description': 'Client ID from https://developer.mercedes-benz.com/',
                  'type': 'string',
                  'required': true
            },
               'clientSecret':
            {
               'title': 'Client Secret',
                  'description': 'Client Secret from https://developer.mercedes-benz.com/',
                  'type': 'string',
                  'required': true
            },
               'vin':
            {
               'title': 'Vehicle Identification Number (VIN)',
                  'description': 'VIN of the accessory',
                  'type': 'string',
                  'required': true
            },
               'electricVehicle':
            {
               'title': 'Electric Vehicle',
                  'type': 'boolean',
                  'description': 'Check if your accessory is an electric vehicle.'
            },
               'hybridVehicle':
            {
               'title': 'Hybrid Vehicle',
                  'type': 'boolean',
                  'description': 'Check if your accessory is a hybrid vehicle.'
            },
               'tankBatteryType':
            {
               'title': 'Tank load/Battery Accessory Type',
                  'type': 'string',
                  'description': 'You can choose between several accessory types for your tank load and/or electric vehicle battery. If \'none\' is choosen, only the tank load (for non electric vehicle) or battery level (electric vehicle) will be shown as a battery service within the accessory.',
                  'oneOf': [
               {
                  'title': 'Humidity Sensor',
                     'enum': [
                     'HUMIDITY'
                     ]
               },
               {
                  'title': 'Lighhtbulb',
                     'enum': [
                     'LIGHTBULB'
                     ]
               }
               ]
            },
               'manufacturer':
            {
               'name': 'Manufacturer',
                  'type': 'string',
                  'description': 'Set the manufacturer name for display in the Home app.'
            },
               'model':
            {
               'title': 'Model',
                  'description': 'Accessory model',
                  'type': 'string',
                  'required': false
            },
               'maxRange':
            {
               'title': 'Max Range',
                  'description': 'Maximum distance after full tank load',
                  'type': 'integer',
                  'required': false
            },
               'polling':
            {
               'title': 'Polling',
                  'description': 'Mercedes Me API Polling in seconds',
                  'type': 'integer',
                  'required': false,
                  'placeholder': 60,
                  'minimum': 60
            },
               'token':
            {
               'titel': 'Token',
                  'type': 'object',
                  'properties':
               {
                  'access_token':
                  {
                     'title': 'Access Token',
                        'type': 'string',
                        'required': true
                  },
                     'refresh_token':
                  {
                     'title': 'Refresh Token',
                        'type': 'string',
                        'required': true
                  },
                     'token_type':
                  {
                     'title': 'Token Type',
                        'type': 'string',
                        'required': true
                  },
                     'expires_in':
                  {
                     'title': 'Expires In',
                        'type': 'integer',
                        'required': true
                  },
                     'expires_at':
                  {
                     'title': 'Expires at',
                        'type': 'string',
                        'required': true
                  }
               }
            }
         }
      }
   },
   'layout': [
   'name',
   'debug',
   'accessories.name',
   'accessories.clientID',
   'accessories.clientSecret',
   'accessories.vin',
   'accessories.electricVehicle',
   'accessories.hybridVehicle',
   'accessories.tankBatteryType',
   {
      'key': 'accessories',
         'type': 'section',
         'title': 'Branding',
         'expandable': true,
         'expanded': false,
         'orderable': false,
         'items': [
         'accessories.manufacturer',
         'accessories.model'
         ]
   },
   {
      'key': 'accessories',
         'type': 'section',
         'title': 'Extras',
         'expandable': true,
         'expanded': false,
         'orderable': false,
         'items': [
         'accessories.maxRange',
         'accessories.polling'
         ]
   },
   {
      'key': 'accessories.token',
         'type': 'section',
         'title': 'Authorization',
         'expandable': true,
         'expanded': false,
         'orderable': false,
         'items': [
         'accessories.token.access_token',
         'accessories.token.refresh_token',
         'accessories.token.token_type',
         'accessories.token.expires_in',
         'accessories.token.expires_at'
         ]
   }
   ]
};
