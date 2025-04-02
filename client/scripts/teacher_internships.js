const teacherInternsTable = document.getElementById('teacher_interns_table');
const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData?.username); // Outputs stored username
console.log(userData?.register_number); // Outputs stored username
console.log(userData?.option);   // Outputs 'student' or 'teacher'
if(!userData){
    localStorage.clear();
    window.location.href ='../index.html';
}


async function getAllStudents(){
    try {
        let response = await fetch(`http://localhost:4000/fetch-sheet-students`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let students = await response.json(); // Properly parse JSON
        console.log(students);
        if (!Array.isArray(students)) {
            throw new Error("Invalid response format: Expected an array.");
        }
        teacherInternsTable.innerHTML = "";
        localStorage.setItem('teacher_interns', JSON.stringify(students));
        let i=1;
        for (let obj of students) {
            let tempTr = document.createElement("tr");
            tempTr.innerHTML = `
                <td>${i++}</td>
                <td>${obj['Register Number']}</td>
                <td>${obj['Name']}</td>
                <td>${obj['Mobile No.']}</td>
                <td>${obj['Section']}</td>
                <td>${obj['Obtained Internship or Not']}</td>
                <td>${obj['Title']}</td>
                <td>${obj['Period']}</td>
                <td>${obj['Start Date'].slice(0,10)}</td>
                <td>${obj['End Date'].slice(0,10)}</td>
                <td>${obj['Company Name']}</td>
                <td>${obj['Placement thru college / outside']}</td>
                <td>${obj["Abroad / India"]}</td>
                <td>${obj['Stipend\n(In Rs.)']}</td>
            `;
            teacherInternsTable.appendChild(tempTr);
        }
    } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
    }
}

function getInternshipsFromLocalStorage(studInterns){
    const interns = JSON.parse(studInterns);
    let i = 1;
    teacherInternsTable.innerHTML = "";
    for (let obj of interns) {
        let tempTr = document.createElement("tr");
        tempTr.innerHTML = `
            <td>${i++}</td>
            <td>${obj['Register Number']}</td>
            <td>${obj['Name']}</td>
            <td>${obj['Mobile No.']}</td>
            <td>${obj['Section']}</td>
            <td>${obj['Obtained Internship or Not']}</td>
            <td>${obj['Title']}</td>
            <td>${obj['Period']}</td>
                <td>${obj['Start Date'].slice(0,10)}</td>
                <td>${obj['End Date'].slice(0,10)}</td>
            <td>${obj['Company Name']}</td>
            <td>${obj['Placement thru college / outside']}</td>
                <td>${obj["Abroad / India"]}</td>
            <td>${obj['Stipend\n(In Rs.)']}</td>
        `;
        teacherInternsTable.appendChild(tempTr);
    }
}

function updatedSearch(){
    let teacherInterns = localStorage.getItem("teacher_interns")
    if (!teacherInterns){
        getAllStudents();
        return;
    }
    else teacherInterns = JSON.parse(teacherInterns);
    teacherInternsTable.innerHTML = "";
    
    // Retrieve selected filter values
    const selectedSection = document.getElementById("section-select-intern").value;
    const selectedSource = document.getElementById("source-select-intern").value;
    // const selectedType = document.getElementById("type-select-intern").value;
    const gotInternship = document.getElementById("interned-select-intern").checked;
    const selectedYear = document.getElementById("year-select-intern").value.trim();
    const superDream = document.getElementById("superdream-select-intern").checked;
    const selectedLocation = document.getElementById("location-select-intern").value;

    //testing
    console.log("Section Filter:", selectedSection);
    console.log("Source Filter:", selectedSource);
    // console.log("Type Filter:", selectedType);
    console.log("Has Internship:", gotInternship);
    console.log("Year Filter:", selectedYear);
    console.log("Is Super Dream:", superDream);
    console.log("Location Filter:", selectedLocation);

    //now filter the values
    const filteredInterns = teacherInterns.filter((obj)=>{
        // Match Section
        if (selectedSection && selectedSection !== "" && obj["Section"].toLowerCase() !== selectedSection.toLowerCase()) return false;

        // Match Source (CDC/Outside)
        if (selectedSource === "OUTSIDE" && !obj["Placement thru college / outside"]?.toLowerCase().includes(selectedSource.toLowerCase())) return false;
        if (selectedSource === "CDC" && obj["Placement thru college / outside"]?.toLowerCase().includes('outside')) return false;

        // Match Type (Research/Industry)
        // if (selectedType !== "ALL" && obj["Research\n/Industry"] !== selectedType) return false;

        // Match Got Internship (Only show those who have obtained an internship)
        if (gotInternship && obj["Obtained Internship or Not"].toLowerCase().includes("no")) return false;
        if (!gotInternship && !obj["Obtained Internship or Not"].toLowerCase().includes("no")) return false;

        // Match Year (Check if start date is within the selected year)
        if (!obj["Start Date"]) return false;
        if (selectedYear && obj["Start Date"]) {
            let startYear = obj["Start Date"].slice(0,10); // Extract year from Start Date
            if (!startYear.includes(selectedYear)) return false;
        }
        // Match Super Dream (Salary >= 1 LPM)
        if (superDream) {
            let stipend = obj["Stipend\n(In Rs.)"].replace(/\D/g, ""); // Remove non-numeric characters
            if (!stipend || parseInt(stipend, 10) < 100000) return false;
        }
        // Match Location (India/Abroad)
        if (selectedLocation === "ABROAD" && !obj["Abroad / India"].toLowerCase().includes('abroad')) return false;
        if (selectedLocation === "INDIA" && obj["Abroad / India"].toLowerCase().includes('abroad')) return false;
        return true; // If all conditions pass, include in filtered results
    });
    let i=1;

    for (let obj of filteredInterns){
        let tempTr = document.createElement("tr");
        tempTr.innerHTML = `
            <td>${i++}</td>
            <td>${obj['Register Number']}</td>
            <td>${obj['Name']}</td>
            <td>${obj['Mobile No.']}</td>
            <td>${obj['Section']}</td>
            <td>${obj['Obtained Internship or Not']}</td>
            <td>${obj['Title']}</td>
            <td>${obj['Period']}</td>
                <td>${obj['Start Date'].slice(0,10)}</td>
                <td>${obj['End Date'].slice(0,10)}</td>
            <td>${obj['Company Name']}</td>
            <td>${obj['Placement thru college / outside']}</td>
                <td>${obj["Abroad / India"]}</td>
            <td>${obj['Stipend\n(In Rs.)']}</td>
        `;
        teacherInternsTable.appendChild(tempTr);
    }
}

function revert(){
    //revert all the input changes
    document.getElementById("section-select-intern").value = "";
    document.getElementById("source-select-intern").value = "ALL";
    // document.getElementById("type-select-intern").value = "ALL";
    document.getElementById("interned-select-intern").checked = false;
    document.getElementById("year-select-intern").value = "";
    document.getElementById("superdream-select-intern").checked = false;
    document.getElementById("location-select-intern").value = "ALL";

    let teacherInterns = localStorage.getItem("teacher_interns")
    if (!teacherInterns){
        getAllStudents();
        return;
    }
    else getInternshipsFromLocalStorage(teacherInterns);
}


//initially, perform api call
getAllStudents();