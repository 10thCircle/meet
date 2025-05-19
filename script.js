// Fetch user information from the server
    function fetchUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
        console.log('Users:', data);
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        data.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} - ${user.email} - ${user.role}`;
            userList.appendChild(li);
        });
        })
        .catch(error => console.error('Error fetching users:', error));
    }

    // Add user information to the server
    function addUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;

    fetch('/api/users', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, role, password }),
    })
        .then(response => {
        if (response.ok) {
            console.log('User added successfully');
            fetchUsers(); // Refresh the user list
        } else {
            console.error('Error adding user');
        }
        })
        .catch(error => console.error('Error adding user:', error));
    }

    // Check login status
    function checkLogin() {
    const display = document.getElementById('user.nameDisplay');
    const logOut = document.getElementById('logOut');
    const logIn = document.getElementById('logIn');
    fetch('/api/login')
        .then(response => response.json())
        .then(data => {
        if (data.loggedIn) {
            console.log('User is logged in');
            display.textContent = `Welcome, ${data.user.name}`;
            logIn.style.display = 'none';
            logOut.style.display = 'block';
            logOut.addEventListener('click', () => {
            fetch('/api/logout', { method: 'POST' })
                .then(response => {
                if (response.ok) {
                    console.log('User logged out');
                    display.textContent = '';
                } else {
                    console.error('Error logging out');
                }
                })
                .catch(error => console.error('Error during logout:', error));
            });
        } else {
            console.log('User is not logged in');
            logIn.style.display = 'block';
            logOut.style.display = 'none';
            display.textContent = '';
        }
        })
        .catch(error => console.error('Error checking login:', error));
    }

    // Login function
    function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    var loginErrors = 0
    const loginForm = document.getElementById('login-form')
    const userForm = document.getElementById('userForm')
    const tag = document.getElementById('tag')

    fetch('/api/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
        .then(response => response.json())
        .then(data => {
        if (data.loggedIn) {
            console.log('Login successful:', data.user);
            document.getElementById('user.nameDisplay').textContent = `Welcome, ${data.user.name}`;
        } else {
            loginErrors += 1
            console.error('Login failed:', data.message);
            alert('Invalid email or password');
            if (loginErrors >= 3) {
            alert('Too many failed login attempts. Please try again later.');
            loginForm.style.display = 'none';
            userForm.style.display = 'none';
            tag.style.display = 'none';
            // Optionally, disable the login form or take other actions
            // loginForm.disabled = true;
            // userForm.disabled = true;
            // tag.disabled = true;
            wait(3600)
            loginForm.style.display = 'block';
            userForm.style.display = 'block';
            tag.style.display = 'block';
            loginErrors = 0
            alert('You can try logging in again now.');
            // Re-enable the login form after a certain period
            }
        }
        })
        .catch(error => console.error('Error during login:', error));
    }
    function logOut() {
    const logOut = document.getElementById('logOut');
    logOut.addEventListener('click', () => {
        fetch('/api/logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
            console.log('User logged out');
            document.getElementById('user.nameDisplay').textContent = '';
            } else {
            console.error('Error logging out');
            }
        })
        .catch(error => console.error('Error during logout:', error));
    });
    }

    function checkRole() {
    fetch('/api/login')
        .then(response => response.json())
        .then(data => {
            const main = document.querySelector('main');
            if (!main) return;
            // Clear previous role-based content
            main.innerHTML = '';
            let content = '';
            if (data.loggedIn && data.user && data.user.role) {
                switch (data.user.role) {
                    case 'teacher':
                        content = `
                            <h1>Enter Meeting Code</h1><br>
                            <input type="text" id="meeting-code" placeholder="Enter meeting code">
                            <button id="join-meeting">Join Meeting</button>
                            <br><h1>Or...</h1><br>
                            <button id="create-meeting">Create Meeting</button>
                        `;
                        break;
                    case 'student':
                        content = `
                            <h1>Enter Meeting Code</h1><br>
                            <input type="text" id="meeting-code" placeholder="Enter meeting code">
                            <button id="join-meeting">Join Meeting</button>
                        `;
                        break;
                    case 'parent':
                    case 'school':
                        content = '<h3>Sorry, this page is not available for your role.</h3>';
                        break;
                    default:
                        content = `<h3>Welcome, ${data.user.role}!</h3>`;
                }
                main.innerHTML = content;

                // Add event listener for join meeting button
                const joinMeetingButton = document.getElementById('join-meeting');
                if (joinMeetingButton) {
                    joinMeetingButton.addEventListener('click', () => {
                        const meetingCode = document.getElementById('meeting-code').value;
                        if (meetingCode) {
                            window.location.href = `https://meet.google.com/${meetingCode}`;
                            fetch('/api/logMeetingCode', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ meetingCode }),
                            })
                                .then(response => {
                                    if (response.ok) {
                                        console.log('Meeting code logged successfully');
                                    } else {
                                        console.error('Error logging meeting code');
                                    }
                                })
                                .catch(error => console.error('Error logging meeting code:', error));
                        } else {
                            alert('Please enter a meeting code.');
                        }
                    });
                }

                // Add event listener for create meeting button (for teacher)
                if (data.user.role === 'teacher') {
                    const createMeetingButton = document.getElementById('create-meeting');
                    if (createMeetingButton) {
                        createMeetingButton.addEventListener('click', () => {
                            // Implement create meeting logic here
                            alert('Create Meeting clicked! (Implement logic)');
                        });
                    }
                }
            } else {
                main.innerHTML = '<p>Please, Log-in to join a meeting</p>';
            }
        })
        .catch(error => console.error('Error checking role:', error));
}
