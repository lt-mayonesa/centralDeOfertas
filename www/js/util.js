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
    SEND_MESSAGE: 'messages-postmessage',
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
    sendMessage: function (name, message, email, format) {
        var f = format || 'json';
        var e = email == null ? '' : '&mail=' + email;
        return WS.BASE_URL + WS.format[f] + WS.SEND_MESSAGE + '&name=' + name + '&message=' + message + e;
    }

};

var CATEGORIES;
var CHAINS;
var BRANDS;
var PRODUCTS;
var FAVORITES = [];
//PRODUCTS = [{"id": "1", "title": "Aceite del bueno", "type": "[Sin Tipo]", "value": "6.299"},{"id": "2", "title": "Aceite del malo", "type": "[Sin Tipo]", "value": "6.299"},{"id": "3", "title": "Marolio algo", "type": "[Sin Tipo]", "value": "7.299"},{"id": "4", "title": "HUevos de la huerta", "type": "[Sin Tipo]", "value": "100.099"}];
CATEGORIES = [{"id": "2", "name": "Congelados"}, {"id": "3", "name": "Almacen"}, {"id": "4", "name": "Automotor"}, {"id": "5", "name": "Bazar"}, {"id": "6", "name": "Bebidas Con Alcohol"}, {"id": "7", "name": "Bebidas Sin Alcohol"}, {"id": "8", "name": "Blanco Y Manteler\u00eda"}, {"id": "9", "name": "Calzado Y Marroquiner\u00eda"}, {"id": "10", "name": "Carnicer\u00eda"}, {"id": "11", "name": "Electrodom\u00e9sticos"}, {"id": "12", "name": "Ferreter\u00eda"}, {"id": "13", "name": "Fiambrer\u00eda"}, {"id": "14", "name": "Frutas Y Verduras"}, {"id": "15", "name": "Iluminaci\u00f3n"}, {"id": "16", "name": "Jardiner\u00eda"}, {"id": "17", "name": "Jugueter\u00eda"}, {"id": "18", "name": "Lacteos"}, {"id": "19", "name": "Librer\u00eda"}, {"id": "20", "name": "Limpieza"}, {"id": "21", "name": "Mascotas"}, {"id": "22", "name": "Panader\u00eda"}, {"id": "23", "name": "Perfumer\u00eda"}, {"id": "24", "name": "Pilas Y Accesorios"}, {"id": "25", "name": "Pescados Y Mariscos"}, {"id": "26", "name": "Golosinas"}];
CHAINS = [{"id": "1", "name": "[Sin Cadena]"}, {"id": "2", "name": "Diarco"}, {"id": "3", "name": "Gallemar"}, {"id": "4", "name": "Hipermercado Ruta 25"}, {"id": "5", "name": "Lucio Di Santo"}, {"id": "6", "name": "Masivos"}, {"id": "7", "name": "Maxiconsumo"}, {"id": "8", "name": "Maycar"}, {"id": "9", "name": "Oncativo Comestibles"}, {"id": "10", "name": "Ricardo Nini"}, {"id": "11", "name": "Yaguar"}, {"id": "12", "name": "Tadicor"}, {"id": "13", "name": "Makro"}];
BRANDS = [{"id": "1", "name": "[Sin Marca]"}, {"id": "2", "name": "Guaymallen"}, {"id": "3", "name": "Jorgelin"}, {"id": "4", "name": "Jorgito"}, {"id": "5", "name": "Santa Maria"}, {"id": "6", "name": "Aguila"}, {"id": "7", "name": "Arcor"}, {"id": "8", "name": "Bon O Bon"}, {"id": "9", "name": "Butter Toffees"}, {"id": "10", "name": "Cabsha"}, {"id": "11", "name": "Cofler"}, {"id": "12", "name": "Hamlet"}, {"id": "13", "name": "Tatin"}, {"id": "14", "name": "Tofi"}, {"id": "15", "name": "Sugus"}, {"id": "16", "name": "Rocklets"}, {"id": "17", "name": "Cubanito"}, {"id": "18", "name": "Tortuguita"}, {"id": "19", "name": "Go!"}, {"id": "20", "name": "Bagley"}, {"id": "21", "name": "Opera"}, {"id": "22", "name": "Ser"}, {"id": "23", "name": "Bimbo"}, {"id": "24", "name": "Aires De Lujan"}, {"id": "25", "name": "Nevares"}, {"id": "26", "name": "Pic Nic"}, {"id": "27", "name": "Rapsodia"}, {"id": "28", "name": "Carrefour"}, {"id": "29", "name": "Arrocitas"}, {"id": "30", "name": "Lindt"}, {"id": "31", "name": "Bariloche"}, {"id": "32", "name": "Chocolates Hungaros"}, {"id": "33", "name": "Nutrasweet"}, {"id": "34", "name": "Lacasa"}, {"id": "35", "name": "Bonafide"}, {"id": "36", "name": "Costa"}, {"id": "37", "name": "Donuts"}, {"id": "38", "name": "Nugaton"}, {"id": "39", "name": "Vizzio"}, {"id": "40", "name": "Bull Dog"}, {"id": "41", "name": "Del Turista"}, {"id": "42", "name": "Fantoche"}, {"id": "43", "name": "Vea"}, {"id": "44", "name": "El Cachafaz"}, {"id": "45", "name": "Chcocfaz"}, {"id": "46", "name": "Kinder"}, {"id": "47", "name": "Tic Tac"}, {"id": "48", "name": "Ferrero Rocher"}, {"id": "49", "name": "Daqui"}, {"id": "50", "name": "Georgalos"}, {"id": "51", "name": "Tokke"}, {"id": "52", "name": "Nucrem"}, {"id": "53", "name": "Flynn Paff"}, {"id": "54", "name": "Havanna"}, {"id": "55", "name": "Vauquita"}, {"id": "56", "name": "Milky Way"}, {"id": "57", "name": "Snickers"}, {"id": "58", "name": "M Y M"}, {"id": "59", "name": "Chocoarroz"}, {"id": "60", "name": "Gallo"}, {"id": "61", "name": "Game"}, {"id": "62", "name": "After Eight"}, {"id": "63", "name": "Baci"}, {"id": "64", "name": "Garoto"}, {"id": "65", "name": "Nestle"}, {"id": "66", "name": "Wonka"}, {"id": "67", "name": "Baci Perugina"}, {"id": "68", "name": "Bananita Dolca"}, {"id": "69", "name": "Nesquik"}, {"id": "70", "name": "Otras Marcas"}, {"id": "71", "name": "Biznikke"}, {"id": "72", "name": "Paulista"}, {"id": "73", "name": "La Anonima"}, {"id": "74", "name": "Hershey S"}, {"id": "75", "name": "Coeur De Suisse"}, {"id": "76", "name": "Villars"}, {"id": "77", "name": "Great Value"}, {"id": "78", "name": "Cannettine"}, {"id": "79", "name": "Chammas"}, {"id": "80", "name": "Campo Del Lago"}, {"id": "81", "name": "Mentos"}, {"id": "82", "name": "Fun"}, {"id": "83", "name": "Delaviuda"}, {"id": "84", "name": "Sapito"}, {"id": "85", "name": "Grandote"}, {"id": "86", "name": "La Recoleta"}, {"id": "87", "name": "Crelech"}, {"id": "88", "name": "La Caba\u00f1a"}, {"id": "89", "name": "Trimak"}, {"id": "90", "name": "Lulemuu"}, {"id": "91", "name": "Mapsa"}, {"id": "92", "name": "Cadbury"}, {"id": "93", "name": "Mantecol"}, {"id": "94", "name": "Milka"}, {"id": "95", "name": "Oreo"}, {"id": "96", "name": "Pepitos"}, {"id": "97", "name": "Rhodesia"}, {"id": "98", "name": "Shot"}, {"id": "99", "name": "Suchard"}, {"id": "100", "name": "Terrabusi"}, {"id": "101", "name": "Tita"}, {"id": "102", "name": "Toblerone"}, {"id": "103", "name": "Cafe Martinez"}, {"id": "104", "name": "My Urban"}, {"id": "105", "name": "Oblita"}, {"id": "106", "name": "Ritter Sport"}, {"id": "107", "name": "Ritter"}, {"id": "108", "name": "Dos Hermanos"}, {"id": "109", "name": "Kapac"}, {"id": "110", "name": "Caserita"}, {"id": "111", "name": "Godet"}, {"id": "112", "name": "Mogul"}, {"id": "113", "name": "Noel"}, {"id": "114", "name": "Godet Delicias"}, {"id": "115", "name": "Jumbo"}, {"id": "116", "name": "Ciudad Del Lago"}, {"id": "117", "name": "Coto"}, {"id": "118", "name": "Diet Kontrol"}, {"id": "119", "name": "Dr Cormillot"}, {"id": "120", "name": "Emeth"}, {"id": "121", "name": "Jade"}, {"id": "122", "name": "Leader Price"}, {"id": "123", "name": "Exquisita"}, {"id": "124", "name": "Ravana"}, {"id": "125", "name": "Barbara"}, {"id": "126", "name": "Keksy"}, {"id": "127", "name": "Dulri"}, {"id": "128", "name": "Indias"}, {"id": "129", "name": "Trini"}, {"id": "130", "name": "Frams"}, {"id": "131", "name": "Royal"}, {"id": "132", "name": "Malvi"}, {"id": "133", "name": "Azucaradas"}, {"id": "134", "name": "Chocochips"}, {"id": "135", "name": "Diversion"}, {"id": "136", "name": "Formis"}, {"id": "137", "name": "Hogare\u00f1as"}, {"id": "138", "name": "Lia"}, {"id": "139", "name": "Macucas"}, {"id": "140", "name": "Mana"}, {"id": "141", "name": "Media Tarde"}, {"id": "142", "name": "Polvoritas"}, {"id": "143", "name": "Recetas De La Abuela"}, {"id": "144", "name": "Serranitas"}, {"id": "145", "name": "Tortitas"}, {"id": "146", "name": "Vocacion"}, {"id": "147", "name": "Cereal Mix"}, {"id": "148", "name": "Amor"}, {"id": "149", "name": "Chocolinas"}, {"id": "150", "name": "Coquitas"}, {"id": "151", "name": "Criollitas"}, {"id": "152", "name": "Melitas"}, {"id": "153", "name": "Mellizas"}, {"id": "154", "name": "Merengadas"}, {"id": "155", "name": "Porte\u00f1itas"}, {"id": "156", "name": "Rumba"}, {"id": "157", "name": "Sonrisas"}, {"id": "158", "name": "Tentaciones"}, {"id": "159", "name": "Traviata"}, {"id": "160", "name": "Ns"}, {"id": "161", "name": "Valente"}, {"id": "162", "name": "Copani"}, {"id": "163", "name": "Aritos"}, {"id": "164", "name": "Portal De Cuyo"}, {"id": "165", "name": "Portal Del Sol"}, {"id": "166", "name": "Fargo"}, {"id": "167", "name": "Primer Precio"}, {"id": "168", "name": "Leiva"}, {"id": "169", "name": "Cindor"}, {"id": "170", "name": "Argentinitas"}, {"id": "171", "name": "Dale"}, {"id": "172", "name": "Dilexis"}, {"id": "173", "name": "Pindy"}, {"id": "174", "name": "Don Satur"}, {"id": "175", "name": "Fitz Roy"}, {"id": "176", "name": "Golci"}, {"id": "177", "name": "Gold Mundo"}, {"id": "178", "name": "Larguitas"}, {"id": "179", "name": "Frutigran"}, {"id": "180", "name": "Granix"}, {"id": "181", "name": "Hojalmar"}, {"id": "182", "name": "Fatay"}, {"id": "183", "name": "Breviss"}, {"id": "184", "name": "Pepas"}, {"id": "185", "name": "Martin"}, {"id": "186", "name": "Mauri"}, {"id": "187", "name": "Marolio"}, {"id": "188", "name": "9 De Oro"}, {"id": "189", "name": "Paseo"}, {"id": "190", "name": "Cukis"}, {"id": "191", "name": "Nutresan"}, {"id": "192", "name": "Frolis"}, {"id": "193", "name": "Bauducco"}, {"id": "194", "name": "G&M"}, {"id": "195", "name": "Milano"}, {"id": "196", "name": "Soft Baked"}, {"id": "197", "name": "Twistos"}, {"id": "198", "name": "Toddy"}, {"id": "199", "name": "Pozo"}, {"id": "200", "name": "Terepin"}, {"id": "201", "name": "Pirkitas"}, {"id": "202", "name": "Hj"}, {"id": "203", "name": "Soriano"}, {"id": "204", "name": "Femar"}, {"id": "205", "name": "Trichoc"}, {"id": "206", "name": "Trio"}, {"id": "207", "name": "Lolys"}, {"id": "208", "name": "Riera"}, {"id": "209", "name": "Caricias"}, {"id": "210", "name": "Best"}, {"id": "211", "name": "Fachitas"}, {"id": "212", "name": "Fachyfrut"}, {"id": "213", "name": "Sugar And Spice"}, {"id": "214", "name": "Gaturro"}, {"id": "215", "name": "Tia Maruca"}, {"id": "216", "name": "Don Pancho"}, {"id": "217", "name": "Veneziana"}, {"id": "218", "name": "Chikitas"}, {"id": "219", "name": "Marbe"}, {"id": "220", "name": "Quaker"}, {"id": "221", "name": "Okebon"}, {"id": "222", "name": "Ducida"}, {"id": "223", "name": "Bay Bisquit"}, {"id": "224", "name": "Dulcypas"}, {"id": "225", "name": "Delicias De La Nonna"}, {"id": "226", "name": "Surtidas"}, {"id": "227", "name": "Anillos Glaceados"}, {"id": "228", "name": "Merida"}, {"id": "229", "name": "Edra"}, {"id": "230", "name": "Firenze"}, {"id": "231", "name": "Marcolla"}, {"id": "232", "name": "Natuzen"}, {"id": "233", "name": "Egran"}, {"id": "234", "name": "Chikititas"}, {"id": "235", "name": "Tym"}, {"id": "236", "name": "La Cumbre"}, {"id": "237", "name": "Cerealitas"}, {"id": "238", "name": "Cerealitas Tosti"}, {"id": "239", "name": "Club Social"}, {"id": "240", "name": "Duquesa"}, {"id": "241", "name": "Express"}, {"id": "242", "name": "Lincoln"}, {"id": "243", "name": "Manon"}, {"id": "244", "name": "Mayco"}, {"id": "245", "name": "Melba"}, {"id": "246", "name": "Rococo"}, {"id": "247", "name": "Tang"}, {"id": "248", "name": "Variedad"}, {"id": "249", "name": "Anillos Surtidos"}, {"id": "250", "name": "Boca De Dama"}, {"id": "251", "name": "Capri"}, {"id": "252", "name": "Biscuits"}, {"id": "253", "name": "Marily"}, {"id": "254", "name": "Neosol"}, {"id": "255", "name": "Pepperidge Farm"}, {"id": "256", "name": "Smams"}, {"id": "257", "name": "Parnor"}, {"id": "258", "name": "Mini Pitusas"}, {"id": "259", "name": "Sabrosona"}, {"id": "260", "name": "Suavecitas"}, {"id": "261", "name": "Inca"}, {"id": "262", "name": "Bc"}, {"id": "263", "name": "Rinde 2"}, {"id": "264", "name": "Hickory"}, {"id": "265", "name": "Livean"}, {"id": "266", "name": "Boog"}, {"id": "267", "name": "Zuko"}, {"id": "268", "name": "Tri"}, {"id": "269", "name": "Clight"}, {"id": "270", "name": "Frisco"}, {"id": "271", "name": "Panda"}, {"id": "272", "name": "Bauza"}, {"id": "273", "name": "Cooperativa"}, {"id": "274", "name": "Blue Patna"}, {"id": "275", "name": "La Fortuna"}, {"id": "276", "name": "Vico"}, {"id": "277", "name": "308"}, {"id": "278", "name": "San Giorgio"}, {"id": "279", "name": "Tiranti"}, {"id": "280", "name": "Irpa"}, {"id": "281", "name": "Nutregal"}, {"id": "282", "name": "Bahia Blanca"}, {"id": "283", "name": "Multiple"}, {"id": "284", "name": "Del Verde"}, {"id": "285", "name": "Don Vicente"}, {"id": "286", "name": "Favorita"}, {"id": "287", "name": "Lucchetti"}, {"id": "288", "name": "Manera"}, {"id": "289", "name": "Matarazzo"}, {"id": "290", "name": "Vitina Lucchetti"}, {"id": "291", "name": "Don Italo"}, {"id": "292", "name": "Punta Mogotes"}, {"id": "293", "name": "Chicago"}, {"id": "294", "name": "Rivoli"}, {"id": "295", "name": "Ricatto"}, {"id": "296", "name": "Knorr"}, {"id": "297", "name": "Giacomo"}, {"id": "298", "name": "Querico"}, {"id": "299", "name": "La Morocha"}, {"id": "300", "name": "Canale"}, {"id": "301", "name": "Don Felipe"}, {"id": "302", "name": "Vizzolini"}, {"id": "303", "name": "Molto"}, {"id": "304", "name": "Huevolin"}, {"id": "305", "name": "La Providencia"}, {"id": "306", "name": "Pasta Piu"}, {"id": "307", "name": "Delicias"}, {"id": "308", "name": "Cristal"}, {"id": "309", "name": "Mr. Pops"}, {"id": "310", "name": "Alka"}, {"id": "311", "name": "Frutal"}, {"id": "312", "name": "Cremino"}, {"id": "313", "name": "Mentho-Plus"}, {"id": "314", "name": "Butter Cream"}, {"id": "315", "name": "Eucaliptol"}, {"id": "316", "name": "Halloween"}, {"id": "317", "name": "Misky"}, {"id": "318", "name": "The Simpsons"}, {"id": "319", "name": "Hello Kitty"}, {"id": "320", "name": "Billiken"}, {"id": "321", "name": "Drf"}, {"id": "322", "name": "Mentitas"}, {"id": "323", "name": "Flynnies"}, {"id": "324", "name": "Cebritas"}, {"id": "325", "name": "Skittles"}, {"id": "326", "name": "Starburst"}, {"id": "327", "name": "Ice Breakers"}, {"id": "328", "name": "Lipo"}, {"id": "329", "name": "Osi Osi"}, {"id": "330", "name": "Wamis"}, {"id": "331", "name": "Sensa"}, {"id": "332", "name": "Frutotal 3D"}, {"id": "333", "name": "Violeta"}, {"id": "334", "name": "Trolli"}, {"id": "335", "name": "Pez"}, {"id": "336", "name": "Angel Cat Sugar"}, {"id": "337", "name": "Fini"}, {"id": "338", "name": "Pico Dulce"}, {"id": "339", "name": "Baby Doll"}, {"id": "340", "name": "Lheritier"}, {"id": "341", "name": "Bola Loca"}, {"id": "342", "name": "Chupeton Lito"}, {"id": "343", "name": "Chupetoncito"}, {"id": "344", "name": "Mint"}, {"id": "345", "name": "Plenario"}, {"id": "346", "name": "Push Pop"}, {"id": "347", "name": "Juicy Drop"}, {"id": "348", "name": "Trembly"}, {"id": "349", "name": "Tremblito"}, {"id": "350", "name": "Tembleke"}, {"id": "351", "name": "Draculenguas"}, {"id": "352", "name": "Chupa Chups"}, {"id": "353", "name": "Frosty Pop"}, {"id": "354", "name": "Catch Pop"}, {"id": "355", "name": "Twister Pop"}, {"id": "356", "name": "Kaily"}, {"id": "357", "name": "Halls"}, {"id": "358", "name": "Palitos De La Selva"}, {"id": "359", "name": "Bubbaloo"}, {"id": "360", "name": "Lenguetazo"}, {"id": "361", "name": "Yummy"}, {"id": "362", "name": "Media Hora"}, {"id": "363", "name": "Gummy Space"}, {"id": "364", "name": "Fun Candy"}, {"id": "365", "name": "Coco Pop"}, {"id": "366", "name": "Top Line"}, {"id": "367", "name": "Neo Gum"}, {"id": "368", "name": "Wrigley S"}, {"id": "369", "name": "Beldent"}, {"id": "370", "name": "Bazooka"}, {"id": "371", "name": "Ice Cube"}, {"id": "372", "name": "Carlos"}, {"id": "373", "name": "Paty"}, {"id": "374", "name": "La Cumbrecita"}, {"id": "375", "name": "Ledesma"}, {"id": "377", "name": "M&K"}, {"id": "378", "name": "Playadito"}, {"id": "379", "name": "Lays"}, {"id": "380", "name": "Cleo"}, {"id": "381", "name": "Savora"}, {"id": "382", "name": "ALA"}];
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
            if (item[key] == value) {
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
            if (item[key] == value) {
                return i;
            }
        }
    }
    return null;
};