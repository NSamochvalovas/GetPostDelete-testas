const namesblock = document.getElementById('namesblock');
const searchForPeople = document.getElementById('searchForPeople');
const searchForCountry = document.getElementById('searchForCountry');

const getData = async (query) =>{
  let url = ('http://18.193.250.181:1337/api/people?fields=first_name,last_name,email');
  if(query){
    url += `&filters[first_name][$containsi]=${query}&filters[first_name][$containsi]=${query}`
  }
  try {
    let response = await fetch(url);
    let data = await response.json();
    if(query){
      namesblock.innerHTML="";
      data.data.forEach((name) => {
        const li = document.createElement('p');
        li.classList.add('peaplenamesvalue')
        li.innerHTML = ` <i class="fa fa-eye" style="color:#3b65e8" aria-hidden="true"></i> ${name.attributes.first_name} ${name.attributes.last_name} <br ><span>${name.attributes.email} </span>`;
        namesblock.appendChild(li);
      })
    }else{
      data.data.forEach((name) => {
        const li = document.createElement('p');
        li.classList.add('peaplenamesvalue')
        li.innerHTML = ` <i class="fa fa-eye" style="color:#3b65e8" aria-hidden="true"></i> ${name.attributes.first_name} ${name.attributes.last_name} <br ><span>${name.attributes.email} </span>`;
        namesblock.appendChild(li);
      })
    }

  } catch(err){
    alert(err);
  }
}
getData();

const getCountry = async () => {
  let url = (`http://18.193.250.181:1337/api/countries`);
  try {
    let response = await fetch(url);
    let data = await response.json();
    data.data.forEach((country) => {
      const option = document.createElement("option");
      option.value =  country.attributes.country;
      option.innerText = country.attributes.country;
      searchForCountry.appendChild(option);
    })

    searchForCountry.addEventListener('change', (e) => {
      e.preventDefault();
      let selectedCountry = searchForCountry.value;
      fetch(`http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100&filters[country][country][$eq]=${selectedCountry}&filters[$or][0][first_name][$containsi]=&filters[$or][1][last_name][$containsi]=`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        namesblock.innerHTML="";
        data.data.forEach((name) => {
          const li = document.createElement('p');
          li.classList.add('peaplenamesvalue')
          li.innerHTML = ` <i class="fa fa-eye" style="color:#3b65e8" aria-hidden="true"></i> ${name.attributes.first_name} ${name.attributes.last_name} <br ><span>${name.attributes.email} </span>`;
          namesblock.appendChild(li);
        })
      });
    })
  }
  catch(err){
    alert(err);
  }
}
getCountry();

searchForPeople.addEventListener("keyup", (e) => {
  const query = e.target.value;
  getData(query);
});

function randomNumber() {
  let number = Math.floor(Math.random() * 1000) + 5000;
  document.getElementById('randomNumber').innerHTML = number;
}
const countUsers = async () => {
  try {
    let response = await fetch("http://18.193.250.181:1337/api/people");
    let data = await response.json();
    let totalUsers = data.meta.pagination.total;
    document.getElementById('howmanyusers').innerHTML = totalUsers;
  }
  catch(err){
    alert(err);
  }
}

const difCountries = async () =>{
  try {
    let response = await fetch("http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100&filters[country][id][$containsi]=1&filters[country][id][$containsi]=2&filters[country][id][$containsi]=3&filters[country][id][$containsi]=4&filters[country][id][$containsi]=5&filters[country][id][$containsi]=6&filters[country][id][$containsi]=7&filters[country][id][$containsi]=8");
    let data = await response.json();
    const diferentNumber = [
      ...new Set(data.data.map((x) => x.attributes.country.data.id)), 
    ];
    document.getElementById('howManyCountries').innerText = diferentNumber.length;
  }
  catch(err){
    alert(err);
  }
}

const fromLowerCase = async () => {
  try {
    let response = await fetch("http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100");
    let data = await response.json();
    let newArray = [];
    data.data.forEach((name) =>{
      newArray.push(name.attributes.first_name);
    })
    console.log(newArray)
    let sum = 0;
    for (i=0; i<newArray.length; i++){
      newArray[i] === newArray[i].toLowerCase() ? sum++ : sum=sum;
    }
    document.getElementById('namesCapital').innerText = sum;
  }
  catch(err){
    alert(err);
  }
}

randomNumber();
countUsers();
difCountries();
fromLowerCase();