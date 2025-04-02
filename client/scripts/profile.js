const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData?.username); // Outputs stored username
console.log(userData?.option);   // Outputs 'student' or 'teacher'
if(!userData){
    localStorage.clear();
    window.location.href ='../index.html';
}

document.getElementById('profile-main-name').innerText = userData.name;
document.getElementById('profile-desc-name').innerText = userData.name;
document.getElementById('profile-desc-regno').innerText = userData.register_number;
document.getElementById('profile-desc-dept').innerText = userData.department;
document.getElementById('profile-desc-section').innerText = userData.section;
document.getElementById('profile-desc-regno').innerText = userData.register_number;
document.getElementById('profile-desc-username').innerText = userData.username;
document.getElementById('profile-desc-phone').innerText = userData.mobile;
document.getElementById('profile-desc-batch').innerText = userData.batch;