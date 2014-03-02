// TourCMS API Class
// Interacts with the TourCMS API
// Constructor Params:
//		p.marketeplaceId Integer Marketplace ID
//		p.apiKey String API Private Key
	
TourcmsApi = function(p) {

this.baseURL = 'https://api.tourcms.com';
this.marketplaceId = p.marketplaceId;
this.apiKey = p.apiKey;
		
// Carry out a request to the TourCMS API

this.request = function(a) {
	
	return new Promise(function(resolve, reject) {
	
		// Sensible defaults
		if(typeof a.channelId == "undefined")
			a.channelId = 0;
		
		if(typeof a.verb == "undefined")
			a.verb = 'GET';
	
		//console.log(a.postData);
	
		if(typeof a.postData == "undefined") {
			var params = "";
		} else {
			var s = new XMLSerializer();
			var params = s.serializeToString(a.postData);
		}
		
		// Get the current time
		var outboundTime = this.time();
		
		// Generate the signature
		var signature = this.generateSignature(a.path, a.channelId, a.verb, outboundTime);
		
		var url = this.baseURL + a.path;
	
		var http = new XMLHttpRequest();
		
		http.open(a.verb, url, true);
		
		// Send the proper header information along with the request
		http.setRequestHeader("Content-type", 'Content-type: text/xml;charset="utf-8"');
		// http.setRequestHeader("Content-length", params.length);
		// http.setRequestHeader("Date", gmdate('D, d M Y H:i:s \\G\\M\\T', outboundTime)),
		http.setRequestHeader("x-tourcms-date", outboundTime);
		http.setRequestHeader("Authorization", "TourCMS " + a.channelId + ":" + this.marketplaceId + ":" + signature);
		// http.setRequestHeader("Connection", "close");
		
		http.onload = function() {
		
			if(http.status == 200) {				
				 resolve(http.response);
			} else {
				reject(Error(http.statusText));
			}
		}
		
		// Handle network errors
		http.onerror = function() {
		
		      reject(Error("Network Error"));
		
		};
		
		//console.log(params);
		// Call the API
		http.send(params);
	});
}

// API Methods

	// Get the API rate limit status
	this.apiRateLimitStatus = function(a) {
	
		// Sensible defaults
		if(typeof a.channelId === "undefined")
			a.channelId = 0;
	
		a.path = '/api/rate_limit_status.xml';
	
		// Call API
		return this.request(a);
	}

// Channel methods
	this.listChannels = function() {
		
		// Call API
		return this.request({ path: '/p/channels/list.xml' });
					
	}
	
	this.showChannel = function(a) {
		
		if(arguments.length < 1) {
			var a = { channelId : 0 }
		} else {
			var a = arguments[0];
			// Sensible defaults
			if(typeof a.channelId === "undefined")
				a.channelId = 0;
		}
		
		a.path = '/c/channel/show.xml';
		
		// Call API
		return this.request(a);
					
	}
	
// Tour methods
	this.searchTours = function(a) {

		// Sensible defaults
		if(typeof a.params === "undefined")
			qs = '';
		else
			qs = this.serialize(a.params)
		
		if(typeof a.channelId === "undefined")
			a.channelId = 0;
	
		// Set API path
		if(a.channelId==0) 
			a.path = '/p/tours/search.xml?' + qs;
		else 
			a.path = '/c/tours/search.xml?' + qs;
		
		// Call API
		return this.request(a);
			
	}

	
	this.listTours = function(a) {
	
		// Sensible defaults
		if(typeof a.channelId === "undefined")
			a.channelId = 0;
	
		// Set API path
		if(a.channelId==0) 
			a.path = '/p/tours/list.xml';
		else 
			a.path = '/c/tours/list.xml';
		
		// Call API
		return this.request(a);
					
	}
	
	this.listTourImages = function(a) {
	
		// Sensible defaults
		if(typeof a.channelId === "undefined")
			a.channelId = 0;
		
		// Set API path
		if(a.channelId==0) 
			a.path = '/p/tours/images/list.xml';
		else 
			a.path = '/c/tours/images/list.xml';
		
		// Call API
		return this.request(a);
			
	}
	
	this.showTour = function(a) {
		
		// Check required params
		if(typeof a.channelId === "undefined")
			return new Promise(function(resolve, reject) { reject(Error("Must supply a channelId")) });
			
		if(typeof a.tourId === "undefined")
			return new Promise(function(resolve, reject) { reject(Error("Must supply a tourId")) });
		
		a.path = '/c/tour/show.xml?id=' + a.tourId;
						
		// Call API
		return this.request(a);	
					
	}
	
	this.showTourDepartures = function(a) {
	
		// Check required params
		if(typeof a.channelId === "undefined")
			return new Promise(function(resolve, reject) { reject(Error("Must supply a channelId")) });
			
		if(typeof a.tourId === "undefined")
			return new Promise(function(resolve, reject) { reject(Error("Must supply a tourId")) });
		
		a.path = '/c/tour/datesprices/dep/show.xml?id=' + a.tourId;
		
		// Call API
		return this.request(a);	
					
	}
	
	this.showTourFreesale = function(a) {
		
		// Check required params
		if(typeof a.channelId === "undefined")
			return new Promise(function(resolve, reject) { reject(Error("Must supply a channelId")) });
			
		if(typeof a.tourId === "undefined")
			return new Promise(function(resolve, reject) { reject(Error("Must supply a tourId")) });
	
		a.path = '/c/tour/datesprices/freesale/show.xml?id=' + a.tourId;
	
		// Call API
		return this.request(a);
					
	}


// Booking methods

	this.showBooking = function(a) {
		
		// Check required params
		if(typeof a.channelId === "undefined")
			return new Promise(function(resolve, reject) { reject(Error("Must supply a channelId")) });
			
		if(typeof a.bookingId === "undefined")
			return new Promise(function(resolve, reject) { reject(Error("Must supply a bookingId")) });
		
		a.path = '/c/booking/show.xml?booking_id=' + a.bookingId;
		
		// Call API
		return this.request(a);
		
	}

	
	this.searchVouchers = function(a) {
		
		// Sensible defaults
		if(typeof a.channelId === "undefined")
			a.channelId = 0;
		
		if(typeof a.voucherString === "undefined")
			a.voucherString = '';
			
		// creates a Document object with root "<report>"
		var doc = document.implementation.createDocument(null, null, null);
		//var voucherData = document.implementation.createDocument(null, "voucher", null);
		var voucherData = doc.createElement("voucher"), text;
		
		// create the <barcode_data> node
		var barcodeData = doc.createElement("barcode_data"), text;
		var barcodeText = doc.createTextNode(a.voucherString);
		
		// append to document
		barcodeData.appendChild(barcodeText);
		voucherData.appendChild(barcodeData);
		doc.appendChild(voucherData);
		//console.log(voucherData);
		
		a.postData = voucherData;
		
		delete a.voucherString;
		
		// Set API path
		if(a.channelId==0) 
			a.path = '/p/voucher/search.xml';
		else 
			a.path = '/c/voucher/search.xml';
			
		a.verb = "POST";
		
		// Call API
		return this.request(a);
		
	}

// Generate the signature required to sign API calls
this.generateSignature = function(path, channelId, verb, outboundTime) {
	var stringToSign = channelId + "/" + this.marketplaceId + "/" + verb + "/" + outboundTime + path;
	var signature = rawurlencode(b64_hmac_sha256(this.apiKey, stringToSign) + "=");
	
	return signature;
}

// Generate the current Unix Timestamp (PHP style)
this.time = function() {
	return Math.floor(new Date().getTime() / 1000);
}

// Helper for XML parsing
this.parseXml = function(text) {
	if (window.DOMParser) {
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(text,"text/xml");
	}
	else // Internet Explorer 
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(text);
	}
	return xmlDoc;
}

this.serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

// Helper for XML to JSON
this.xmlToJson = function(xml) {
    var attr,
        child,
        attrs = xml.attributes,
        children = xml.childNodes,
        key = xml.nodeType,
        obj = {},
        i = -1;

    if (key == 1 && attrs.length) {
      obj[key = '@attributes'] = {};
      while (attr = attrs.item(++i)) {
        obj[key][attr.nodeName] = attr.nodeValue;
      }
      i = -1;
    } else if (key == 3) {
      obj = xml.nodeValue;
    }
    while (child = children.item(++i)) {
      key = child.nodeName;
      if (obj.hasOwnProperty(key)) {
        if (obj.toString.call(obj[key]) != '[object Array]') {
          obj[key] = [obj[key]];
        }
        obj[key].push(this.xmlToJson(child));
      }
      else {
        obj[key] = this.xmlToJson(child);
      }
    }
    return obj;
  }
  
return this;
}