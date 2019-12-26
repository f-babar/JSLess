# To run:
1.  Download the Legit-Server folder
2.  Navigate to the folder and update the URL's and secret keys in .env file 
3.  Add appropriate environment variables:
	 (i.) MONGO_URL = `mongodb://127.0.0.1:27017` 	This is the default mongodb uri
	 (ii.) MONGO_SECRET = [any-secret-you-want]	This can be set to any string you'd like.	
4.	Run mongodb: Navigate to the Mongodb install directory, go to "..\server\[mongodb-version]\bin\" and double click mongod.exe	
5.	Open a cmd prompt in the 'Legit-Server' directory and type insall required packages by using `npm install` command.
6. Once you are done with installing packages. just run command `npm start`, the website will now be accessible from a web browser @ localhost:3000

# Requirements:
-Install mongodb: Download and run the current release from mongodb msi from https://www.mongodb.com/download-center/community

-Install most recent version of node, before attempting to run the server, navigate to the folder the server is installed in and type "npm install", this will automatically install all the node-modules the server has as dependencies

