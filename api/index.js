const express = require('express');
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs-extra');
const cors = require('cors');
const xlsx = require("xlsx");
const bcrypt = require('bcrypt');
const axios = require("axios");
const path = require('path');
const { spawn } = require("child_process");

//create express server
const app = express();
const PORT = 4000;
const FILE_internships = "./internships.xlsx";
const FILE_students = "./students.xlsx";
const FILE_teachers = "./teachers.xlsx";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwM6fg8f-PS5beEAIbguWPB1uRHBOxHgnHfFwNoHzbbWTTI5s8MoMrbS6qyW634iaLSxg/exec";


// Save files in 'uploads' directory
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 512000 } // 500 kB
});
app.use(cors({
    origin: 'http://127.0.0.1:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));


// this api call comes before express.json(), as we should use multer for this one
//google sheets :=> ADD NEW INSTERNSHIP (STUDENT)
app.post("/fetch-sheet-new-internship", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const formDetails = JSON.parse(req.body.data);
        let last4Digits = formDetails["Register Number"].toString().slice(-4);
        let tempName = formDetails["Name"].toLowerCase();

        // Ensure the folder exists
        const studentFolder = path.join(__dirname, "uploads", last4Digits);
        if (!fs.existsSync(studentFolder)) {
            fs.mkdirSync(studentFolder, { recursive: true });
        }

        // Rename file as 'xxxx-Permission Letter'
        const newFileName = `${last4Digits}-Permission-Letter.pdf`;
        const newFilePath = path.join(studentFolder, newFileName);

        // Move the uploaded file to the new location
        fs.renameSync(file.path, newFilePath);
        console.log(`File saved as: ${newFilePath}`);

        // Call the Python script to extract text from PDF
        const pythonProcess = spawn("python", [path.join(__dirname, "pdf_operations.py"), newFilePath]);

        let extractedText = "";
        let pythonError = "";

        pythonProcess.stdout.on("data", (data) => {
            extractedText += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            pythonError += data.toString();
        });

        pythonProcess.on("close", async (code) => {
            if (code !== 0 || pythonError) {
                console.error(`Python Error: ${pythonError}`);
                fs.unlinkSync(newFilePath); // Delete the file if the script fails
                return res.status(500).json({ message: "Python script failed", details: pythonError });
            }

            extractedText = extractedText.trim().toLowerCase();

            // Validate if the extracted text contains the student's name
            if (!extractedText.includes(tempName)) {
                fs.unlinkSync(newFilePath);
                return res.status(500).json({ message: "Certification Validation failed" });
            }

            try {
                // Google Apps Script API call
                const response = await axios.post(GOOGLE_SCRIPT_URL, formDetails, {
                    headers: { "Content-Type": "application/json" }
                });

                if (response.status === 200 && response.data) {
                    return res.status(200).json({
                        message: "Data added successfully!",
                        data: formDetails,
                        googleResponse: response.data
                    });
                } else {
                    fs.unlinkSync(newFilePath);
                    return res.status(500).json({
                        error: "Failed to add data to Google Sheets",
                        googleResponse: response.data
                    });
                }
            } catch (err) {
                fs.unlinkSync(newFilePath);
                return res.status(500).json({ message: "Google Sheets API call failed", details: err.message });
            }
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});



//declare middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));



// Function to read Excel data
const readExcel = (FILE_PATH) => {
    if (!fs.existsSync(FILE_PATH)) {
        return [];
    }
    const workbook = xlsx.readFile(FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
};

// Function to write data to Excel
const writeExcel = (data, FILE_PATH) => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, FILE_PATH);
};




//api call to get all student internship details
app.get('/all-internships', (req, res)=>{
    try{
        const data = readExcel(FILE_internships);
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
});

//api call to add a new record to excel file
app.post('/new-internship',  (req, res)=>{
    try{
        const formDetails = req.body;
        formDetails.register_number ="'"+formDetails.register_number;
        const data = readExcel(FILE_internships);
        data.push(formDetails);
        writeExcel(data,FILE_internships);
        res.status(200).json({message: "Data added sucessfully!", data: formDetails});
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
});

//api call to get internship for a student
app.get('/student-internships', (req, res)=>{
    try{
        const regno = "'"+req.query.regno;
        // console.log(regno);
        const data = readExcel(FILE_internships);
        // console.log(data);
        let result = data.filter((obj)=> obj?.register_number===regno);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
});




//api call to get all students
app.get('/all-students', (req, res)=>{
    try{
        const data = readExcel(FILE_students);
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
});

//api call to register a new student
app.post('/register-student', async(req, res)=>{
    try{
        const studentDetails = req.body;

        const data = readExcel(FILE_students);
        // console.log(data);
        for (let student of data){
            if (student.register_number === ("'"+studentDetails.register_number) || student.username === studentDetails.username){
                return res.status(400).json({ err: 'Account already exists...' });
            }
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(studentDetails.password, saltRounds);
        const obj = {
            ...studentDetails,
            password: hashedPassword,
            register_number: "'" + studentDetails.register_number
        };
        
        data.push(obj);
        writeExcel(data, FILE_students);
        res.status(200).json({message: "Student registered Successfully!"});
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
});

//api call to login and verify usrnme & pwd
app.post('/login', async(req,res)=>{
    try{
        const obj = req.body;
        if (obj.option==='teacher'){
            if (obj.username==='admin@ssn.edu.in' && obj.password==='ssn') return res.status(200).json({message: 'Signed Into Admin!'});
            else return res.status(400).json({err: 'Invalid credentials'});
        }
        const data = readExcel(FILE_students);
        const student = data.find(s => s.username === obj.username);
        if (!student) return res.status(400).json({err: 'Invalid credentials'});

        const match = await bcrypt.compare(obj.password, student.password);
        if (!match) return res.status(400).json({ err: 'Invalid credentials' });
        res.status(200).json(student);
    }
    catch(err){
        res.status(500).json({err: err.message})
    }
});





//fetch google sheets data:=> ALL STUDENTS
app.get("/fetch-sheet-students", async (req, res) => {
    try {
      // Make a GET request to the Google Apps Script web app
      const response = await axios.get(GOOGLE_SCRIPT_URL);
      
      // Send the retrieved data as a JSON response
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
      res.status(500).json({ success: false, error: error.message });
    }
});



//fetch google sheets data:=> SPECIFIC STUDENTS
app.get("/fetch-sheet-student", async (req, res) => {
    try {
        const regno = req.query.regno.replace(/['"]/g, "").trim();
        if (!regno) {
            return res.status(400).json({ error: "Register number is required." });
        }

        // Make a GET request to the Google Apps Script web app
        const response = await axios.get(GOOGLE_SCRIPT_URL);

        // Validate if response data is an array before filtering
        if (!Array.isArray(response.data)) {
            return res.status(500).json({ error: "Unexpected response format from Google Sheets API." });
        }

        const result = response.data.filter((obj) => String(obj["Register Number"]).trim() === String(regno).trim());

        if (result.length === 0) {
            return res.status(404).json({ message: "No student found with the given Register Number." });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching student data:", err.message);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});





app.listen(PORT, ()=>{
    console.log(`Nodejs app listening on port ${PORT}`);
});