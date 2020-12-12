users = [];
getUsers();
userEdit = null;

function getUsers(){
    fetch('http://localhost:3000/users').then(response => {
        response.json().then(data => {
            console.log('users list', data);
            // data.forEach(user => {
            //     users.innerHTML += `${user.name}<br/>`;
            // })
            users = data;
            populateTable(data);
        })
    })
}

function populateTable(data) {
    const tableElement = document.getElementById('userTable')
    tableElement.innerHTML = `
            <thead class="bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                </th>
                <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
    `;
    if(data && data.length > 0){
        data.forEach(user => {
            tableElement.innerHTML += `
                <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60" alt="">
                        </div>
                        <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                            ${user.name}
                        </div>
                        <div class="text-sm text-gray-500">
                            ${user.email}
                        </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-indigo-600 hover:text-indigo-900" onclick="editUser(${user.id})">Edit</a>
                    <a href="#" class="text-indigo-600 hover:text-indigo-900 ml-2" onclick="deleteUser(${user.id})">Delete</a>
                </td>
            </tr>
        `;
        });
        
    } else {
        //
    }

    tableElement.innerHTML += `</tbody>`;
}

function editUser(id){
    console.log('Edit', id);
    userEdit = users.find(u => u.id == id);
    if(userEdit){
        document.getElementById('username').value = userEdit.name;
        document.getElementById('email').value = userEdit.email;
        document.getElementById('status').value = userEdit.status;
    } else {
        clearEditForm();
    }
}
function cancelUser(){
    console.log('Cancel user');
    clearEditForm();
}

function clearEditForm(){
    userEdit = null;
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('status').value = '';
}

function deleteUser(id){
    fetch(`http://localhost:3000/user/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
        }
    }).then(response => {
        response.json().then(data => {
            console.log('deeted', data);
            clearEditForm();
            getUsers();
        })
    })
}

function saveUser(){
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const status = document.getElementById('status').value;
    const user = {
        name: username,
        email,
        status
    }
    console.log('saving user details', user);

    let url = '';
    if(userEdit){
        url = `http://localhost:3000/user/${userEdit.id}`;
    } else {
        url = 'http://localhost:3000/user';
    }
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
        }
    }).then(response => {
        response.json().then(data => {
            console.log('saved', data);
            clearEditForm();
            getUsers();
        })
    })
}
