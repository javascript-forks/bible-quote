var str= require('../lib/strings');

var biblesOrgHandler = {
	host: "https://%auth:X@bibles.org/v2",
	auth: "WPZkEQvpI9RaxRmMC0gXn5XNA4Xgfomnv7rjAYCc",
	stripper: 
		function (phrase) {
            try {
    			// The bibles.org API returns a CDATA encapsulated string with superscripts and spans
    			phrase = JSON.parse(phrase);
    			phrase = phrase.response.search.result.passages[0].text;   // Burrow through the object.

    			// Strip the paragraph tags
    			phrase = phrase.replace(/<\/*p.*?>/g, "");
    			// Strip the superscripts
    			phrase = phrase.replace(/<sup .*?>.*?<\/sup>/g, "");
    			// Strip the span tags
    			phrase = phrase.replace(/<\/*span.*?>/g, "");
    			// Strip out any list tags
    			phrase = phrase.replace(/<\/*ul.*?>/g, "");
    			phrase = phrase.replace(/<\/*li.*?>/g, "");
    			// Strip out any header tags.
    			phrase = phrase.replace(/<\/*h3.*?>/g, "");
            } catch (e) {
                phrase = "An error has occurred: " + e.message;
            }
	
			return phrase;
		}
};

var bibliaHandler = {
	host: 'http://api.biblia.com',
	path: '/v1/bible/content/%version.txt.js',
	options: function (version, verse) {
		return {
			"key" : '3559a4fd6f30ea12fec006e5a6c061f8',
			"passage" : verse
		};
	}, 
	stripper: function (phrase) {
		phrase = JSON.parse(phrase);
		return phrase.text;
	}
};


var netHandler = {
	host: 'http://labs.bible.org',
	path: '/api/',
	options: function (version, verse) {
		return {
			"passage" : verse,
			"formatting" : "plain",
			"type" : "text"
		};
	},
	stripper: function (phrase) {
		// Net bible has some chapter/verse entries bolded throughout the quote.
		return phrase.replace(/<b>.+?<\/b>\s/g, "");
	}
}

module.exports = {
    'asv': {
        id: 'asv',  // api.biblia.com
        title: str.L('asv.name'),
        copyright: str.L('asv.copyright'),
        description: str.L('asv.desc'),
        host: bibliaHandler.host,
        path: bibliaHandler.path,
        options: bibliaHandler.options,
        stripper: bibliaHandler.stripper
    },
    'amp': {
        id: 'amp', // bibles.org
        title: str.L('amp.name'),
        copyright: str.L('amp.copyright'),
        description: str.L('amp.desc'),
        host: biblesOrgHandler.host,
        path: '/eng-AMP/passages.js?q[]=%verse',
        host: biblesOrgHandler.host,
        stripper: biblesOrgHandler.stripper,
        auth: biblesOrgHandler.auth
    },
    'cev': {
        id: 'cev', // bibles.org
        title: str.L('cev.name'),
        copyright: str.L('cev.copyright'),
        description: str.L('cev.desc'),
        path: '/eng-CEV/passages.js?q[]=%verse',
        host: biblesOrgHandler.host,
        stripper: biblesOrgHandler.stripper,
        auth: biblesOrgHandler.auth
    },
    'darby': {
        id: 'darby', // api.biblia.com
        title: str.L('darby.name'),
        copyright: str.L('darby.copyright'),
        description: str.L('darby.desc'),
        host: bibliaHandler.host,
        path: bibliaHandler.path,
        options: bibliaHandler.options,
        stripper: bibliaHandler.stripper
    },
    'emphbbl': {
        id: 'emphbbl', // api.biblia.com
        title: str.L('emphbbl.name'),
        copyright: str.L('emphbbl.copyright'),
        description: str.L('emphbbl.desc'),
        host: bibliaHandler.host,
        path: bibliaHandler.path,
        options: bibliaHandler.options,
        stripper: bibliaHandler.stripper
    },
    'esv': {
        id: 'esv',  // bibles.org
        title: str.L('esv.name'),
        copyright: str.L('esv.copyright'),
        description: str.L('esv.desc'),
        host: biblesOrgHandler.host,
        stripper: biblesOrgHandler.stripper,
        auth: biblesOrgHandler.auth,
        path: '/eng-ESV/passages.js?q[]=%verse'
    },
    'gnt': {
        id: 'gnt',  // bibles.org
        title: str.L('gnt.name'),
        copyright: str.L('gnt.copyright'),
        description: str.L('gnt.desc'),
        host: biblesOrgHandler.host,
        stripper: biblesOrgHandler.stripper,
        auth: biblesOrgHandler.auth,
        path: '/eng-GNTD/passages.js?q[]=%verse'
    },
    'kjv': {
        id: 'kjv',  // bibles.org
        title: str.L('kjv.name'),
        copyright: str.L('kjv.copyright'),
        description: str.L('kjv.desc'),
        host: biblesOrgHandler.host,
        stripper: biblesOrgHandler.stripper,
        auth: biblesOrgHandler.auth,
        path: '/eng-KJV/passages.js?q[]=%verse'
    },
    'msg': {
		id: 'msg',	// bibles.org
		title: str.L('msg.name'),
		copyright: str.L('msg.copyright'),
		description: str.L('msg.desc'),
       	host: biblesOrgHandler.host,
        stripper: biblesOrgHandler.stripper,
        auth: biblesOrgHandler.auth,
        path: '/eng-MSG/passages.js?q[]=%verse'
    },
    'net': {
        id: 'net', // labs.bible.org
        title: str.L('net.name'),
        copyright: str.L('net.copyright'),
        description: str.L('net.desc'),
        host: netHandler.host,
        path: netHandler.path,
        options: netHandler.options,
        stripper: netHandler.stripper
    },
    'nasb': {
        id: 'nasb', // bibles.org
        title: str.L('nasb.name'),
        copyright: str.L('nasb.copyright'),
        description: str.L('nasb.desc'),
        host: biblesOrgHandler.host,
        stripper: biblesOrgHandler.stripper,
        auth: biblesOrgHandler.auth,
        path: '/eng-NASB/passages.js?q[]=%verse'
    },
    'ylt': {
        id: 'ylt',  // api.biblia.com
        title: str.L('ylt.name'),
        copyright: str.L('ylt.copyright'),
        description: str.L('ylt.desc'),
        host: bibliaHandler.host,
        path: bibliaHandler.path,
        options: bibliaHandler.options,
        stripper: bibliaHandler.stripper
    }
};