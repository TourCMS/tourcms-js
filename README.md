# tourcms-js

JavaScript wrapper for accessing the TourCMS API

## Status

Extremely rough, not suggested for production

## Dependencies

Currently this repo includes all dependencies:

* http://phpjs.org/functions/rawurlencode/
* http://pajhome.org.uk/crypt/md5/sha256.html

## Usage

Include the two js files contained in `lib` 

```html
<script type="text/javascript" src="lib/sha256.js"></script>
<script type="text/javascript" src="lib/rawurlencode.js"></script>
```

Plus the tourcms js file itself

```html
<script type="text/javascript" src="tourcms.js"></script>
```

Create a new wrapper

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

Make API calls, passing a callback function. For example a tour search
http://www.tourcms.com/support/api/mp/tour_search.php

```js
// Channel ID
// Tour Operators set this to their channel ID
// Agents can set to limit to a specific channel
// Or pass as 0 to search all

let channelID = 3930;

// Search Tours
tourcms.searchTours(channelID);

```


TourCMS wrapper will always return the JS Promise with the request to API, that way
you can manage it in the way you want