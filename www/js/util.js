/**
 * Global Objects and functions
 * 
 * @author Joaquin Campero <juacocampero@gmail.com>
 */

/**
 * Constants and Methods for connecting with aplication RESTfull service
 * @type object
 */
var WS = {
    BASE_URL: 'http://centraldeofertas.com.ar/api',
    /**
     * fetch all categories via default controller
     * @type String default-getcategories
     */
    ALL_CATEGORIES: 'default-getcategories',
    /**
     * fetch all chains via default controller
     * @type String default-getchains
     */
    ALL_CHAINS: 'default-getchains',
    /**
     * fetch all manufacturers via default controller
     * @type String default-getmanufaturers
     */
    ALL_MANUFACTURERS: 'default-getmanufacturers',
    /**
     * fetch all brands via default controller
     * @type String default-getbrands
     */
    ALL_BRANDS: 'default-getbrands',
    /**
     * fetch all sales via sales controller
     * @type String sales-getall
     */
    ALL_SALES: 'sales-getall',
    SALES_BY: 'sales-getallby',
    /* FAVORITES */
    /**
     * fetch top favorites sales
     * 
     * @type String default-gettopfavorites
     */
    TOP_FAVORITES: 'default-gettopfavorites',
    /**
     * insert favorite to table
     * 
     * @type String default-addfavorite
     */
    ADD_FAVORITE: 'default-addfavorite',
    
    /*  MESSAGES  */
    /**
     * 
     * post message
     * 
     * @type String messages-postmessage
     */
    SEND_MESSAGE: 'messages-sendemail',
    format: {
        json: '/json.api?www-command=',
        xml: '/xml.api?www-command=',
        ini: '/ini.api?www-command='
    },
    filter: {
        category: 'category_id',
        chain: 'chain_id',
        manufacturer: 'manufacturer_id',
        brand: 'brand_id'
    },
    /**
     * make a request to the server to get all items
     * 
     * @param {string} command to execute
     * @param {string} format of the response. json, xml, ini | default = json
     * @returns {data} data
     */
    getAll: function (command, format) {
        var f = format || 'json';
        return WS.BASE_URL + WS.format[f] + command;
    },
    /**
     * Fetch all sales matching the filter selected
     * 
     * @param {string} filter: category | brand | chain | manufacturer
     * @param {int} id
     * @param {string} format
     * @returns {String}
     */
    getSalesByType: function (filter, id, format) {
        var f = format || 'json';
        return WS.BASE_URL + WS.format[f] + WS.SALES_BY + '&type=' + WS.filter[filter] + '&id=' + id;
    },
    /**
     * 
     * Fetch rankign of sales liked by users
     * 
     * @param {int} top the limit of the sales ranking | default = 5
     * @param {string} format of the response. json, xml, ini | default = json
     * @returns {undefined}
     */
    getTopFavorites: function (top, format) {
        var f = format || 'json';
        var t = top == null ? '' : '&top=' + top;
        return WS.BASE_URL + WS.format[f] + WS.TOP_FAVORITES + t;
    },
    addFavorite: function (id, format) {
        if (id) {
            var f = format || 'json';
            return WS.BASE_URL + WS.format[f] + WS.ADD_FAVORITE + '&id=' + id;
        } else {
            return false;
        }
    },
    sendMessage: function (name, message, email, subs, format) {
        var f = format || 'json';
        return WS.BASE_URL + WS.format[f] + WS.SEND_MESSAGE + '&n=' + name + '&m=' + email + '&ms=' + message + '&s=' + subs;
    }

};

var PRODUCTS = [];
/**
 * Searches the array of objects specifying the key and value. if the value is a string it will return the first occurrency
 * 
 * @param {string} key the name of the property to search for
 * @param {type} value the value to search for
 * @returns {object} returns null if none found
 */
Array.prototype.findBy = function (key, value) {
    for (var k = 0; k < this.length; k++) {
        var item = this[k];
        if (typeof value === 'string') {
            if (item[key].search(value) !== -1) {
                return item;
            }
        } else if (typeof value === 'number') {
            if (parseInt(item[key]) === value) {
                return item;
            }
        }
    }
    return null;
};
/**
 * Searches the an index in an array of objects specifying the key and value. if the value is a string it will return the first occurrency
 * 
 * @param {string} key the name of the property to search for
 * @param {type} value the value to search for
 * @returns {number} the index of the object in the array | null if none found
 */
Array.prototype.findKeyBy = function (key, value) {
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (typeof value === 'string') {
            if (item[key].search(value) !== -1) {
                return i;
            }
        } else if (typeof value === 'number') {
            if (parseInt(item[key]) === value) {
                return i;
            }
        }
    }
    return null;
};