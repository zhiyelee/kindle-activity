var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    clientScripts: ["jquery.min.js"]
});
var entryList = [];
casper.start('https://kindle.amazon.com/profile/zhiyelee/11533613');

casper.then(function () {
    entryList = this.evaluate(getEntry);
    this.capture('google.png', undefined, {
        quality: 75
    });
});


casper.run(function () {
    entryList.forEach(function (e) {
        save2db(e);
    })
    this.exit(0);
});

function save2db(e) {
    console.log('id ' + e[0] + '--')
    console.log('url ' + e[1])
    console.log('content ' + e[2])
    console.log('note ' + e[3])

}

function getEntry () {
    var arr = [];

    $('.recentActivityEntry').each(function () {
        var id = $(this).attr('id');
        var info = [];
        info.push(id);

        var href = $('a:first-child', this).attr('href')
        info.push(href);

        var ndContent = $('.sampleHighlight', this);
        var content = $('div:first-child', ndContent).text();
        info.push(content);
        var note = $('.sampleNote', ndContent).text();
        info.push(note);

        arr.push(info);
    })

    return arr
}
