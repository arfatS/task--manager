const profileIcon = document.querySelector('#profile-icon')
const dropdownMenu = document.querySelector('.dropdown-menu')
const checkTasks = document.querySelectorAll('.check-task')
const tasks = document.querySelectorAll('.task')


profileIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show')
})

checkTasks.forEach( (checkTask, i) => {

        if(checkTask.checked){
            tasks[i].style.background = 'rgb(188, 243, 188)'
        }else{
            tasks[i].style.background = '#fff'
        }
})

