# InternTracker-v2-OCR

## 🔗 Important Links
- **Previous Repository:** [InternTracker (v1)](https://github.com/shemzegem200/InternTracker)
- **Google Sheets Database:** [Internship Data](https://docs.google.com/spreadsheets/d/12v_z6U7k_fYUXp6EgfMWj_t9zpW56-kZYbtrCRTmaag/edit?gid=0#gid=0)

A web application for tracking internship details of students in the **Department of CSE at SSN College of Engineering**. This version improves document verification using **OCR** and enhances **Google Sheets integration**.

## 📌 Key Features

### 🆕 Improvements in this Version
- **Document Upload & OCR Verification**
  - Users can upload a **Permission Letter (PDF)** for verification.
  - The system extracts text from the PDF using `fitz` (PyMuPDF) and validates if the student’s name is present in the document.

- **Enhanced API for Internship Submission**
  - Uses `multer` to handle file uploads in the backend.
  - Dynamically creates a folder for the student using the last 4 digits of their **Register Number**.
  - Saves the uploaded file as `xxxx-Permission-Letter.pdf`.

- **Enhanced Frontend UI**
  - **File dropbox** that ensures:
    - Only **one file** can be selected.
    - The file size is **below 500KB**.
    - Only **PDF format** is allowed.
  - Added an '❌' close button for the internship form modal.
  
## 🚀 Modified API Endpoints

### **1️⃣ Upload & Validate PDF**
#### Endpoint: `/fetch-sheet-new-internship`

#### Request: `POST /fetch-sheet-new-internship`
- **Headers:** `Content-Type: multipart/form-data`
- **Body:**
  - `file`: (PDF file) The permission letter.
  - `data`: (JSON) Contains student details such as:
    ```json
    {
      "Register Number": "12345678",
      "Name": "John Doe",
      "Section": "CSE-B",
      "Obtained Internship or Not": "Yes",
      "Title": "AI Research",
      "Research\n/Industry": "Research",
      "Abroad / India": "India",
      "Mobile No.": "9876543210",
      "Period": "2 months",
      "Start Date": "2024-06-01",
      "End Date": "2024-08-01",
      "Company Name": "Google",
      "Placement thru college / outside": "College",
      "Stipend\n(In Rs.)": "Unpaid",
      "Signed Permission Letter, Offer Letter Submitted (Yes / No)": "Yes",
      "Completion Certificte Submitted (Yes/No)": "Yes",
      "Internship Report Submitted (Yes/No)": "Yes",
      "Student Feedback (About Internship) Submitted \n(Yes/No)": "Yes",
      "Employer Feedback (About student) Submitted (Yes/No)": "Yes"
    }
    ```

#### Sample Response (Success):
```json
{
  "message": "Data added successfully!",
  "data": {
    "Register Number": "12345678",
    "Name": "John Doe",
    "Company Name": "Google",
    "Start Date": "2024-06-01",
    "End Date": "2024-08-01",
    "googleResponse": "Success"
  }
}
```

#### Sample Response (Failure - Name Not Found):
```json
{
  "message": "Certification Validation failed"
}
```

## 🔧 Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** Google Sheets (via Google Apps Script API)
- **OCR Processing:** PyMuPDF (`fitz` library)

## 📂 Project Structure
```
InternTracker-v2-OCR/
│── api/
│   │── node_modules/
│   │── uploads/
│   │   │── 1134/
│   │   │── 2345/
│   │── index.js
│   │── package-lock.json
│   │── package.json
│   │── pdf_operations.py
│   │── students.xlsx
│── client/
```

## 📖 How to Run

### 🔹 Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/InternTracker-v2-OCR.git
   cd InternTracker-v2-OCR/api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node index.js
   ```

### 🔹 Frontend Setup
1. Navigate to the `client` directory.
2. Drag and drop `index.html` into your browser to open the application.

