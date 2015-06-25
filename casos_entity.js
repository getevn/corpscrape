//Scrape CA Sec of State LLC/Corp Entity
//By Kristopher Dickman
//6/25/15

var casper = require('casper').create();
var entity_num = casper.cli.get(0).toString();
var utils = require('utils');
var entData = [];


casper.start('http://kepler.sos.ca.gov/', function() {
    this.click('input[name="ctl00$content_placeholder_body$BusinessSearch1$RadioButtonList_SearchType"][value="Entity Number"]');
});

casper.then(function() {
    this.sendKeys('input[name="ctl00$content_placeholder_body$BusinessSearch1$TextBox_NameSearch"]', entity_num);
    this.click('input[type="submit"][name="ctl00$content_placeholder_body$BusinessSearch1$Button_Search"]');
});

casper.then(function() {
    var str = this.fetchText('td');
    var r = new RegExp('ACTIVE' + '(.*?)' + 'CORP', 'gm');
    var results = str.match(r);
    var l = results.toString();
    var res = results.toString().substring(6, l.length-4);
    this.clickLabel(res, 'a');
});

casper.then(function() {
    var str = this.fetchText('td');
    entData.push(parseData(str));
    require('utils').dump(entData);
});

function parseData(str) {
    var bizD = [];

    var entNameReg = new RegExp('Entity Name:' + '(.*?)' + 'Entity Number:', 'gm');
    var entNumberReg = new RegExp('Entity Number:' + '(.*?)' + 'Date Filed:', 'gm');
    var dateFiledReg = new RegExp('Date Filed:' + '(.*?)' + 'Status:', 'gm');
    var statusReg = new RegExp('Status:' + '(.*?)' + 'Jurisdiction:', 'gm');
    var jurisReg = new RegExp('Jurisdiction:' + '(.*?)' + 'Entity Address:', 'gm');
    var entAddressReg = new RegExp('Entity Address:' + '(.*?)' + 'Entity City, State, Zip:', 'gm');
    var entAddress2Reg = new RegExp('Entity City, State, Zip:' + '(.*?)' + 'Agent for Service of Process:', 'gm'); 

    var entName = str.match(entNameReg).toString();
    entNameD = entName.substring(12, entName.length-14);

    var entNumber = str.match(entNumberReg).toString();
    entNumberD = entNumber.substring(14, entNumber.length-11);

    var dateFiled = str.match(dateFiledReg).toString();
    dateFiledD = dateFiled.substring(11, dateFiled.length-7);
    
    var status = str.match(statusReg).toString();
    statusD = status.substring(7, status.length-13);

    var juris = str.match(jurisReg).toString();
    jurisD = juris.substring(13, juris.length-15);

    var entAddress = str.match(entAddressReg).toString();
    entAddressD = entAddress.substring(15, entAddress.length-25);

    var entAddress2 = str.match(entAddress2Reg).toString();
    entAddress2D = entAddress2.substring(24, entAddress2.length-29);
    
    var biz = {};

    biz['entName'] = entNameD;
    biz['entNumber'] = entNumberD;
    biz['dateFiled'] = dateFiledD;
    biz['status'] = statusD;
    biz['juris'] = jurisD;
    biz['entAddress'] = entAddressD;
    biz['entAddress2'] = entAddress2D;
    
    bizD.push(biz);

    return bizD;
}

casper.run();
