console.log("Good morning, Vietnam!!!")

document.addEventListener('DOMContentLoaded', () => {
    console.log('%cDOM Content Loaded and Parsed!', 'color: magenta')

    function getExistingUserData() {
        fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => users.forEach(user => {
            createUserCard(user)
        }))
    }

    getExistingUserData()

    const formSection = document.getElementById('forms-section')
    const newUserForm = document.getElementById('add-new-user')
    const userCardContainer = document.getElementById('user-card-container')

    newUserForm.addEventListener('submit', event => {
        event.preventDefault()
        const formData = new FormData(newUserForm)
        const name = formData.get('name')
        const username = formData.get('username')
        const email = formData.get('email')
        const password = formData.get('password')
        const newUser = { user: {
            name: name,
            username: username,
            email: email,
            password: password
        }}
        fetch('http://localhost:3000/users', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(result => handleUserResponse(result, newUserForm))
        
    })
    
    function createUserCard(user) {
        const userCard = document.createElement('div')
        userCard.className = "user-card"
        const name = document.createElement('h3')
        const username = document.createElement('p')
        const email = document.createElement('p')
        name.innerText = user.name
        username.innerText = user.username
        email.innerText = user.email
        userCard.append(name, username, email, createEditButton(user))
        userCardContainer.append(userCard)
    }

    function createEditButton(user, event) {
        const editButton = document.createElement('button')
        editButton.innerText = "Edit User Info"
        editButton.addEventListener('click', () => {
            editUserInfo(user)
        })
        return editButton
    }

    function editUserInfo(user) {
        const editUserForm = document.createElement('form')
        const nameInput = document.createElement('input')
        const usernameInput = document.createElement('input')
        const emailInput = document.createElement('input')
        const passwordInput = document.createElement('input')
        const editUserButton = document.createElement('button')
        nameInput.name = "name"
        nameInput.value = user.name
        usernameInput.name = "username"
        usernameInput.value = user.username
        emailInput.name = "email"
        emailInput.value = user.email
        passwordInput.name = "password"
        passwordInput.placeholder = "We didn't save your raw text password."
        editUserButton.innerText = "Update User Info"
        editUserButton.type = "submit"
        editUserForm.append(nameInput, usernameInput, emailInput, passwordInput, editUserButton)
        editUserForm.addEventListener('submit', () => {
            event.preventDefault()
            patchUserInfo(user, editUserForm)
        })
        formSection.append(editUserForm)
    }

    function patchUserInfo(user, form) {
        const formData = new FormData(form)
        const name = formData.get('name')
        const username = formData.get('username')
        const email = formData.get('email')
        const password = formData.get('password')
        const updatedUser = { user: {
            name: name,
            username: username,
            email: email,
            password: password
        }}
        fetch(`http://localhost:3000/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => response.json())
        .then(result => handleUserResponse(result, newUserForm))
    }
    
    function handleUserResponse(response, form) {
        const errorMessage = document.getElementById('response-error-message')
        if (errorMessage) {
            newUserForm.removeChild(errorMessage)
        }
        if (response.user) {
            createUserCard(response.user)
            form.reset()
        } else {
            const responseKeys = Object.keys(response)
            const responseMessage = document.createElement('ul')
            responseMessage.id = "response-error-message"
            responseMessage.innerText = "We were unable to create this user instance for the following reasons:"
            responseKeys.forEach(responseKey => {
                const li = document.createElement('li')
                li.innerText = response[responseKey]
                responseMessage.append(li)
            })
            newUserForm.append(responseMessage)
        }
    }
    
})

    // function createEditButton(user) {
    //     const editButton = document.createElement('button')
    //     editButton.innerText = "Edit User Info"
    //     editButton.addEventListener('click', () => {
    //         createEditUserInfoForm(user)
    //     })
    //     return editButton
    // }

    // function updateUserInfo(user, event) {
    //     event.preventDefault()
    //     console.log(user)
    //     console.log(event)
    // }

    // function createEditUserInfoForm(user) {
    //     const editUserForm = document.createElement('form')
    //     const nameInput = document.createElement('input')
    //     nameInput.id = "name"
    //     nameInput.name = "name"
    //     nameInput.placeholder = user.name
    //     const usernameInput = document.createElement('input')
    //     usernameInput.name = "username"
    //     usernameInput.id = "username"
    //     usernameInput.placeholder = user.username
    //     const emailInput = document.createElement('input')
    //     emailInput.id = "email"
    //     emailInput.name = "email"
    //     emailInput.placeholder = user.email
    //     const saveUserInfo = document.createElement('button')
    //     saveUserInfo.type = "submit"
    //     saveUserInfo.innerText = "Update User Info"
    //     editUserForm.append(nameInput, usernameInput, emailInput, saveUserInfo)
    //     editUserForm.addEventListener('submit', () => updateUserInfo("this will be a user object", event))
    //     formSection.append(editUserForm)
    // }