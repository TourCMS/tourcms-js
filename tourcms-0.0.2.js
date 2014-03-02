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
// path, channelId, callback, verb, postData

this.request = function(a) {
	
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
	
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", 'Content-type: text/xml;charset="utf-8"');
	//http.setRequestHeader("Content-length", params.length);
	//http.setRequestHeader("Date", gmdate('D, d M Y H:i:s \\G\\M\\T', outboundTime)),
	http.setRequestHeader("x-tourcms-date", outboundTime);
	http.setRequestHeader("Authorization", "TourCMS " + a.channelId + ":" + this.marketplaceId + ":" + signature);
	// http.setRequestHeader("Connection", "close");
	
	http.onreadystatechange = function() {
	
		if(http.readyState == 4 && http.status == 200  && typeof a.callback != "undefined") {				
			
			var text = http.responseText
			
			a.callback(
				text,
				http.responseXML.documentElement.getElementsByTagName("error")[0].textContent
				);
				
		} else if (http.readyState == 4 && typeof a.callbackError != "undefined") {
		
			var text = http.responseText
			
			a.callbackError(
				text,
				http.responseXML.documentElement.getElementsByTagName("error")[0].textContent
				);
			
		}
	}
	//console.log(params);
	// Call the API
	http.send(params);
}

// API Methods

	// Get the API rate limit status
	this.apiRateLimitStatus = function(a) {
	
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
			
		// Call API
		this.request({
						"path" : '/api/rate_limit_status.xml',
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
	}

// Channel methods
	this.listChannels = function(a) {
	
		// Call API
		this.request({
						"path" : '/p/channels/list.xml',
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
					
	}
	
	this.showChannel = function(a) {
		
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
			
		// Call API
		this.request({
						"path" : '/c/channel/show.xml',
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
					
	}
	
// Tour methods
	this.searchTours = function(a) {

		// Sensible defaults
		if(typeof a.params.qs === "undefined")
			a.params.qs = "";
		
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
	
		// Set API path
		if(a.params.channelId==0) 
			path = '/p/tours/search.xml?' + a.params.qs;
		else 
			path = '/c/tours/search.xml?' + a.params.qs;
		
		// Call API
		this.request({
						"path" : path,
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
			
	}

	
	this.listTours = function(a) {
	
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
	
		// Set API path
		if(a.params.channelId==0) 
			path = '/p/tours/list.xml';
		else 
			path = '/c/tours/list.xml';
		
		// Call API
		this.request({
						"path" : path,
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
					
	}
	
	this.listTourImages = function(a) {
	
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
		
		// Set API path
		if(a.params.channelId==0) 
			path = '/p/tours/images/list.xml';
		else 
			path = '/c/tours/images/list.xml';
		
		// Call API
		this.request({
						"path" : path,
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
			
	}
	
	this.showTour = function(a) {
		
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
			
		if(typeof a.params.tourId === "undefined")
			a.params.tourId = 0;
						
		// Call API
		this.request({
						"path" : '/c/tour/show.xml?id=' + tourId,
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});	
					
	}
	
	this.showTourDepartures = function(a) {
	
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
			
		if(typeof a.params.tourId === "undefined")
			a.params.tourId = 0;
						
		// Call API
		this.request({
						"path" : '/c/tour/datesprices/dep/show.xml?id=' + tourId,
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});	
					
	}
	
	this.showTourFreesale = function(a) {
		
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
			
		if(typeof a.params.tourId === "undefined")
			a.params.tourId = 0;
						
		// Call API
		this.request({
						"path" : '/c/tour/datesprices/freesale/show.xml?id=' + tourId,
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
					
	}


// Booking methods

	this.showBooking = function(a) {
		
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
		
		if(typeof a.params.bookingId === "undefined")
			a.params.bookingId = 0;
		
		
		// Call API
		this.request({
						"path" : '/c/booking/show.xml?booking_id=' + a.params.bookingId,
						"channelId" :  a.params.channelId,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
		
	}
	
	/*
	public function search_voucher($voucher_data = null, $channel = 0) {
	        
	                if($voucher_data == null) {
	                        $voucher_data = new SimpleXMLElement('<voucher />');
	                        $voucher_data->addChild('barcode_data', '');
	                }
	        
	                if($chanel_id == 0) {
	                        return($this->request('/p/voucher/search.xml', $channel, 'POST', $voucher_data));
	                } else {
	                        return($this->request('/c/voucher/search.xml', $channel, 'POST', $voucher_data));
	                }
	        }
	*/
	
	this.searchVouchers = function(a) {
		
		// Sensible defaults
		if(typeof a.params.channelId === "undefined")
			a.params.channelId = 0;
		
		if(typeof a.params.voucherString === "undefined")
			a.params.voucherString = '';
			
		// creates a Document object with root "<report>"
		var doc = document.implementation.createDocument(null, null, null);
		//var voucherData = document.implementation.createDocument(null, "voucher", null);
		var voucherData = doc.createElement("voucher"), text;
		
		// create the <barcode_data> node
		var barcodeData = doc.createElement("barcode_data"), text;
		var barcodeText = doc.createTextNode(a.params.voucherString);
		
		// append to document
		barcodeData.appendChild(barcodeText);
		voucherData.appendChild(barcodeData);
		doc.appendChild(voucherData);
		console.log(voucherData);
		
		// Set API path
		if(a.params.channelId==0) 
			path = '/p/voucher/search.xml';
		else 
			path = '/c/voucher/search.xml';
		
		// Call API
		this.request({
						"path" : path,
						"channelId" :  a.params.channelId,
						"verb" : "POST",
						"postData" : voucherData,
						"callback" : a.callback,
						"callbackError" : a.callbackError
					});
		
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