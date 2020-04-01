console.log("Good morning, Vietnam!!!")

document.addEventListener('DOMContentLoaded', () => {
    console.log('%cDOM Content Loaded and Parsed!', 'color: magenta')

    function getExistingUserData() {
        fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(result => console.log('users', result))
    }

    getExistingUserData()

    const newUserForm = document.getElementById('add-new-user')

    newUserForm.addEventListener('submit', event => {
        event.preventDefault()
        const formData = new FormData(newUserForm)
        const name = formData.get('name')
        const username = formData.get('username')
        const email = formData.get('email')
        const password = formData.get('password')
        fetch('http://localhost:3000/users', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: {
                    name: name,
                    username: username,
                    email: email,
                    password: password
                }
            })
        })
    })

})