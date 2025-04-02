const dimBg = document.getElementsByClassName('dim-bg')[0];
const studInternForm = document.getElementById('stud-intern-form');
const internSubmitBtn = document.getElementById('intern-submit-btn');
const tableBody = document.getElementById('intern-table-body');
const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData?.username); // Outputs stored username
console.log(userData?.register_number); // Outputs stored username
console.log(userData?.option);   // Outputs 'student' or 'teacher'
if(!userData){
    localStorage.clear();
    window.location.href ='../index.html';
};

function logout(){
    localStorage.clear();
    window.location.href = '../index.html';
}

async function viewInternships() {
    try {
        let response = await fetch(`http://localhost:4000/fetch-sheet-student?regno=${userData.register_number}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let internships = await response.json(); // Properly parse JSON
        console.log(internships);
        if (!Array.isArray(internships)) {
            throw new Error("Invalid response format: Expected an array.");
        }
        let tableBody = document.getElementById("intern-table-body"); // Ensure tableBody is defined
        tableBody.innerHTML = ""; // Clear previous entries if necessary

        localStorage.setItem("student_intern", JSON.stringify(internships));
        let i = 1;
        for (let obj of internships) {
            let tempTr = document.createElement("tr");
            tempTr.innerHTML = `
                <td>${i++}</td>
                <td>${obj["Company Name"]}</td>
                <td>${obj["Research\n/Industry"]}</td>
                <td>${obj["Title"]}</td>
                <td>${obj["Period"]}</td>
                <td>${obj["Start Date"]}</td>
                <td>${obj["End Date"]}</td>
                <td>${obj["Stipend\n(In Rs.)"]}</td>
            `;
            tableBody.appendChild(tempTr);
        }
    } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
    }
}


async function openModal(){
    dimBg.style.display = 'block';
    document.querySelector(".model-container").scrollTop = 0; // Scroll to top
}
async function closeModal(){
    event.preventDefault();
    internSubmitBtn.disabled= true;
    internSubmitBtn.style.cursor = 'not-allowed';
    internSubmitBtn.textContent= 'Submitting..';
    
    const fileInput = document.getElementById("file-upload-input");
    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        dimBg.style.display='none';
        internSubmitBtn.disabled = false;
        internSubmitBtn.style.cursor = "pointer";
        internSubmitBtn.textContent = 'Submit';
        return;
    }
    const file = fileInput.files[0];

    if (file && file.size > 512000) {
        alert("File size should not exceed 500 kB.");
        dimBg.style.display='none';
        internSubmitBtn.disabled = false;
        internSubmitBtn.style.cursor = "pointer";
        internSubmitBtn.textContent = 'Submit';
        return; // Stop execution if file is too large
    }


    let temp = document.getElementById('stipend-input').value.trim();
    const obj = {
        "Register Number": userData.register_number,
        "Name": userData.name,
        "Section": userData.section,
        "Obtained Internship or Not": "Yes",
        "Title": document.getElementById('title-input').value.trim(),
        "Research\n/Industry": document.getElementById('type-input').value,
        "Abroad / India": document.getElementById('location-input').value,
        "Mobile No.": userData.mobile,
        "Period": document.getElementById('period-input').value,
        "Start Date": document.getElementById('start-date-input').value.toString(),
        "End Date": document.getElementById('end-date-input').value.toString(),
        "Company Name": document.getElementById('company-name-input').value,
        "Placement thru college / outside": document.getElementById('source-input').value.trim(),
        "Stipend\n(In Rs.)": temp==='0'? 'Unpaid' : temp,
        "Signed Permission Letter, Offer Letter Submitted (Yes / No)": document.getElementById('op1').checked ? 'Yes' : 'No',
        "Completion Certificte Submitted (Yes/No)": document.getElementById('op2').checked ? 'Yes' : 'No',
        "Internship Report Submitted (Yes/No)": document.getElementById('op3').checked ? 'Yes' : 'No',
        "Student Feedback (About Internship) Submitted \n(Yes/No)": document.getElementById('op4').checked ? 'Yes' : 'No',
        "Employer Feedback (About student) Submitted (Yes/No)": document.getElementById('op5').checked ? 'Yes' : 'No'
    };
    
    // Create FormData
    const formData = new FormData();
    formData.append("file", file); // 'file' should match the backend field name
    formData.append("data", JSON.stringify(obj)); // Convert JSON object to string

    try{
        const response = await fetch('http://localhost:4000/fetch-sheet-new-internship',{
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok){
            console.log("Error response received:", result);  
            throw new Error(result.error || result.message || 'Something went wrong!');
        }
        console.log("Success:", result);
        //call the view internships function again, to update local storage
        viewInternships();
        alert('Added Successfully!');
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
    finally{
        dimBg.style.display='none';
        internSubmitBtn.disabled = false;
        internSubmitBtn.style.cursor = "pointer";
        internSubmitBtn.textContent = 'Submit';
        viewInternships();
    }
}


function getInternshipsFromLocalStorage(studInterns){
    const interns = JSON.parse(studInterns);
    let i = 1;
    tableBody.innerHTML = ""; // Clear previous entries if necessary
        for (let obj of interns) {
            let tempTr = document.createElement("tr");
            tempTr.innerHTML = `
                <td>${i++}</td>
                <td>${obj["Company Name"]}</td>
                <td>${obj["Research\n/Industry"]}</td>
                <td>${obj["Title"]}</td>
                <td>${obj["Period"]}</td>
                <td>${obj["Start Date"]}</td>
                <td>${obj["End Date"]}</td>
                <td>${obj["Stipend\n(In Rs.)"]}</td>
            `;
            tableBody.appendChild(tempTr);
        }
}


function hideModal(){
    document.getElementsByClassName('dim-bg')[0].style.display='none';
}


function handleFileUpload(event) {
    const fileInput = event.target;
    const fileNameDisplay = document.getElementById("file-name");
    const fileUploadText = document.getElementById("file-upload-text");
    
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        fileInput.value = "";
        fileNameDisplay.textContent = "No file selected";
        fileUploadText.innerHTML = `<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15' stroke='#000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'></path>
        </svg><p>Browse File to upload!</p>`;
        return;
      }
      fileNameDisplay.textContent = file.name;
      fileUploadText.textContent = file.name;
    }
}



function removeFile(event) {
    // event.stopPropagation(); 
    const fileInput = document.getElementById("file-upload-input");
    const fileNameDisplay = document.getElementById("file-name");
    const fileUploadText = document.getElementById("file-upload-text");
  
    fileInput.value = "";
    fileNameDisplay.textContent = "No file selected";
    fileUploadText.innerHTML = `<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15' stroke='#000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'></path>
    </svg><p>Browse File to upload!</p>`;
}


let studInterns = localStorage.getItem("student_intern")
if (!studInterns) viewInternships();
else getInternshipsFromLocalStorage(studInterns);