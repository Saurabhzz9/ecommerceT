Performance Optimization Techniques:

Image Optimization: Compress images using tools like ImageOptim or TinyPNG to reduce file size and improve load times.

Lazy Loading: Use loading="lazy" for images to load them only when they come into the viewport, reducing initial load time.

Minify CSS/JS: Minify and bundle CSS and JavaScript files to reduce file sizes and HTTP requests.

Use a CDN: Serve static assets through a CDN to reduce latency by delivering content from servers closer to the user.




3.1 Web Security (5 Points)
Top 3 web security vulnerabilities:

XSS (Cross-Site Scripting) – Attackers inject malicious scripts into web pages.

Fix: Sanitize user input and use Content Security Policy (CSP).
SQL Injection – Hackers manipulate database queries through input fields.

Fix: Use prepared statements and parameterized queries.
CSRF (Cross-Site Request Forgery) – Tricks users into performing unwanted actions.

Fix: Use CSRF tokens and SameSite cookies.
3.2 Progressive Web App (5 Points)
To make a webpage a PWA:

Add a Web App Manifest (manifest.json) – Defines app name, icon, and theme color.
Create a Service Worker (service-worker.js) – Caches files for offline use.
Use HTTPS – PWAs require secure connections for safety.