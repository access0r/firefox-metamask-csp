# firefox-metamask-csp
A solution that allows injection without compromising content-security-policy

1. Install dependencies:
   - Install Node.js and npm (Node Package Manager) on your machine.
   - Set up a new Node.js project by running `npm init` in your project's root directory.
   - Install Express and other required packages by running
2. Set up an Express server:
   - Create an `index.js` file and require the necessary modules 
3. Configure CSP headers
   -onfigure the CSP headers
4. Generate nonces
   - Create a helper function to generate a random nonce for each script
5. Create a nonce validator
   - Create a helper function to validate the nonces sent from the client
6. Generate a hash for each script
   - Create a helper function to generate the hash of a script using a specific algorithm (e.g., SHA256)
7. Route to handle script requests
   - Create a route to serve the JavaScript files and include the nonce and hash:
8. Start the server:
   - Add the following code to start the Express server
9. Run the server:
   - Execute the following command in your project's root directory
