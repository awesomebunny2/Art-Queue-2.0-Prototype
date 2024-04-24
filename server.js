const express = require('express')
const PORT = 5001;
const app = express();
const fs = require("fs");
const liveReload = require("livereload");
const connectLiveReload = require("connect-livereload");

const liveReloadServer = liveReload.createServer();


liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.use(connectLiveReload());

app.use(express.json())

app.use(express.static("public"));


app.post('/getArtistJSON', async (req, res) => {

    let data = req.body;

    const response = JSON.parse(fs.readFileSync(`./json-tables/${data.artist}.json`, "utf8"));
    
    res.json(response);

});

app.get('/getAllData', async (req, res) => {

    const response = JSON.parse(fs.readFileSync(`./json-tables/queue.json`, "utf8"));
    
    res.json(response);

});

app.post('/getArtistData', async (req, res) => {

    let data = req.body;

    let response = [];

    // const response = await fetch('https://www.boredapi.com/api/activity')
    const jsonData = JSON.parse(fs.readFileSync(`./json-tables/queue.json`, "utf8"));

    console.log("Grabbed the data from queue.json!");

    for (let item of jsonData) {
        if (item.artist == data.artist) {
            response.push(item);
        };
    };

    // fetch("./public/json-tables/Matt.json")
    //     .then(res => res.json())
    //     .then(data => console.log(data))
    
    res.json(response);

});




app.post("/updateDatabase", async (req, res) => {

    let data = req.body;

    let dataAsString = JSON.stringify(data.queue);

    let response;

    fs.writeFile(`./json-tables/queue.json`, dataAsString, (err) => {
        if (err) {
            // console.log(err);
            response = err;
        } else {
            // console.log("File written successfully");
            response = "File written successfully";
        }
    })

    //? I can't get this response to not be undefined
    console.log(response);


    //? This also doesn't work
    res = response;

    
})


app.post("/doSomething", (req, res) => {
    let data = req.body;

    data.number++;

    res.json(data);

    // console.log(req);
});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});



