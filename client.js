const { Socket } = require('net');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const END = 'END';

const error = (err)=>{
    console.log(err);
    process.exit(1);
}



const connect = (host, port)=>{
    console.log(`Connecting to ${host}:${port}`);

    const socket = new Socket();
    socket.connect({host: 'localhost', port: 8000});
    socket.setEncoding('utf-8');

    socket.on('connect', ()=>{
        console.log('connected');

        readline.question('Choose your username: ', (username)=>{
            socket.write(username);
            console.log(`Type any message to Send it, Type ${END} to exit.`);
            
        });

        readline.on('line', (message)=>{
            socket.write(message)
            if(message === END){
                socket.end();
                console.log('Disconnected');
            }
            
        });
    });
    
    socket.on('data', (message)=> console.log(message));
    socket.on('close', ()=> process.exit(0));
    socket.on('error', (err) => error(err.message));
}

const main = ()=>{
    if(process.argv.length !== 4){
        error(`Usage: node ${__filename} host port`);
    }

    let [, ,host, port] = process.argv;

    if(port.isNaN){
        error(`invalid port ${port}`);
    }

    port = Number(port);
    connect(host, port);
}

if(module === require.main){
    main();
}