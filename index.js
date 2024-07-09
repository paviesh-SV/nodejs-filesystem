import fs from 'fs';
import { format } from 'date-fns';
import path from 'path';
import express from "express";

const PORT = 8000;

const app = express();

app.use(express.json());

//creating folder if it doesn't exist
const outputFolder = "./Output"
if(!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

// get timestamp which will create a new time stamp and upload to the output folder
app.get('/', (req, res) => {
    try {
        const date = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
        const filePath = path.join(outputFolder, `${date}.txt`);

        fs.writeFileSync(filePath, date, 'utf8');
        const data = fs.readFileSync(filePath, 'utf8');

        res.status(200).send(
            `
            <h1 style="text-align: center; color: blue; background-color: black;">
                Current TimeStamp: ${date}
            </h1>

            <h3 style="text-align: center; color: aqua">
                TimeStamp Data has been succesfully saved <mark>Current_TimeStamp</mark> folder, Change the endpoint to <mark>/getTextFiles</mark> to view the files.
            </h3>
            `
        );
    }
    catch(error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//Creating new endpoint to retrieve all text files in a folder

app.get('/getTextFiles', (req, res) => {

    fs.readdir(outputFolder, (error, files) => {
        if(error) {
            console.error(error);
            res.status(500).send('Error occured while reading the files from the directory', error);
        }
        else {
            const textFiles = files.filter((file) => path.extname(file) === '.txt');
            res.status(200).json(textFiles);
        }
    });
});

//Hoisting the server in port 8000
app.listen(PORT, () => console.log(`App is on port ${PORT}`));