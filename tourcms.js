import axios from 'axios'
import rawurlencode from 'rawurlencode'
import X2JS from 'x2js'
import { HmacMD5, HmacSHA1, HmacSHA256, HmacSHA3, HmacSHA512 } from 'crypto-js'
import Base64 from 'crypto-js/enc-base64';

export default class TourCMS {

    // HTTP VERBS
    static HTTP_VERB_GET = 'GET'
    static HTTP_VERB_POST = 'POST'

    // ACCOUNT
    static P_ACCOUNT_CREATE = '/p/account/create.xml'
    static P_ACCOUNT_UPDATE = '/p/account/update.xml'
    static P_ACCOUNT_SHOW = '/p/account/show.xml'
    static ACCOUNT_CUSTOM_FIELDS_GET = '/api/account/custom_fields/get.xml';

    // AGENTS 
    static C_AGENTS_SEARCH = '/c/agents/search.xml'
    static P_AGENTS_SEARCH = '/p/agents/search.xml'
    static C_AGENTS_UPDATE = '/c/agents/update.xml'

    // API
    static API_RATE_LIMIT = '/api/rate_limit_status.xml'

    // CHANNELS
    static P_CHANNELS_LIST = '/p/channels/list.xml'
    static C_CHANNEL_SHOW = '/c/channel/show.xml'
    static C_CHANNEL_LOGO_UPLOAD_GET_URL = '/c/channel/logo/upload/url.xml'
    static C_CHANNEL_LOGO_UPLOAD_PROCESS = '/c/channel/logo/upload/process.xml'
    static P_CHANNEL_PERFORMANCE = '/p/channels/performance.xml'
    static C_CHANNEL_PERFORMANCE = '/c/channels/performance.xml'
    static P_CHANNEL_CREATE = '/p/channel/create.xml'
    static P_CHANNEL_UPDATE = '/p/channel/update.xml'

    // TOURS / HOTELS
    static C_TOURS_SEARCH = '/c/tours/search.xml'
    static P_TOURS_SEARCH = '/p/tours/search.xml'
    static P_HOTELS_SEARCH_RANGE = '/p/hotels/search_range.xml'
    static C_HOTELS_SEARCH_RANGE = '/c/hotels/search_range.xml'
    static P_HOTELS_SEARCH_AVAIL = '/p/hotels/search_avail.xml'
    static C_HOTELS_SEARCH_AVAIL = '/c/hotels/search_avail.xml'
    static C_TOURS_FILTERS = '/c/tours/filters.xml'
    static C_TOUR_UPDATE = '/c/tour/update.xml'
    static C_TOURS_LIST = '/c/tours/list.xml'
    static P_TOURS_LIST = '/p/tours/list.xml'
    static P_TOUR_IMAGES_LIST = '/p/tours/images/list.xml'
    static C_TOUR_IMAGES_LIST = '/c/tours/images/list.xml'
    static P_TOURS_LOCATIONS = '/p/tours/locations.xml'
    static C_TOURS_LOCATIONS = '/c/tours/locations.xml'
    static C_TOUR_DELETE = '/c/tour/delete.xml'
    static C_TOUR_SHOW = '/c/tour/show.xml'
    static C_TOURS_FILES_UPLOAD_GET_URL = '/c/tours/files/upload/url.xml'
    static C_TOURS_FILES_UPLOAD_PROCESS = '/c/tours/files/upload/process.xml'
    static C_TOUR_IMAGES_DELETE = '/c/tour/images/delete.xml'
    static C_TOUUR_DOCUMENT_DELETE = '/c/tour/document/delete.xml'
    static C_TOUR_CHECKAVAIL = '/c/tour/datesprices/checkavail.xml'

    // TOUR IMPORTER
    static TOURS_IMPORTER_FACETS_GET = "/api/tours/importer/get_tour_facets.xml";
    static TOURS_IMPORTER_LIST_GET = "/api/tours/importer/get_tour_list.xml";
    static TOURS_IMPORTER_IMPORT_STATUS = "/api/tours/importer/get_import_tours_status.xml";
    static TOUR_BOOKINGS_RESTRICTIONS_LIST = "/api/tours/restrictions/list_tour_bookings_restrictions.xml";

    // DATES AND PRICES
    static C_TOUR_DATESPRICES_SEARCH = '/c/tour/datesprices/datesndeals/search.xml'
    static C_TOUR_DATESPRICES_DEPARTURES_SHOW = '/c/tour/datesprices/dep/show.xml'
    static C_TOUR_DATESPRICES_FREESALE_SHOW = '/c/tour/datesprices/freesale/show.xml'
    static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_SEARCH = '/c/tour/datesprices/dep/manage/search.xml'
    static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_SHOW = '/c/tour/datesprices/dep/manage/show.xml'
    static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_NEW = '/c/tour/datesprices/dep/manage/new.xml'
    static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_UPDATE = '/c/tour/datesprices/dep/manage/update.xml'
    static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_DELETE = '/c/tour/datesprices/dep/manage/delete.xml'

    // PICKUPS
    static C_PICKUPS_NEW = '/c/pickups/new.xml'
    static C_PICKUPS_LIST = '/c/pickups/list.xml'
    static C_PICKUPS_UPDATE = '/c/pickups/update.xml'
    static C_PICKUPS_DELETE = '/c/pickups/delete.xml'

    // PICKUP ROUTES
    static TOUR_PICKUP_ROUTES_SHOW = '/api/tours/pickup/routes/show.xml'
    static TOUR_PICKUP_ROUTES_UPDATE = '/api/tours/pickup/routes/update.xml'
    static TOUR_PICKUP_ROUTES_ADD_PICKUP = '/api/tours/pickup/routes/pickup_add.xml'
    static TOUR_PICKUP_ROUTES_UPDATE_PICKUP = '/api/tours/pickup/routes/pickup_update.xml'
    static TOUR_PICKUP_ROUTES_DELETE_PICKUP = '/api/tours/pickup/routes/pickup_delete.xml'

    // GEOCODES
    static TOUR_GEOS_CREATE = '/api/tours/geos/create.xml'
    static TOUR_GEOS_UPDATE = '/api/tours/geos/update.xml'
    static TOUR_GEOS_DELETE = '/api/tours/geos/delete.xml'

    // PROMO
    static C_PROMO_SHOW = '/c/promo/show.xml'

    // MARKUPS
    static C_MARKUPS_SHOW = '/c/markups/show.xml'

    // BOOKINGS
    static C_BOOKINGS_LIST = '/c/bookings/list.xml'
    static P_BOOKINGS_LIST = '/p/bookings/list.xml'
    static C_BOOKING_SHOW = '/c/booking/show.xml'
    static C_BOOKING_SEND_EMAIL = '/c/booking/email/send.xml'
    static C_BOOKING_CANCEL = '/c/booking/cancel.xml'
    static C_BOOKING_COMMIT = '/c/booking/new/commit.xml'
    static C_BOOKING_DELETE = '/c/booking/delete.xml'
    static C_BOOKING_NOTE_NEW = '/c/booking/note/new.xml'
    static C_BOOKING_NEW_REDIRECT_URL = '/c/booking/new/get_redirect_url.xml'
    static C_START_NEW_BOOKING = '/c/booking/new/start.xml'
    static P_BOOKING_SEARCH = '/p/bookings/search.xml'
    static C_BOOKING_SEARCH = '/c/bookings/search.xml'
    static P_VOUCHER_SEARCH = '/p/voucher/search.xml'
    static C_VOUCHER_SEARCH = '/c/voucher/search.xml'
    static C_BOOKING_UPDATE = '/c/booking/update.xml'
    static C_BOOKING_PAYMENT_NEW = '/c/booking/payment/new.xml'
    static C_BOOKING_PAYMENT_FAIL = '/c/booking/payment/fail.xml'
    static C_BOOKING_PAYMENT_SPREEDLY_NEW = '/c/booking/payment/spreedly/new.xml'
    static C_BOOKING_PAYMENT_SPREEDLY_COMPLETE = '/c/booking/gatewaytransaction/spreedlycomplete.xml'
    static C_BOOKING_OPTIONS_CHECKAVAIL = '/c/booking/options/checkavail.xml'
    static C_BOOKING_COMPONENT_NEW = '/c/booking/component/new.xml'
    static C_BOOKING_COMPONENT_UPDATE = '/c/booking/component/update.xml'
    static C_BOOKING_COMPONENT_DELETE = '/c/booking/component/delete.xml'

    // ENQUIRIES
    static C_ENQUIRY_NEW = '/c/enquiry/new.xml'
    static C_ENQUIRY_SHOW = '/c/enquiry/show.xml'
    static C_ENQUIRIES_SEARCH = '/c/enquiries/search.xml'
    static P_ENQUIRIES_SEARCH = '/p/enquiries/search.xml'
    
    // VOUCHERS
    static C_VOUCHER_REEDEM = '/c/voucher/redeem.xml'

    // CUSTOMERS
    static C_CUSTOMER_SHOW = '/c/customer/show.xml'
    static C_CUSTOMER_UPDATE = '/c/customer/update.xml'
    static C_CUSTOMER_LOGIN_SEARCH = '/c/customers/login_search.xml'

    // MIXED
    static C_START_AGENT_LOGIN = '/c/start_agent_login.xml'
    static C_RETRIEVE_AGENT_BOOKING_KEY = '/c/retrieve_agent_booking_key.xml'
    static C_BOOKING_PAYMENT_LIST = '/c/booking/payment/list.xml'
    static C_BOOKING_PAYMENT_PAYWORKS_NEW = '/c/booking/payment/payworks/new.xml'
    static C_SUPPLIER_SHOW = '/c/supplier/show.xml'
    static C_STAFF_LIST = '/c/staff/list.xml'

    // HMAC
    static HMAC_MD5 = 'MD5'
    static HMAC_SHA1 = 'SHA1'
    static HMAC_SHA3 = 'SHA3'
    static HMAC_SHA256 = 'SHA256'
    static HMAC_SHA512 = 'SHA512'
        
    axios
    baseURL = ''
    marketplaceId = ''
    APIKey = ''
    lastResponseHeaders = []
    userAgent = 'TourCMS JS Wrapper v2.0.0'
    x2js = null

    constructor(marketplaceId, APIKey) {

        this.baseURL = 'https://api.tourcms.com'
        this.marketplaceId = marketplaceId
        this.APIKey = APIKey
        this.axios = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/xml'
            }
        })
        this.x2js = new X2JS();
    }

    setBaseURL(baseURL)
    {
        this.baseURL = baseURL
    }

    request(path, channelId, verb, postData = null) {

        channelId = channelId ?? 0
        verb = verb ?? TourCMS.HTTP_VERB_GET

        let endpoint = this.baseURL + path
        let outboundTime = this.time()
        let signature = this.generateSignature(path, channelId, verb, outboundTime)

        if (postData) {
            if (typeof postData !== 'string') {
                let s = new XMLSerializer()
                postData = s.serializeToString(postData)
            }
        }

        let config = {
            headers: {
                'Content-type': 'Content-typear: text/xml;charset="utf-8"',
                'x-tourcms-date': outboundTime,
                'Authorization': 'TourCMS ' + channelId + ':' + this.marketplaceId + ':' + signature,
            }
        }

        let response = false;
        if (TourCMS.HTTP_VERB_GET === verb.toUpperCase()) {
            response = axios.get(endpoint, config)
        } else if (TourCMS.HTTP_VERB_POST === verb.toUpperCase()) {
            response = axios.post(endpoint, postData, config)
        } else {
            throw new Error('HTTP Method not allowed')
        }

        return response;
    }

    // API methods (Housekeeping)

    listChannels() {
        return this.request(TourCMS.P_CHANNELS_LIST)
    }

    APIRateLimitStatus(channel = 0) {
        return this.request(TourCMS.APIRateLimitStatus, channel)
    }

    // Channel Methods

    channelUploadLogoGetUrl(channel) {
        return this.request(TourCMS.C_CHANNEL_LOGO_UPLOAD_GET_URL, channel)
    }

    channelUploadLogoProcess(channel, uploadInfo) {
        return this.request(TourCMS.C_CHANNEL_LOGO_UPLOAD_PROCESS, channel, TourCMS.HTTP_VERB_POST, uploadInfo);
    }

    showChannel(channel) {
        return this.request(TourCMS.C_CHANNEL_SHOW, channel)
    }

    channelPerformance(channel = 0) {
        if (channel == 0)
            return (this.request(TourCMS.P_CHANNEL_PERFORMANCE));
        else
            return (this.request(TourCMS.C_CHANNEL_PERFORMANCE, channel));
    }


    // Tours Methods

    searchTours(channel = 0, params = '') {
        params = this.validateParams(params)
        if (channel == 0) {
            return this.request(TourCMS.P_TOURS_SEARCH + params, channel)
        } else {
            return this.request(TourCMS.C_TOURS_SEARCH + params, channel)
        }
    }

    searchHotelsRange(params = '', tour = '', channel = 0) {

        params = this.validateParams(params);

        if (tour) {
            if (!params) {
                params = '?single_tour_id=';
            } else {
                params += "&single_tour_id=";
            }
            params += tour;
        }

        if (channel == 0)
            return (this.request(TourCMS.P_HOTELS_SEARCH_RANGE + params));
        else
            return (this.request(TourCMS.P_HOTELS_SEARCH_RANGE + params, channel));
    }

    searchHotelsSpecific(params = '', tour = '', channel = 0) {
        params = this.validateParams(params);

        if (tour) {
            if (!params) {
                params = '?single_tour_id=';
            } else {
                params += "&single_tour_id=";
            }
            params += tour;
        }

        if (channel == 0)
            return (this.request(TourCMS.P_HOTELS_SEARCH_AVAIL + params));
        else
            return (this.request(TourCMS.C_HOTELS_SEARCH_AVAIL + params, channel));
    }

    listProductFilters(channel = 0) {
        return (this.request(TourCMS.C_TOURS_FILTERS, channel));
    }

    updateTour(tourData, channel) {
        return (this.request(TourCMS.C_TOUR_UPDATE, channel, TourCMS.HTTP_VERB_POST, tourData));
    }

    updateTourUrl(tour, channel, tourUrl) {

        let xmlString = "<tour><tour_id>" + tour + "</tour_id><tour_url>" + tourUrl + "</tour_url></tour>";
        let postData = this.parseXML(xmlString);

        return (this.updateTour(postData, channel));
    }

    listTours(channel = 0, params = '') {
        if (channel == 0) {
            return this.request(TourCMS.P_TOURS_LIST + params, channel)
        } else {
            return this.request(TourCMS.C_TOURS_LIST + params, channel)
        }
    }

    listTourImages(channel = 0, params = '') {
        params = this.validateParams(params);
        if (channel == 0)
            return (this.request(TourCMS.P_TOUR_IMAGES_LIST + params));
        else
            return (this.request(TourCMS.C_TOUR_IMAGES_LIST + params, channel));
    }

    listTourLocations(channel = 0, params = '') {
        params = this.validateParams(params);
        if (channel == 0)
            return (this.request(TourCMS.P_TOURS_LOCATIONS + params));
        else
            return (this.request(TourCMS.C_TOURS_LOCATIONS + params, channel));

    }

    deletetour(tour, channel) {
        let endpoint = this.TOUR_DELETE + '?id=' + tour;
        return (this.request(endpoint, channel, TourCMS.HTTP_VERB_POST));
    }

    showTour(channel, tourId, params) {
        if (params) params = "&" + params
        let endpoint = TourCMS.C_TOUR_SHOW + '?id=' + tourId + params
        return this.request(endpoint, channel)
    }

    tourUploadFileGetUrl(tour, channel, fileType, fileId) {
        let endpoint = TourCMS.C_TOURS_FILES_UPLOAD_GET_URL + '?id=' + tour + '&file_type=' + fileType + '&file_id=' + fileId
        return this.request(endpoint, channel)
    }

    tourUploadFileProcess(channel, uploadInfo) {
        return this.request(TourCMS.C_TOURS_FILES_UPLOAD_PROCESS, channel, TourCMS.HTTP_VERB_POST, uploadInfo)
    }

    deletetourimage(channel, imageInfo) {
        return this.request(TourCMS.C_TOUR_IMAGES_DELETE, channel, TourCMS.HTTP_VERB_POST, imageInfo)
    }

    deleteTourDocument(channel, documentXml) {
        return this.request(TourCMS.C_TOUUR_DOCUMENT_DELETE, channel, TourCMS.HTTP_VERB_POST, documentXml)
    }

    checkTourAvailability(channel, tourId, params) {
        let fullparams = '?id=' + tourId + "&" + params
        let endpoint = TourCMS.C_TOUR_CHECKAVAIL + fullparams
        return this.request(endpoint, channel)
    }

    showTourDatesAndDeals(tour, channel, qs = '') {
        if (qs) qs = "&".qs;
        let endpoint = TourCMS.C_TOUR_DATESPRICES_SEARCH + '?id=' + tour + qs
        return this.request(endpoint, channel)
    }

    showTourDepartures(tour, channel, qs = '') {
        if (qs) qs = "&".qs;
        return this.request(TourCMS.C_TOUR_DATESPRICES_DEPARTURES_SHOW + '?id=' + tour + qs, channel)
    }

    showTourFreesale(tour, channel) {
        return this.request(TourCMS.C_TOUR_DATESPRICES_FREESALE_SHOW + '?id=' + tour, channel)
    }

    // Raw departure methods


    searchRawDepartures(tour, channel, params = '') {
        let endpoint = TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_SEARCH + '?id=' + tour + params
        return (this.request(endpoint, channel));
    }

    showDeparture(departure, tour, channel) {
        let endpoint = TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_SHOW + '?id=' + tour + '&departure_id=' + departure
        return this.request(endpoint, channel)
    }

    createDeparture(departureData, channel) {
        return this.request(TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_NEW, channel, TourCMS.HTTP_VERB_POST, departureData)
    }

    updateDeparture(departureData, channel) {
        return this.request(TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_UPDATE, channel, TourCMS.HTTP_VERB_POST, departureData)
    }

    deleteDeparture(departure, tour, channel) {
        let endpoint = TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_DELETE + '?id=' + tour + '&departure_id=' + departure
        return this.request(endpoint, channel, TourCMS.HTTP_VERB_POST)
    }

    // Promo methods

    showPromo(channel, promoCode) {
        let endpoint = TourCMS.C_PROMO_SHOW + '?promo_code=' + promoCode
        return this.request(endpoint, channel)
    }


    // Bookings methods

    getBookingRedirectUrl(urlData, channel) {
        return this.request(TourCMS.C_BOOKING_NEW_REDIRECT_URL, channel, TourCMS.HTTP_VERB_POST, urlData)
    }

    startNewBooking(bookingData, channel) {
        return this.request(TourCMS.C_START_NEW_BOOKING, channel, TourCMS.HTTP_VERB_POST, bookingData)
    }

    commitBooking(channel, bookingId) {
        let xmlString = "<booking><booking_id>" + bookingId + "</booking_id></booking>";
        let postData = this.parseXML(xmlString);
        return this.request(TourCMS.C_BOOKING_COMMIT, channel, TourCMS.HTTP_VERB_POST, postData);
    }


    // Retrieving bookings

    searchBookings(params = '', channel = 0) {
        params = this.validateParams(params);
        if (channel == 0)
            return (this.request(TourCMS.P_BOOKING_SEARCH + params));
        else
            return (this.request(TourCMS.C_BOOKING_SEARCH + params, channel));
    }

    listBookings(channel = 0, params = '') {
        let endpoint = TourCMS.C_BOOKINGS_LIST
        if (channel == 0) {
            endpoint = TourCMS.P_BOOKINGS_LIST
        }
        if (params) {
            params = this.validateParams(params)
            endpoint += params
        }
        return this.request(endpoint, channel)

    }

    showBooking(channel, bookingId, params) {
        let fullparams = '?booking_id=' + bookingId + '&' + params
        let endpoint = TourCMS.C_BOOKING_SHOW + fullparams
        return this.request(endpoint, channel)
    }

    searchVoucher(voucherData = null, channel = 0) {

        if (!voucherData) {
            voucherData = '<voucher><barcode_data></barcode_data></voucher>'
        }
        let postData = this.parseXML(voucherData)

        if (channel == 0) {
            return (this.request(TourCMS.P_VOUCHER_SEARCH, channel, TourCMS.HTTP_VERB_POST, postData));
        } else {
            return (this.request(TourCMS.C_VOUCHER_SEARCH, channel, TourCMS.HTTP_VERB_POST, postData));
        }
    }

    // Updating bookings

    updateBooking(bookingData, channel) {
        return (this.request(TourCMS.C_BOOKING_UPDATE, channel, TourCMS.HTTP_VERB_POST, bookingData));
    }

    createPayment(paymentData, channel) {
        return (this.request(TourCMS.C_BOOKING_PAYMENT_NEW, channel, TourCMS.HTTP_VERB_POST, paymentData));
    }

    logFailedPayment(paymentData, channel) {
        return (this.request(TourCMS.C_BOOKING_PAYMENT_FAIL, channel, TourCMS.HTTP_VERB_POST, paymentData));
    }

    spreedlyCreatePayment(paymentData, channel) {
        return (this.request(TourCMS.C_BOOKING_PAYMENT_SPREEDLY_NEW, channel, TourCMS.HTTP_VERB_POST, paymentData));
    }

    spreedlyCompletePayment(transactionId, channel) {
        let endpoint = TourCMS.C_BOOKING_PAYMENT_SPREEDLY_COMPLETE + '?id=' + transactionId
        return (this.request(endpoint, channel, TourCMS.HTTP_VERB_POST));
    }

    cancelBooking(bookingData, channel) {
        return this.request(TourCMS.C_BOOKING_CANCEL, channel, TourCMS.HTTP_VERB_POST, bookingData);
    }

    deleteBooking(booking, channel) {
        let endpoint = TourCMS.C_BOOKING_DELETE + '?booking_id=' + booking
        return (this.request(endpoint, channel, TourCMS.HTTP_VERB_POST));
    }

    checkOptionAvailability(booking, tourComponentId, channel) {
        let endpoint = TourCMS.C_BOOKING_OPTIONS_CHECKAVAIL + '?booking_id=' + booking + '&tour_component_id=' + tourComponentId
        return (this.request(endpoint , channel));
    }

    bookingAddComponent(componentData, channel) {
        return (this.request(TourCMS.C_BOOKING_COMPONENT_NEW, channel, TourCMS.HTTP_VERB_POST, componentData));
    }

    bookingUpdateComponent(componentData, channel) {
        return (this.request(TourCMS.C_BOOKING_COMPONENT_UPDATE, channel, TourCMS.HTTP_VERB_POST, componentData));
    }

    bookingRemoveComponent(componentData, channel) {
        return (this.request(TourCMS.C_BOOKING_COMPONENT_DELETE, channel, TourCMS.HTTP_VERB_POST, componentData));
    }

    addNoteToBooking(booking, channel, text, type) {
        let xmlString = "<booking><booking_id>"+booking+"</booking_id><note><text>"+text+"</text><type>"+type+"</type></note></booking>";
        let postData = this.parseXML(xmlString);
        return (this.request(TourCMS.C_BOOKING_NOTE_NEW, channel, TourCMS.HTTP_VERB_POST, postData));
    }

    sendBookingEmail(channel, postData) {
        return this.request(TourCMS.C_BOOKING_SEND_EMAIL, channel, TourCMS.HTTP_VERB_POST, postData)
    }

    redeemVoucher(voucherData, channel = 0) {
        return (this.request(TourCMS.C_VOUCHER_REEDEM, channel, TourCMS.HTTP_VERB_POST, voucherData));
    }

    // Enquiry and customer methods

    createEnquiry(enquiryData, channel) {
        return (this.request(TourCMS.C_ENQUIRY_NEW, channel, TourCMS.HTTP_VERB_POST, enquiryData));
    }

    updateCustomer(customerData, channel) {
        return (this.request(TourCMS.C_CUSTOMER_UPDATE, channel, TourCMS.HTTP_VERB_POST, customerData));
    }

    searchEnquiries(params = '', channel = 0) {
        params = this.validateParams(params);
        if (channel == 0)
            return (this.request(TourCMS.P_ENQUIRIES_SEARCH + params));
        else
            return (this.request(TourCMS.C_ENQUIRIES_SEARCH + params, channel));
    }

    showEnquiry(enquiry, channel) {
        return (this.request(TourCMS.C_ENQUIRY_SHOW + '?enquiry_id=' + enquiry, channel));
    }

    showCustomer(customer, channel) {
        let endpoint = TourCMS.C_CUSTOMER_SHOW + '?customer_id=' + customer;
        return (this.request(endpoint, channel));
    }

    checkCustomerLogin(customer, password, channel) {
        let endpoint = TourCMS.C_CUSTOMER_LOGIN_SEARCH + '?customer_username=' + customer + '&customer_password=' + password;
        return (this.request(endpoint, channel));
    }

    // Agents methods 
    searchAgents(channel) {
        if (channel == 0) {
            return this.request(TourCMS.P_AGENTS_SEARCH, channel)
        } else {
            return this.request(TourCMS.C_AGENTS_SEARCH, channel)
        }
    }

    startNewAgentLogin(params, channel) {
        params = this.validateParams(params)
        let endpoint = TourCMS.C_START_AGENT_LOGIN + params
        return (this.request(endpoint, channel, TourCMS.HTTP_VERB_POST));
    }

    retrieveAgentBookingKey(privateToken, channel) {
        let endpoint = TourCMS.C_RETRIEVE_AGENT_BOOKING_KEY + '?k=' + privateToken;
        return (this.request(endpoint, channel));
    }

    updateAgent(update_data, channel) {
        return (this.request(TourCMS.C_AGENTS_UPDATE, channel, TourCMS.HTTP_VERB_POST, update_data));
    }

    // Payments
    listPayments(params, channel) {
        params = this.validateParams(params);
        let endpoint = TourCMS.C_BOOKING_PAYMENT_LIST + params
        return (this.request(endpoint, channel));
    }

    payworksBookingPaymentNew(payment, channel) {
        return (this.request(TourCMS.C_BOOKING_PAYMENT_PAYWORKS_NEW, channel, TourCMS.HTTP_VERB_POST, payment));
    }

    // Staff members
    listStaffMembers(channel) {
        return (this.request(TourCMS.C_STAFF_LIST, channel));
    }

    // Internal supplier methods
    showSupplier(supplier, channel) {
        let endpoint = TourCMS.C_SUPPLIER_SHOW + '?supplier_id=' + supplier;
        return (this.request(endpoint, channel));
    }

    // CRUD Pickup points
    listPickups(params, channel) {
        params = this.validateParams(params);
        let endpoint = TourCMS.C_PICKUPS_LIST + params
        return (this.request(endpoint, channel));
    }

    createPickup(pickupData, channel) {
        return (this.request(TourCMS.C_PICKUPS_NEW, channel, TourCMS.HTTP_VERB_POST, pickupData));
    }

    updatePickup(pickupData, channel) {
        return (this.request(TourCMS.C_PICKUPS_UPDATE, channel, TourCMS.HTTP_VERB_POST, pickupData));
    }

    deletePickup(pickupData, channel) {
        return (this.request(TourCMS.C_PICKUPS_DELETE, channel, TourCMS.HTTP_VERB_POST, pickupData));
    }

    showToursPickupRoutes(tour, channel) {
        let endpoint = TourCMS.TOUR_PICKUP_ROUTES_SHOW + '?id=' + tour
        return this.request(endpoint, channel);
    }

    updateToursPickupRoutes(data, channel) {
        return this.request(TourCMS.TOUR_PICKUP_ROUTES_UPDATE, channel, TourCMS.HTTP_VERB_POST, data);
    }

    toursPickupRoutesAddPickup(data, channel) {
        return this.request(TourCMS.TOUR_PICKUP_ROUTES_ADD_PICKUP, channel, TourCMS.HTTP_VERB_POST, data);
    }

    toursPickupRoutesUpdatePickup(data, channel) {
        return this.request(TourCMS.TOUR_PICKUP_ROUTES_UPDATE_PICKUP, channel, TourCMS.HTTP_VERB_POST, data);
    }

    toursPickupRoutesDeletePickup(data, channel) {
        return this.request(TourCMS.TOUR_PICKUP_ROUTES_DELETE_PICKUP, channel, TourCMS.HTTP_VERB_POST, data);
    }

    // Account methods
    createAccount(uploadInfo) {
        return (this.request(TourCMS.P_ACCOUNT_CREATE, 0, TourCMS.HTTP_VERB_POST, uploadInfo));
    }

    updateAccount(uploadInfo, channel) {
        return (this.request(TourCMS.P_ACCOUNT_UPDATE, channel, TourCMS.HTTP_VERB_POST, uploadInfo));
    }

    showAccount(accountId) {
        let endpoint = TourCMS.P_ACCOUNT_SHOW + '?account_id=' + accountId;
        return this.request(endpoint, 0);
    }

    createChannel(channelInfo, channel) {
        return (this.request(TourCMS.P_CHANNEL_CREATE, channel, TourCMS.HTTP_VERB_POST, channelInfo));
    }

    updateChannel(channelInfo, channel) {
        return (this.request(TourCMS.P_CHANNEL_UPDATE, channel, TourCMS.HTTP_VERB_POST, channelInfo));
    }

    showMarkupScheme(channel) {
        return (this.request(TourCMS.C_MARKUPS_SHOW, channel, TourCMS.HTTP_VERB_GET));
    }

    createTourGeopoint(geopoint, channel) {
        return this.request(TourCMS.TOUR_GEOS_CREATE, channel, TourCMS.HTTP_VERB_POST, geopoint);
    }

    updateTourGeopoint(geopoint, channel) {
        return this.request(TourCMS.TOUR_GEOS_UPDATE, channel, TourCMS.HTTP_VERB_POST, geopoint);
    }

    deleteTourGeopoint(geopoint, channel) {
        return this.request(TourCMS.TOUR_GEOS_DELETE, channel, TourCMS.HTTP_VERB_POST, geopoint);
    }

    getCustomFields(channel) {
        return this.request(TourCMS.ACCOUNT_CUSTOM_FIELDS_GET, channel, TourCMS.HTTP_VERB_GET);
    }

    getTourFacets(channel) {
        return this.request(TourCMS.TOURS_IMPORTER_FACETS_GET, channel, TourCMS.HTTP_VERB_GET);
    }

    getListTours(channel, params) {
        params = this.validateParams(params);
        let endpoint = TourCMS.TOURS_LIST_GET + params
        return this.request(endpoint, channel, TourCMS.HTTP_VERB_GET);
    }

    getImportToursStatus(channel, codes) {
        return this.request(TourCMS.TOURS_IMPORTER_IMPORT_STATUS, channel, TourCMS.HTTP_VERB_POST, codes);
    }

    listTourBookingRestrictions(channel, params) {
        params = this.validateParams(params);
        let endpoint = TourCMS.TOUR_BOOKINGS_RESTRICTIONS_LIST + params
        return this.request(endpoint, channel, TourCMS.HTTP_VERB_GET);
    }

    showTourPickupRoutes(channel, tourId) {
        let endpoint = TourCMS.TOUR_PICKUP_ROUTES_SHOW + '?id=' + tourId
        return this.request(endpoint, channel)
    }

    // Auxiliary method

    generateSignature(path, channelId, verb, outboundTime) {

        let stringToSign = channelId + '/' + this.marketplaceId + '/' + verb + '/' + outboundTime + path
        let signature = rawurlencode(Base64.stringify(HmacSHA256(stringToSign, this.APIKey)));

        return signature
    }

    validateParams(params) {
        if (!params || typeof (params) !== 'string') {
            return '';
        }

        if (params && params.substring(0, 1) !== '?') {
            params = '?' + params;
        }

        return params;
    }

    time() {
        return Math.floor(new Date().getTime() / 1000)
    }

    parseXML(text) {
        let xmlDoc = ''
        if (window.DOMParser) {
            let parser = new DOMParser()
            xmlDoc = parser.parseFromString(text, 'text/xml')
        } else {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
            xmlDoc.async = 'false'
            xmlDoc.loadXML(text)
        }
        return xmlDoc
    }

    XMLToJson(xml)
    {
        return this.x2js.xml2js(xml);
    }

    JSONToXML(json)
    {
        return this.x2js.js2xml(json);
    }

    XMLStringToJson(XMLString)
    {
        let xml = this.parseXML(XMLString)
        return this.XMLToJson(xml)
    }

    setLastResponseHeaders(headers) {
        let arr = headers.trim().split(/[\r\n]+/)
        this.lastResponseHeaders = arr
    }

    getLastResponseHeaders() {
        return this.lastResponseHeaders
    }

    // Used for validating webhook signatures
    validateXMLHash(xml) {

        return this.generateXMLHash(xml) == xml.signed.hash;

    }

    generateXMLHash(xml) {

        let algorithm = xml.signed.algorithm;

        let fields = xml.signed.hash_fields.split(" ");

        let values = [];

        for (let field of fields) {

            let xpathResult = xml.xpath(field);

            for (let result of xpathResult) {
                values.push(result[0].toString())
            }
        }

        let stringToHash = values.join("|");

        let hash = this.getHash(algorithm, stringToHash);

        return hash;

    }

    getHash(algorithm, stringToHash, key=null) {

        let hash = "";
        key = key ?? this.APIKey;

        switch (algorithm) {
            case TourCMS.HMAC_MD5:
                hash = HmacMD5(stringToHash, key)
                break;
            case TourCMS.HMAC_SHA1:
                hash = HmacSHA1(stringToHash, key)
                break;
            case TourCMS.HMAC_SHA3:
                hash = HmacSHA3(stringToHash, key)
                break;
            case TourCMS.HMAC_SHA256:
                hash = HmacSHA256(stringToHash, key)
                break;
            case TourCMS.HMAC_SHA512:
                hash = HmacSHA512(stringToHash, key)
                break;
            default:
                hash = HmacSHA256(stringToHash, key)
                break;
        }

        return hash;
    }
}