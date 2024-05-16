
 $("#nav-toggle").on("click", () => {

    let isPressed = $("#nav-toggle").attr("aria-pressed");

    if (isPressed == "true") {

        $("#mySidebar").removeClass("sidebar-expand");
        $("#title").removeClass("title-sidebar");
        $("#main").removeClass("main-sidebar");
        $("#nav-toggle").attr("aria-pressed", "false");

    } else {

        $("#mySidebar").addClass("sidebar-expand");
        $("#title").addClass("title-sidebar");
        $("#main").addClass("main-sidebar");
        $("#nav-toggle").attr("aria-pressed", "true");

    }
 });


 $("#add-project-btn").on("click", () => {
    console.log("PROJECT TO ADD!!");

    let isPressed = $("#add-project-btn").attr("aria-pressed");

    if (isPressed == "true") {


        $("#add-project-text").removeClass("slide-right");
        $("#add-project-section").removeClass("white-in");
        $("#add-project-btn").attr("aria-pressed", "false");

        slideDownForm($("#add-project-form"));



        $("#add-project-section").removeClass("expanded-section");


        setTimeout(() => {
            $("#add-project-text").addClass("slide-left");
        },600);

        if (!$("#choose-artist-section").hasClass("expanded-section")) {

            $("#nav-title").slideUp( 500 );

            setTimeout(() => {
                $("#mySidebar").removeClass("sidebar-expand-more");
                $("#nav-title").css("display", "none");
                $("#main").removeClass("main-sidebar-expanded");
                $("#title").removeClass("title-sidebar-expanded");
            },700)
        };

        setTimeout(() => {
            $("#add-project-text").css("display", "none");
        },1000);

    } else {

        $("#main").addClass("main-sidebar-expanded");
        $("#title").addClass("title-sidebar-expanded");


        $("#add-project-text").removeClass("slide-left");
        $("#add-project-text").addClass("slide-right");
        if ($("#nav-title").is( ":hidden" ) ) {
            $("#nav-title").slideDown( 500 );
        };
        $("#add-project-btn").attr("aria-pressed", "true");
        $("#add-project-section").addClass("white-in");

        $("#mySidebar").addClass("sidebar-expand-more");
        $("#nav-title").css("display", "flex");

 
        setTimeout(() => {

            $("#add-project-text").css("display", "flex");

        },175)


        setTimeout(() => {

            slideDownForm($("#add-project-form"));
            $("#add-project-section").addClass("expanded-section");

        },600);

    };
});



$("#artist-btn").on("click", () => {
    console.log("ARTIST UPDATED!!");

    let isPressed = $("#artist-btn").attr("aria-pressed");

    if (isPressed == "true") {


        $("#artist-text").removeClass("slide-right");
        $("#choose-artist-section").removeClass("white-in");
        $("#artist-btn").attr("aria-pressed", "false");

        slideDownForm($("#artist-form"));


        $("#choose-artist-section").removeClass("expanded-section");


        setTimeout(() => {
            $("#artist-text").addClass("slide-left");

        },600);

        if (!$("#add-project-section").hasClass("expanded-section")) {

            $("#nav-title").slideUp( 500 );

            setTimeout(() => {
                $("#mySidebar").removeClass("sidebar-expand-more");
                $("#nav-title").css("display", "none");
                $("#main").removeClass("main-sidebar-expanded");
                $("#title").removeClass("title-sidebar-expanded");
            },700)

        };

        setTimeout(() => {
            $("#artist-text").css("display", "none");
        },1000);

    } else {

        $("#main").addClass("main-sidebar-expanded");
        $("#title").addClass("title-sidebar-expanded");


        $("#artist-text").removeClass("slide-left");
        $("#artist-text").addClass("slide-right");
        if ($("#nav-title").is( ":hidden" ) ) {
            $("#nav-title").slideDown( 500 );
        };  
        $("#artist-btn").attr("aria-pressed", "true");
        $("#choose-artist-section").addClass("white-in");

        $("#mySidebar").addClass("sidebar-expand-more");

        $("#nav-title").css("display", "flex");

    
        setTimeout(() => {

            $("#artist-text").css("display", "flex");

        },175)
        

        setTimeout(() => {

            slideDownForm($("#artist-form"));

            $("#choose-artist-section").addClass("expanded-section");
        
        },600);

    };
});










 function slideDownForm(form) {
    if (form.is( ":hidden" ) ) {
        form.slideDown( 500 );
      } else {
        form.slideUp( 500 );
      }
}


//  function slideDownImg(img) {
//     if (img.is( ":hidden" ) ) {
//         img.slideDown( 500 );
//       } else {
//         img.slideUp( 500 );
//       }
// }



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
    // var input1Value = $("#artist-select").val();
    let input1Value = $("input[name='Other']:checked").val();

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

    updateTaskpaneElements(storedValues);

    //initialize table
    buildArtistTabulator(storedValues);

    //load in the artist data
    getArtistTable();
    passArtistValue();


});


function updateTaskpaneElements(storedValues) {

    // $("#artist-select").empty();
    $("#status").empty();
    $("#color").empty();


    createRadios(storedValues[0].artists, "#artist-form");


    $("#status").append($("<option disabled selected hidden></option>").val("").text(""));
    createOptions(storedValues[0].statuses, "#status");


    $("#color").append($("<option disabled selected hidden></option>").val("").text(""));
    createOptions(storedValues[0].colors, "#color");



    function createRadios(arr, element) {

        let i = 0;
        for (let item of arr) {

            let option;

            if (i == 0) {
                option = `<input type="radio" id="${item.artist}" name="${item.POD}" value="${item.artist}" checked>`;
            } else {
                option = `<input type="radio" id="${item.artist}" name="${item.POD}" value="${item.artist}">`;
            };

            let label = `<label for="${item.artist}">${item.artist}</label><br>`;
            $(element).append(option);
            $(element).append(label);

            i++;
        };
    };


    function createOptions(arr, element) {
        for (let item of arr) {
            let option = `<option value="${item}">${item}</option>`;
            $(element).append(option);
        };
    };
    

};


// $("input[name='Other']").on("change", () => {
//     console.log("Artist Selection changed!!!");

// })

// $("input[type=radio][name=Other]").on("change", () => {
//     console.log("Artist Selection changed!!!");
// });

$("#artist-form").on("change", () => {

    //load in the artist data
    getArtistTable();
    passArtistValue();
       
 });

// /**
//  * On Artist Select Change, do the following
//  */
// $("#artist-select").on("change", () => {

//     //load in the artist data
//     getArtistTable();
//     passArtistValue();
   
// });


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

})




/**
 * Loads the artist table for the selected artist into the provided tabulator table element
 */
async function getArtistTable() {

    //gets value of artist select box
    // let artistName = $("#artist-select").val();
    let artistName = $("input[name='Other']:checked").val();

    $("#title").text(`${artistName}'s Queue`);


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
        values: []
    };

    for (let status of storedValues[0].statuses) {
        statuses.values.push(status);
    }

    let priorityParams = {
        min: 1,
        selectContents:true
    }

    let artistList = {
        values: []
    }

    for (let artist of storedValues[0].artists) {
        artistList.values.push(artist.artist);
    }

    let colors = {
        values: []
    }

    for (let color of storedValues[0].colors) {
        colors.values.push(color);
    }

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
            { field: "uid", title: "UID", visible: false },
            { field: "jobID", title: "Job ID", visible: false },
            { field: "client", title: "Client", editor: "input", editorParams: inputParams },
            { field: "status", title: "Status", editor: "list", editorParams: statuses },
            { field: "priority", title: "Priority", editor: "number", editorParams: priorityParams },
            { field: "color", title: "Color", editor: "list", editorParams: colors },
            { field: "date", title: "Date", editor: dateEditor },
            { field: "artist", title: "Artist", editor: "list", editorParams: artistList }
        ]
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


    });

    return table;
};