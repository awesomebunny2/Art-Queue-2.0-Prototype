/**
 * A custom date picker (flatpickr) that works across platforms
 * @param {Cell Component} cell the current cell component in the Tabulator table (automatically loaded)
 * @param {Function} onRendered function to call when the editor has been rendered (automatically loaded)
 * @param {Function} success function to call to pass thesuccessfully updated value to Tabulator (automatically loaded)
 * @param {Function} cancel function to call to abort the edit and return to a normal cell (automatically loaded)
 * @param {Object} editorParams params object passed into the editorParams column definition property (optional)
 * @returns Element
 */
var dateEditor = (cell, onRendered, success, cancel, editorParams) => {

    var editor = document.createElement("input");
    editor.value = cell.getValue();

    let asDate = new Date(cell.getValue());
  
    var datepicker = flatpickr(editor, {
        // altInput: true,
        enableTime: true,
        dateFormat: "m/d/y, h:i:S K",
        // altFormat: "D, F J, Y at h:i K",
        defaultDate: asDate,
        allowInput: true,
        onClose: (selectedDates, dateStr, instance) => {
            success(dateStr);
            instance.destroy();
        }
    });

  
    onRendered(() => {
      editor.focus();
    });
  
    return editor;
  };


$("#date").flatpickr({
    enableTime: true,
    dateFormat: "m/d/y, h:i:S K",
    defaultDate: new Date(),
    allowInput: true,
});


function passArtistValue() { 
    var input1Value = $("#artist-select").val();
    $("#artist-hidden").val(input1Value); 
};




/**
 * On ready, update the artist table to overwrite the placeholder data (since the artistTable module is syncronsis and defined before this function, 
 * everything should work properly)
 */
$(async() => {


    //call the getData function from the server with the packet obj as passed variable
    let storedValuesResponse = await fetch("/getStoredValues");
    let storedValues = await storedValuesResponse.json(); //await the response

    // artistTable(storedValues);

    //initialize table
    buildArtistTabulator(storedValues);

    //load in the artist data
    getArtistTable();
    passArtistValue();
    updateArtistSelect();



});


async function updateArtistSelect() {

    $("#artist-select").empty();

    //call the getData function from the server with the packet obj as passed variable
    let response = await fetch("/getStoredValues");
    let storedValues = await response.json(); //await the response
    storedValues = storedValues[0];
     


    for (let artist of storedValues.artists) {
        let element = document.createElement("option");
        element.textContent = artist;
        element.value = artist;
        $("#artist-select").append(element);
    };

    console.log("Artist select is built!")
}



/**
 * On Artist Select Change, do the following
 */
$("#artist-select").on("change", () => {

    //load in the artist data
    getArtistTable();
    passArtistValue();
   
});


$("#submit-btn").on("click", async() => {

    let artist = $("#artist-hidden").val();

    let allData = await fetch("/getAllData");
    let allTableData = await allData.json();

    // console.log(`The queue data is as follows:`);
    // console.log(allTableData);

    const UID = allTableData.map(obj => obj["uid"]);

    const maxUID = Math.max(...UID);




    //builds out the POST request object
    let packet = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "artist": artist
        })
    };

    //call the getData function from the server with the packet obj as passed variable
    let artistData = await fetch("/getArtistData", packet);
    let artistTableData = await artistData.json(); //await the response

    const jobID = artistTableData.map(obj => obj["jobID"]);

    const maxJobID = Math.max(...jobID);



    const addToData = [
        {
            uid: maxUID + 1,
            jobID: maxJobID + 1,
            client: $("#client").val(),
            progress: $("#progress").val(),
            status: $("#status").val(),
            priority: $("#priority").val(),
            color: $("#color").val(),
            bold: $("#bold").val(),
            date: $("#date").val(),
            artist: artist
        }
    ];

    let artistTable = Tabulator.findTable("#example-table")[0];

    artistTable.addData(addToData);

    $("#add-project-form").trigger("reset");

    const newTableArr = allTableData.concat(addToData);

    // console.log("allTableData after adding the new data:");
    // console.log(newTableArr);

        //builds out the POST request object
        let newQueue = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "queue": newTableArr
            })
        };
    
        //call the getData function from the server with the packet obj as passed variable
        let sendNewData = await fetch("/updateDatabase", newQueue);

        if (sendNewData.ok) {
            let responseData = await sendNewData.json();
            console.log(responseData.message)
        } else {
            let responseData = await sendNewData.json();
            console.log(sendNewData);
            alert(`The server sent back a ${sendNewData.status} error with the following message: \n${responseData.message}`);
        }
        // console.log("SEND NEW DATA:", sendNewData)
        // let newDataResponse = await sendNewData; //await the response

        // console.log(newDataResponse)
        // let serverResponse = await sendNewData.json(); //await the response
        // console.log(serverResponse);

})




/**
 * Loads the artist table for the selected artist into the provided tabulator table element
 */
async function getArtistTable() {

    //gets value of artist select box
    let artistName = $("#artist-select").val();

    //builds out the POST request object
    let packet = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "artist": artistName
        })
    };

    //call the getData function from the server with the packet obj as passed variable
    let response = await fetch("/getArtistData", packet);
    let tableData = await response.json(); //await the response


    for (let row of tableData) {
        let date = new Date(row.date);

        const options = {
            month: "2-digit", day: "2-digit", year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(date);
        // console.log(JSON.stringify(date)); //makes date into JSON date format

        row.date = formattedDate;
    };

    let artistTable = Tabulator.findTable("#example-table")[0];

    //update table data
    artistTable.setData(tableData);


};




/**
 * Builds an empty tabulator table to be used as the artist table
 * @returns Built Tabulator Table
 */
function buildArtistTabulator(storedValues) {

    let inputParams = {
        search:true,
        selectContents:true,
    };

    let statuses = {
        values: [ "Not Started", "Working", "At Client", "On Hold", "Completed", "Cancelled" ]
    };

    let priorityParams = {
        min: 1,
        selectContents:true
    }

    let boldParams = {
        tristate: false,
    };

    let artistList = {
        values: []
    }

    for (let artist of storedValues[0].artists) {
        artistList.values.push(artist);
    }

    // let dateParams = {
    //     format: "MM/dd/yy hh:mm:ss a"
    // }

    const table = new Tabulator("#example-table", {
        // autoColumns:true, //create columns from data field names
        placeholder:"I'm empty!!!",
        columns: [
            { formatter: "buttonCross", cellClick: async(_event, cell) => {
                const rowId = cell.getRow().getData().uid;
                const rowName = cell.getRow().getData().client;
                const row = cell.getRow();
            
                let doDelete;
            
                if (rowName == null) {
                    doDelete = confirm(`Are you sure you want to delete this row?`);
                } else {
                    doDelete = confirm(`Are you sure you want to delete ${rowName}'s row?`);
                };
            
                // const doDelete = confirm(`Are you sure you want to delete ${rowName ? rowName : "this"}'s row?`);
                if (doDelete) {
                    // await window.api.removeFromDatabase(rowId);
            
                    try {
            
                        const allData = await fetch("/getAllData");
                        let allTableData = await allData.json();
                
                        let result = allTableData.find(({ uid }) => uid === rowId);
            
                        allTableData = allTableData.filter( el => el.uid !== rowId );
                                                    
                        row.delete();

                        //builds out the POST request object
                        let newQueue = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                "queue": allTableData
                            })
                        };
                    
                        //call the getData function from the server with the packet obj as passed variable
                        let sendNewData = await fetch("/updateDatabase", newQueue);

                        if (sendNewData.ok) {
                            let responseData = await sendNewData.json();
                            console.log(responseData.message)
                        } else {
                            let responseData = await sendNewData.json();
                            console.log(sendNewData);
                            alert(`The server sent back a ${sendNewData.status} error with the following message: \n${responseData.message}`);
                        };


                    } catch(err) {
            
                        console.log(err);
            
                    };
              
                };
            }},
            { field: "uid", title: "UID" },
            { field: "jobID", title: "Job ID" },
            { field: "client", title: "Client", editor: "input", editorParams: inputParams },
            { field: "progress", title: "Progress", sorter: "number", formatter: "progress", hozAlign: "left", editor: false },
            { field: "status", title: "Status", editor: "list", editorParams: statuses },
            { field: "priority", title: "Priority", editor: "number", editorParams: priorityParams },
            { field: "color", title: "Color"},
            { field: "date", title: "Date", editor: dateEditor },
            { field: "bold", title: "Bold", formatter: "tickCross", editor: true, editorParams: boldParams },
            { field: "artist", title: "Artist", editor: "list", editorParams: artistList }
        ]
        // data: ([{"UID":0, "Job ID": 0, "Client":"PLACEHOLDER", "Progress":0, "Status":"", "Priority":"", "Color":"red", "Date":"", "Bold":0}])
    });

    table.on("cellEdited", async(cell) => {

        const newValue = cell.getValue();
        const rowId = cell.getData().uid;
        const header =  cell.getField();


        try {
            
            const allData = await fetch("/getAllData");
            let allTableData = await allData.json();
    
            let rowData = allTableData.find(({ uid }) => uid === rowId);

            rowData[header] = newValue;

            

            // allTableData = allTableData.filter( el => el.uid !== rowId );

            console.log(allTableData);
                            

            //builds out the POST request object
            let newQueue = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "queue": allTableData
                })
            };
        
            //call the getData function from the server with the packet obj as passed variable
            let sendNewData = await fetch("/updateDatabase", newQueue);

            if (sendNewData.ok) {
                let responseData = await sendNewData.json();
                console.log(responseData.message)
            } else {
                let responseData = await sendNewData.json();
                console.log(sendNewData);
                alert(`The server sent back a ${sendNewData.status} error with the following message: \n${responseData.message}`);
            };

            if (header == "artist") {
                getArtistTable();
            }

        } catch(err) {

            console.log(err);

        };

        // const cellData = {
        //     "rowId": rowId,
        //     "field": header,
        //     "value": newValue
        // }
        // console.table(cellData);
    });

    return table;
};