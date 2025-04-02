const logForm = document.getElementById('logform');
const logSubmitBtn = document.getElementById('logsubmitbtn');
const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData?.username); // Outputs stored username
console.log(userData?.option);   // Outputs 'student' or 'teacher'
if(userData?.option==='student'){
    window.location.href = './student/internships.html';
}
else if(userData?.option==='teacher'){
    window.location.href = './teacher/internships.html';
}


logForm.onsubmit = async function(event){
    event.preventDefault();
    logSubmitBtn.disabled = true;
    logSubmitBtn.style.cursor = "not-allowed";
    logSubmitBtn.textContent = 'submitting...'
    const obj = {
        username: document.getElementById("logemail").value.trim(),
        password: document.getElementById("logpass").value,
        option: document.getElementsByClassName('logcheck')[0].checked? 'student' : 'teacher',
    };
    console.log(obj);//testing
    try{
        let response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {'Content-Type': 'application/json'}
        });
        const result = await response.json();
        if (!response.ok){
            throw new Error(result.err || 'Something went wrong!');
        }
        console.log("Success:", result);
        alert('Logged In Successfully!');

        // Store login data in localStorage
        result.option = document.getElementsByClassName('logcheck')[0].checked? 'student' : 'teacher';
        localStorage.setItem("user", JSON.stringify(result));

        setTimeout(()=>{window.location.href = document.getElementsByClassName('logcheck')[0].checked? './student/internships.html' : './teacher/internships.html';}, 100); 
    }
    catch(error){
        console.log("Error:", error);
        alert(error.message);
    }
    finally{
        logSubmitBtn.disabled = false;
        logSubmitBtn.style.cursor = "pointer";
        logSubmitBtn.textContent = 'login';
    }
}


