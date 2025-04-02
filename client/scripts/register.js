const regBatch = document.getElementById('regbatch');
const regForm = document.getElementById('regform');
const regSubmitBtn = document.getElementById('regsubmitbtn');

var d = new Date();
var currentYear = d.getFullYear();
for (let i=0; i<5; i++){
    let tempOption = document.createElement('option');
    tempOption.textContent = (currentYear-4+i)+"-"+`${currentYear+i}`.slice(-2);
    regBatch.appendChild(tempOption);
}


regForm.onsubmit = async function(event){
    event.preventDefault();
    regSubmitBtn.disabled = true;
    regSubmitBtn.style.cursor = "not-allowed";
    regSubmitBtn.textContent = 'submitting...'
    const studentDetails = {
        name: document.getElementById("regname").value.trim(),
        register_number: document.getElementById("regreg").value.trim(),
        username: document.getElementById("regemail").value.trim(),
        password: document.getElementById("regpass").value,
        mobile: document.getElementById("regpn").value.trim(),
        department: document.getElementById("regdept").value,
        batch: document.getElementById("regbatch").value,
        section: document.getElementById("regsection").value
    };
    console.log(studentDetails);//testing
    try{
        const response = await fetch('http://localhost:4000/register-student', {
            method: 'POST',
            body: JSON.stringify(studentDetails),
            headers: {'Content-Type': 'application/json'}
        });
        const result = await response.json();
        if (!response.ok){
            throw new Error(result.err || 'Something went wrong!');
        }
        console.log("Success:", result);
        alert('Registered Successfully!');
        setTimeout(1000, ()=>{window.location.href = './index.html';}); 
    }
    catch(error){
        console.log("Error:", error);
        alert(error.message);
    }
    finally{
        regSubmitBtn.disabled = false;
        regSubmitBtn.style.cursor = "pointer";
        regSubmitBtn.textContent = 'register';
    }
}


