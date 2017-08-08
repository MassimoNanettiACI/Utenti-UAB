// origine db: 
// url: https://docs.google.com/spreadsheets/d/14GPU0TBpKUP9ul1a-wIuyumi8mAU1s5Ja-_eYbtb4Cg/edit

var ss = SpreadsheetApp.openById('14GPU0TBpKUP9ul1a-wIuyumi8mAU1s5Ja-_eYbtb4Cg')
var sheetname = 'User'
var sheet = ss.getSheetByName(sheetname)
var numberHeadersRows = 2
var firstDataRow = numberHeadersRows + 1
var lastRow = sheet.getLastRow() 
var lastCol = sheet.getLastColumn()
var headers = sheet.getRange(1,1,1,lastCol).getValues()[0]
var data = sheet.getRange(firstDataRow,1,lastRow-numberHeadersRows,lastCol).getValues()
data.unshift(headers)
var objectData = ObjApp.rangeToObjectsNoCamel(data)
Logger.log(objectData)


// origine: Regione, Province, Comuni
// url: https://docs.google.com/spreadsheets/d/18vL915Vt9ucROBXG2ZznSP144KnExHtx_WIvzpfKAps/edit#gid=0

ssLoc = SpreadsheetApp.openById('18vL915Vt9ucROBXG2ZznSP144KnExHtx_WIvzpfKAps')
sheetnameLoc = 'Dati Geografici'
sheetLoc = ssLoc.getSheetByName(sheetnameLoc)







