const firstBlock= document.getElementById("firstBlock");
const secondBlock= document.getElementById("secondBlock");
const fistContent = document.getElementById("firstContent");
const secondContent = document.getElementById("secondContent");
const thirdContent = document.getElementById("thirdContent");
const fourthContent = document.getElementById("fourthContent");
const datainfo = document.getElementById("datainfo");
let countryId= 1;

const button2 = document.createElement('button');
button2.setAttribute('id', 'secondSubmit');
button2.classList.add('button');
button2.innerText='Next';

//Fetch getting array of activitie

const getActivities = async () =>{
  try {
    let response = await fetch('http://18.193.250.181:1337/api/activities');
    let data = await response.json();
    const activities = [
      ...new Set(data.data.map((x) => x.attributes.title)), 
    ];
    activities.forEach((activity) => {
      const input = document.createElement('input');
      const label = document.createElement('label');
      const flexdiv = document.createElement('div');
      flexdiv.classList.add('flexdiv')
      input.type = "checkbox";
      input.value = activity;
      label.innerText = activity;
      flexdiv.appendChild(input);
      flexdiv.appendChild(label);
      fistContent.appendChild(flexdiv);
    })
  } catch(err){
    alert(err);
  }
}
getActivities();

//Second submit. Gettiing countries

const getCountries = async () =>{
  try {
    let response = await fetch('http://18.193.250.181:1337/api/countries');
    let data = await response.json();
    const countries = [
      ...new Set(data.data.map((x) => x.attributes.country)), 
    ];

    const select = document.createElement('select');
    select.setAttribute('id', 'selectedCountry')
    countries.forEach((country) => {
      const option = document.createElement('option');
      option.value = countryId++;
      option.innerText = country;
      select.appendChild(option)
      secondContent.appendChild(select);
    })

    secondContent.appendChild(button2);

  } catch(err){
    alert(err);
  }
}
getCountries();

// First submit. Getting array of activities and puting into localstorage

document.getElementById('firstSubmit').addEventListener("click", () =>{
  let activitiesArray = [];
  var inputElements = document.querySelectorAll('input');
  for(var i=0; i < inputElements.length; ++i){
    if(inputElements[i].checked){
      activitiesArray.push(inputElements[i].value);
    }
  }
  
  if (activitiesArray.length === 0){
    alert('Please select activity')
  } else {
      firstBlock.style.display="none";
      secondBlock.style.display ="flex";
      localStorage.setItem("activities", activitiesArray);
    }
    
  let activitiesId = [];
  for( j=0; j < activitiesArray.length; j++){
    if (activitiesArray[j] == "Chill out"){
      activitiesId.push(1)
    } else if(activitiesArray[j] == "Read a book"){
      activitiesId.push(2)
    } else if(activitiesArray[j] == "Coding"){
      activitiesId.push(3)
    } else if (activitiesArray[j] == "Spending time with family"){
      activitiesId.push(4)
    }
  } 
  localStorage.setItem("activitiesIds", activitiesId);
})

//Second submit seting name surname email to localhost. Getting selected country

button2.addEventListener('click', (e)=>{
  e.preventDefault();
  let cntrySelecte = document.getElementById("selectedCountry");
  const name = document.getElementById('name').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const countryId = cntrySelecte.value;
  const countryName = cntrySelecte.innerText;

  localStorage.setItem("name", name)
  localStorage.setItem("lastName", lastName)
  localStorage.setItem("email", email);

  const localName = localStorage.getItem("name");
  const localLastName = localStorage.getItem("lastName");
  const localEmail = localStorage.getItem("email");
  const activitiesId = localStorage.getItem("activitiesId");

  fetch("http://18.193.250.181:1337/api/people",{
      method: "POST",
      headers:{
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          first_name: localName,
          last_name: localLastName,
          email: localEmail,
          activities: activitiesId,
          country: countryId,
        },
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let id = data.data.id;
      localStorage.setItem("personId", id);
      const getId = async () =>{
        try {
          let response = await fetch(`http://18.193.250.181:1337/api/people/${id}`);
          let data = await response.json();
          console.log(data);
          datainfo.innerHTML = `
          <p>${data.data.attributes.first_name} </p>
          <p>${data.data.attributes.last_name} </p>
          <p>${data.data.attributes.email} </p>
        `
        } catch(err){
          alert(err);
        }
      }
      getId();
    })
    .catch((err) =>{
      console.log(err);
    });

  if(name== "" || lastName == "" || email == ""){
    alert('please fill in all fields')
  } else{
    secondBlock.style.display ="none";
    thirdContent.style.display = "flex";
  }
});

document.getElementById('no').addEventListener('click', (e) =>{
  e.preventDefault();
  let personId = localStorage.getItem("personId");
  fetch(`http://18.193.250.181:1337/api/people/${personId}`, { method: 'DELETE' })
    .then(() =>{ 
    alert('Deleted');
    });
    location.reload();
});

document.getElementById('yes').addEventListener('click', (e) => {
  e.preventDefault();
  fourthContent.style.display="flex";
  thirdBlock.style.display="none";
});





