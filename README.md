# tourcms-js

JavaScript wrapper for accessing the TourCMS API

## Status

Currently in beta version

## Dependencies
If you use this wrapper installing it from npm, all dependencies will be installed automatically and wrapper would be ready to work with

#### Development
Currently, for development purposes you need to execute `npm install` to install the dependencies

## Usage
#### As NPM installed package

If you are using it as npm package, you need to install it
```sh
npm i tourcms-js
```
And after, just import it
```js
import TourCMS from 'tourcms-js'
```

#### As browser JS script tag
Otherwise, if you are using it on a script tag in browser, you need to import the class from some NPM CDN URL as UNPKG (https://unpkg.com/) or JSDelivr (https://www.jsdelivr.com/)
```js
import TourCMS from 'https://unpkg.com/tourcms-js@2.1.0'

import TourCMS from 'https://cdn.jsdelivr.net/npm/tourcms-js@2.1.0'
```
Please, note that script tag must have ```type="text"```attribute in order to work.


After import, create a new object, and start working with it

```js
// API Settings

// TourCMS Marketplace ID
// Tour Operators set this to 0
// Agents find it in your TourCMS control panel
let marketplaceId = 0;

// API Key
// Tour Operators find this in Configuration & Setup > API
// Agents find this in  
let APIKey = 'API_KEY_HERE';
 
// Create a new TourCMS API object
let tourcms = new TourCMS(marketplaceId, APIKey);

// API Base Url
// By default the base URL will point to TourCMS main production environment. 
// Using this variable will override this to point at another base URL, intended for testing purposes.
let baseURL = 'http://test-api.tourcms.com';
tourcms.setBaseURL(baseURL)

```

Make API calls, managing response from API. For example a tour search
https://www.tourcms.com/support/api/mp/tour_search.php

```js
// Channel ID
// Tour Operators set this to their channel ID
// Agents can set to limit to a specific channel
// Or pass as 0 to search all

let channelID = 3930;

// Search Tours
let promise = tourcms.searchTours(channelID);
```
TourCMS wrapper will always return the JS Promise with the request to API, that way
you can manage it in the way you want

```js

promise
.then((response) => {
    // Data will contain TourCMS response(XML) as string
    let data = response.data;
})
.catch((error) => {
    // In case of any error, you can access it
    console.log(error)
})
.finally(() => {
    // Tasks to be executed no matter if successfull or error
})
```