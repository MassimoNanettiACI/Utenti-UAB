function getScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  return url;
}

function doGet() {

  return HtmlService
      .createTemplateFromFile('Index')
      .evaluate(); 
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

// *****************  LEGGE I DATI DALLO SHEET E RESTITUISCE UN OBJECT  *************

function readData(){
// Logger.log("readData " + new Date())
//  Logger.log("Provincia " + Provincia)
var rows = sheet.getLastRow()-2
// Logger.log(rows);
var cols = sheet.getLastColumn()+1
// Logger.log(cols);
var headers = sheet.getRange(1,1,1,cols).getValues()
// Logger.log(headers)
var data = sheet.getRange(3,1,rows,cols).getValues()
// Logger.log(data)
var currentUser = Session.getActiveUser().getEmail()
// Logger.log(typeof(currentUser))
var indexEditor = '0'
// Logger.log(typeof(indexEditor))

var dataObjectsArray = [] //Object con un Array di Objects

for (var i=0; i<rows; i++){ // per ogni riga 
  
var dataObjects = {} // inizializza un object
  for (var j=0; j<cols; j++){ // per ogni colonna 
  Object.defineProperty(dataObjects, headers[0][j], { // ne definisce le proprietà usando i nomi di colonna 
    value: data[i][j], // e i valori usando i dati in tabella 
    writable: true,
    enumerable: true,
    configurable: true
    }); 
  }  

    // quando completa l'Object lo aggiunge all'array di Objects
 
      var existingDate = dataObjects['Data Last Event'] 
      dataObjects['Data Last Event'] = Utilities.formatDate(new Date(existingDate), "CET", "dd/MM/yyyy")
      dataObjectsArray.push(dataObjects)
      Logger.log(dataObjects);
 
}
  
// ---------------------------------------------
  
     // controllo ruolo utente: viewer, editor, owner  
  
var filtro = dataObjectsArray.filter (function (el) {
  return (el['Account'] == currentUser) && (el['Funzione'] == "SSI" || el['Funzione'] == "SGTA")
  })

if (filtro.length > 0) {
    var indexEditor = 1
   }

// Logger.log(indexEditor)

// ---------------------------------------------
  
var mainObject = {  // quando completa l'array di Object costruisce l'oggetto Contenitore
      user: currentUser,
      indexEditor: indexEditor,
      sendHangout: dataObjectsArray['Account'],
      table: dataObjectsArray,
    };

 // Logger.log(mainObject);
 return mainObject  // il risultato viene restituito come Object e non come JSON stringify 
}


// *****************  INPUTFORM  *************
// legge i dati dal db REGIONE, PROVINCIA e restituisci un object alla inputFormI

function getProvincie(regione){

  //var regione = 'PIEMONTE'
   Logger.log(regione)

  var rows = sheetLoc.getLastRow()-2
  var argument = sheetLoc.getRange(3,5,rows,8).getValues()
  // Logger.log(argument[1][3])
  
  var provincie = []
  
  for (var i=0; i<rows; i++){
    if (argument[i][0] == regione){ 
      Logger.log('ok' + i)
      provincie.push(argument[i][3])
     }                    
  }
  Logger.log(provincie)
  return provincie
}

// ----------------------------------------------------       
// EDITFORM - PRENDE LE PROVINCE DELLA REGIONE INDICATA
// ---------------------------------------------------- 
// legge i dati dal db REGIONE, PROVINCIA e restituisci un object alla editForm

function getProvincieFromDb(regione){

  //var regione = 'PIEMONTE'
   Logger.log(regione)

  var rows = sheetLoc.getLastRow()-2
  var argument = sheetLoc.getRange(3,5,rows,8).getValues()
  // Logger.log(argument[1][3])
  
  var provincie = []
  
  for (var i=0; i<rows; i++){
    if (argument[i][0] == regione){ 
      Logger.log('ok' + i)
      provincie.push(argument[i][3])
       } 
     }
    Logger.log(provincie)
    return provincie
  }

// ------------------------------------       
// EDITFORM - SALVATAGGIO DATI SU DB
// ------------------------------------       
// carica i dati recuperati dalla editform nel server (spreadsheet)

function salvaDati(recordDaSalvare){
    Logger.log('recordDaSalvare=')
    Logger.log(JSON.stringify(recordDaSalvare))
    var messaggio
    Logger.log(recordDaSalvare.idRecord)
    var recordTrovato = objectData.filter(function(el){
      return el['N°'] == recordDaSalvare['N°']
    })
    
    if (recordTrovato.length == 0) {
        Logger.log('N° record NOT FOUND!' + recordDaSalvare['N°'])
        messaggio = 'Si è verificato un problema in fase di salvataggio dei dati.\nIl record da salvare non è stato trovato.'

      } else {
      
        var rowNum = recordTrovato[0].rowNum + numberHeadersRows
          Logger.log('rowNum: ' + rowNum)
          var array2D = ObjApp.objectToArrayNoCamel(headers, [recordDaSalvare])
          sheet.getRange(rowNum,1,1,lastCol).setValues(array2D)
          messaggio = 'Dati correttamente salvati.'
          //   messaggio = 'editForm: FINE funzione salvataggio su tabella: fase test NO UPDATE!'
      }
    // Logger.log(messaggio)
    return messaggio
}

// ------------------------------------       
// INPUT FORM  - SALVATAGGIO DATI SU DB
// ------------------------------------       
// carica i dati recuperati dalla inputform nel server (spreadsheet)

function insertExFlusso(objExFlusso) {

// Logger.log(objExFlusso)
// Logger.log(typeof(objExFlusso))
  
var lastRowSheet = sheet.getLastRow()
// Logger.log('lastRowSheet = ' + lastRowSheet)

     if (lastRowSheet == 1){
       // se è il primo inserimento aggiunge l'offset 
       var newReferenceRowSheet = 1 + offsetReferenceRowSheet; 
     }
     else
     {
       // Logger.log(sheet.getRange(lastRowSheet,2).getValue())
        var newReferenceRowSheet = sheet.getRange(lastRowSheet,2).getValue()+1 
     }

var newRecordUser = sheet.getRange(lastRowSheet,2).getValue()+1

var lastRowSheet = sheet.getLastRow()
var lasColSheet = sheet.getLastColumn()

var indice = lastRowSheet-1
var regione = objExFlusso['Regione']
var provincia = objExFlusso['Provincia']
var postazione = objExFlusso['Postazione']
var matricola = objExFlusso['Matricola']
var nome = objExFlusso['Nome']
var cognome = objExFlusso['Cognome']
var funzione = objExFlusso['Funzione']
var referenteSSI = objExFlusso['Referente SSI']
var gsuite = objExFlusso['GSuite']
var foto = objExFlusso['Foto']
var gplus = objExFlusso['Gplus']
var community = objExFlusso['Community']
var account = objExFlusso['Account']
var telefono = objExFlusso['Telefono']
var note = objExFlusso['Note']
var editor = objExFlusso['Editor']
var lastEvent = objExFlusso['Last Event']
var dateLastEvent = objExFlusso['Data Last Event']
   												
var newRecordUser = [[indice, provincia, postazione, matricola, nome, cognome, funzione, referenteSSI, gsuite, foto, gplus, community, account, telefono, note,regione,editor,lastEvent,dateLastEvent ]]

sheet.getRange(lastRowSheet+1,1,1,newRecordUser[0].length).setValues(newRecordUser)

// Logger.log(newRecordUser)
var message = 'Utente: ' + nome + ', cognome: ' + cognome + ' inserito'
// console.log(message)
return message

}


