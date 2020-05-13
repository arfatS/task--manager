const profileIcon = document.querySelector('#profile-icon')
const dropdownMenu = document.querySelector('.dropdown-menu')
const checkTasks = document.querySelectorAll('.check-task')
const tasks = document.querySelectorAll('.task')

profileIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show')
})

checkTasks.forEach( (checkTask, i) => {

    checkTask.addEventListener('click', () => {
        if(checkTask.checked){
            tasks[i].style.background = 'rgb(188, 243, 188)'
        }else{
            tasks[i].style.background = '#fff'
        }
    })
})

//Form validation

const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const submitBtn = document.querySelector('#submit')

submitBtn.addEventListener('click', () => {
    
})