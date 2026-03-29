const http = require('http');

http.get('http://localhost:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Body:', data.substring(0, 5000));
    });
}).on('error', (err) => {
    console.log('Error:', err.message);
});
