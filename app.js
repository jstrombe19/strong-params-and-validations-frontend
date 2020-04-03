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
        userCard.append(name, username, email)
        userCardContainer.append(userCard)
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