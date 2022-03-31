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
var marketplaceId = 0;

// API Key
// Tour Operators find this in Configuration & Setup > API
// Agents find this in  
var apiKey = 'API_KEY_HERE';

// API Base Url
// By default the base URL will point to TourCMS main production environment. 
// Using this variable will override this to point at another base URL, intended for testing purposes.
var baseURL = 'http://tester-api.tourcms.com';
 
// Create a new TourCMS API object
var tourcms = TourcmsApi({
	"marketplaceId" : marketplaceId, 
 	"apiKey" : apiKey,
	// Optional
	"baseURL" : baseURL
});
 
```

Make API calls, passing a callback function. For example a tour search
http://www.tourcms.com/support/api/mp/tour_search.php

```js
// Channel ID
// Tour Operators set this to their channel ID
// Agents can set to limit to a specific channel
// Or pass as 0 to search all

var channelID = 0;

// Search Tours
tourcms.searchTours({
	"params" : {
		"channelId" : channelId
	},
	"callback" : function(response, err) {
	
		console.log(response);		
		
	}
});
```