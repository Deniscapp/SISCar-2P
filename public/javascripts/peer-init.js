const connectedPeers = [];
const connections = [];

var peer = new Peer({ key: 'oz9b3ni30qtcsor', debug: 2, config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
    { url: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' }
]}});

peer.on('open', id => {
    $('#my-peer-id').val(id)
    Materialize.updateTextFields();
});

const connectBtn = document.querySelector('#connect');
connectBtn.addEventListener('click', () => {
    const destinyPeer = document.querySelector('#destination-peer').value;
    const newConnection = peer.connect(destinyPeer, {
        label: 'file', reliable: true
    });
    // connectedPeers.push()

    newConnection.on('open', () => {
        console.log('opened connection!');
        connections.push(newConnection);
        connect(newConnection);
    });
});

const connect = connection => {
    connection.on('data', data => {
        console.log('Receiving data...');
        if(data.constructor === ArrayBuffer) {
            const dataView = new Uint8Array(data);
            const dataBlob = new Blob([dataView]);
            const url = window.URL.createObjectURL(dataBlob);
            console.log(url)
        }

        // 	$('#' + c.peer).find('.messages').append('<div><span class="file">' +
        //     c.peer + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
        // }
    })
};

const fileInput = document.querySelector('#file');
fileInput.addEventListener('change', function(){
    const file = this.files[0];
    console.log(file.type)
    // connections[0].send("ooookkk");
    for(let i in connections){
        console.log(`sending to connection number ${i}`);
        connections[i].send(file);
    }

});
// peer.on('connection', connect );

const closeBtn = document.querySelector('#close');
closeBtn.addEventListener('click', e => {

});

peer.on('close', function() {

});


peer.on('connection', connect);


// var conn = peer.connect('another-peers-id');
// conn.on('open', function(){
//   conn.send('hi!');
// });