Bible Quote API
===============
See [here](app/public/docs/index.html) for generated documentation.

Traverse into the local bible-quote directory

	cd bible-quote

ssh into AWS:

	cd resources
	ssh -i "NobleCallKey.pem" ec2-user@ec2-HOSTNAME.us-west-2.compute.amazonaws.com`

To pull down the source code to AWS:

	git clone https://github.com/orthlieb/bible-quote

To install the necessary node modules:

	cd bible-quote
	npm install
	
To start the server use:

    ./start
To see if the server is running:

	ps -A | grep node
You should see two node processes.

To stop the server use:

	./stop
