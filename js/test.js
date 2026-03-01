const url = 'http://localhost:3030/dotfiles'; // Replace with your API endpoint

const data = {
    key1: 'value1',
    key2: 'value2',
};

fetch(url, {
    method: 'POST', // Specify POST method
    headers: {
        'Content-Type': 'application/json', // Set content type to JSON
    },
    body: JSON.stringify(data), // Convert the data to a JSON string
})
.then(response => {
    if (!response.ok) { // Check for HTTP errors
        throw new Error('Network response was not ok');
    }
    return response.json(); // Parse response as JSON
})
.then(data => {
    //console.log('Success:', data); // Handle success
})
.catch(error => {
    console.error('Error:', error); // Handle error
});
