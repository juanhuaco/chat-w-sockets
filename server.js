const { Server } = require('net');
const host = "0.0.0.0";

const END = 'END';
const connections = new Map();

const error = (err)=>{
    console.log(err);
    process.exit(1);
}

const sendMessage = (message, origin)=>{
    for(const socket of connections.keys()){
        if(socket !== origin){
            socket.write(message);
        }
    }
}

const listen = (port) =>{
    const server = new Server();
    server.on('connection', (socket)=>{
        const remoteSocket =  `${socket.remoteAddress}:${socket.remotePort}`;
        console.log(`new conection from ${remoteSocket}`);
    
        socket.setEncoding('utf-8');
        socket.on('data', (message)=>{
            if(!connections.has(socket)){
                console.log(`${message} set for connection ${remoteSocket}`);
                connections.set(socket, message);
            }else if(message === END){
                socket.end();
                connections.delete(socket);
            }else{
                const fullMessage = `[${connections.get(socket)}]: ${message}`
                console.log(`${connections.get(socket)} -> ${message}`);
                sendMessage(fullMessage, socket);
            }
            
        });
        socket.on('close', ()=>console.log(`connection with ${remoteSocket} has been ended`));
        socket.on('error', (err)=>error(err.message));
    });

    server.listen({port, host}, ()=>console.log('listening'));

    server.on('error', (err)=>error(err.message));
}


const main = ()=>{
    if(process.argv.length !== 3){
        error(`Usage: node ${__filename} port`);
    }

    let port = process.argv[2];
    if(port.isNaN){
        error(`invalid port ${port}`);
    }

    port = Number(port);

    listen(port);
}

if(module === require.main){
    main();
}




