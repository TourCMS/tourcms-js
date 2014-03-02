# tourcms-js

JavaScript wrapper for accessing the TourCMS API

## Status

Early, not suggested for production

## Dependencies

Currently this repo includes it's core dependencies:

* http://phpjs.org/functions/rawurlencode/
* http://pajhome.org.uk/crypt/md5/sha256.html

Uses promises, see [can i use](http://caniuse.com/promises) and [polyfill](https://github.com/jakearchibald/es6-promise)

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
 
// Create a new TourCMS API object
var tourcms = TourcmsApi({
	"marketplaceId" : marketplaceId, 
 	"apiKey" : apiKey
});
 
```

Make API calls
http://www.tourcms.com/support/api/mp/tour_search.php

```js
// Channel ID
// Tour Operators set this to their channel ID
// Agents can set to limit to a specific channel
// Or pass as 0 to search all

var channelID = 0;

// Search Tours
TourCMS.searchTours({
			channelId : 3930,
			params : {
				k : 'rafting'
			}
			}).then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
});
```