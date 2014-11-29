var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
    }
});

var currentActivityId = casper.cli.get('cid');
var url = casper.cli.get('url');
var entryList = [];
var dataFile = '../data.json';

casper.start(url, function () {
    fetchUrl(url);
});

casper.run(function () {
    var fs = require('fs');
    console.log('Count of founded entry: ' + entryList.length);
    fs.write(dataFile, JSON.stringify(entryList, null, 4), 'w');

    this.exit(0);
});


function fetchUrl(url) {
    casper
        .open(url)
        .then(function () {
            var entryInfo = this.evaluate(getEntry);

            var index = entryInfo['ids'].indexOf(currentActivityId);
            var list = entryInfo['list'];

            if (index !== -1) {
                list = list.slice(0, index);
                return;
            }

            entryList = entryList.concat(list);

            var nextUrl = entryInfo['url'];
            if(nextUrl) {
                console.log('fetch: '+ nextUrl);
                fetchUrl(nextUrl);
            }
        });
}

function getEntry () {
    var arr = [];
    var ids = [];

    // TODO get the publish date of the activity
    $('.recentActivityEntry').each(function () {
        var info = [];

        // activity id
        var id = $(this).attr('id');
        info.push(id);
        ids.push(id);

        // activity link
        var href = $('a:first-child', this).attr('href');
        info.push(href);

        // activity content
        var ndContent = $('.sampleHighlight', this);
        var content = $('div:first-child', ndContent).text();
        info.push(content);

        // share note
        var note = $('.sampleNote', ndContent).text();
        info.push(note);

        arr.push(info);
    });

    var ndNext = $('.seeMoreWrapper .seeMore');
    nextUrl = ndNext ? ndNext.attr('href') : '';

    return {
        list: arr,
        ids: ids,
        url: nextUrl
    } ;
}