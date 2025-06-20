let API_BASE_URL = '%%API_BASE_URL%%'; // Will be replaced at runtime

// Debug display of API URL
window.addEventListener('DOMContentLoaded', () => {
    let debugDiv = document.createElement('div');
    debugDiv.style = 'position:fixed;bottom:10px;right:10px;background:#eee;padding:5px;z-index:9999;font-size:12px;';
    debugDiv.innerHTML = '<code>API: <span id="apiUrlDebug">Connected</span></code>';
    document.body.appendChild(debugDiv);
});

// Function to render data as a list
function renderList(data, targetElementId, type) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;
    if (!data || data.length === 0) {
        targetElement.innerHTML = '<em>No data found.</em>';
        return;
    }
    let html = '<ul>';
    if (type === 'users') {
        data.forEach(u => {
            html += `<li><strong>ID:</strong> ${u.id} | <strong>Username:</strong> ${u.username} | <strong>Email:</strong> ${u.email}</li>`;
        });
    } else if (type === 'subscriptions') {
        data.forEach(s => {
            html += `<li><strong>ID:</strong> ${s.id} | <strong>Name:</strong> ${s.name} | <strong>Price:</strong> $${s.price} | <strong>Description:</strong> ${s.description}</li>`;
        });
    } else if (type === 'user_subs') {
        data.forEach(s => {
            html += `<li><strong>Plan:</strong> ${s.subscription_name} (ID: ${s.subscription_id}) | <strong>Status:</strong> ${s.status} | <strong>Start:</strong> ${s.start_date}${s.end_date ? ' | <strong>End:</strong> ' + s.end_date : ''}</li>`;
        });
    }
    html += '</ul>';
    targetElement.innerHTML = html;
}

// Function to fetch and display data
async function fetchData(url, targetElementId, resultDivId, type) {
    const targetElement = document.getElementById(targetElementId);
    const resultDiv = resultDivId ? document.getElementById(resultDivId) : null;
    if (targetElement) targetElement.textContent = 'Loading...';
    if (resultDiv) resultDiv.textContent = '';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Try to get error message from backend response body
            let errorText = `Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorText += ` - ${errorData.description || JSON.stringify(errorData)}`;
            } catch (e) { /* Ignore if response body is not JSON */ }
            throw new Error(errorText);
        }
        const data = await response.json();
        if (targetElement) {
            if (type) {
                renderList(data, targetElementId, type);
            } else {
                targetElement.textContent = JSON.stringify(data, null, 2);
            }
        }
        if (resultDiv) {
             resultDiv.textContent = 'Success!';
             resultDiv.style.color = 'green';
         }
        return data; // Return data for potential chaining
    } catch (error) {
        console.error('Fetch Error:', error);
        if (targetElement) {
            targetElement.textContent = `Failed to load data: ${error.message}`;
        }
         if (resultDiv) {
             resultDiv.textContent = `Error: ${error.message}`;
             resultDiv.style.color = 'red';
         }
    }
}

// Event Listeners
document.getElementById('loadSubscriptions').addEventListener('click', () => {
    fetchData(`${API_BASE_URL}/subscriptions`, 'subscriptionsList', null, 'subscriptions');
});

document.getElementById('loadUsers').addEventListener('click', () => {
    fetchData(`${API_BASE_URL}/users`, 'usersList', null, 'users');
});

document.getElementById('loadUserSubscriptions').addEventListener('click', () => {
    const userId = document.getElementById('userIdInput').value;
    if (userId) {
        fetchData(`${API_BASE_URL}/users/${userId}/subscriptions`, 'userSubscriptionsList', null, 'user_subs');
    } else {
        document.getElementById('userSubscriptionsList').textContent = 'Please enter a User ID.';
    }
});

 document.getElementById('addUserSubscription').addEventListener('click', async () => {
    const userId = document.getElementById('addUserId').value;
    const subscriptionId = document.getElementById('addSubscriptionId').value;
    const resultDiv = document.getElementById('addResult');
    resultDiv.textContent = 'Adding...';

    if (!userId || !subscriptionId) {
         resultDiv.textContent = 'Please enter both User ID and Subscription Plan ID.';
         resultDiv.style.color = 'orange';
         return;
     }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscription_id: parseInt(subscriptionId) }),
        });

        const responseData = await response.json();

        if (!response.ok) {
             let errorText = `Error: ${response.status} ${response.statusText}`;
             errorText += ` - ${responseData.description || JSON.stringify(responseData)}`;
             throw new Error(errorText);
        }

        resultDiv.textContent = `Success: ${responseData.message || JSON.stringify(responseData)}`;
        resultDiv.style.color = 'green';

         // Optionally reload the user's subscriptions list
         // fetchData(`${API_BASE_URL}/users/${userId}/subscriptions`, 'userSubscriptionsList');

    } catch (error) {
        console.error('Add Subscription Error:', error);
         resultDiv.textContent = `Failed to add subscription: ${error.message}`;
         resultDiv.style.color = 'red';
    }
});

 document.getElementById('seedDatabase').addEventListener('click', () => {
    const resultDiv = document.getElementById('seedResult');
    resultDiv.textContent = 'Triggering...';
     // Call the backend seed endpoint
    fetchData(`${API_BASE_URL}/seed`, null, 'seedResult'); // Don't display JSON, just success/error message
 });


// Initial load (optional)
// fetchData(`${API_BASE_URL}/subscriptions`, 'subscriptionsList');
// fetchData(`${API_BASE_URL}/users`, 'usersList');