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

app.get('/getStoredValues', async (req, res) => {

    const response = JSON.parse(fs.readFileSync(`./json-tables/storedValues.json`, "utf8"));

    console.log("Grabbed the data from storedValues.json!");

    res.json(response);

})




app.post("/updateDatabase", (req, res) => {


        let data = req.body;

        let dataAsString = JSON.stringify(data.queue);

        try {
            fs.writeFileSync(`./json-tables/queue.json`, dataAsString)
            console.log("Wrote the file.")
     
            res.status(200).json({
                "message": "Database updated successfully!"
            });
        } catch (e) {
            console.log("Chicken nuggets", e);
            res.status(500).json({
                "message": e
            })
        }
    
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



