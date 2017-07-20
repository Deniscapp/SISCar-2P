const connections = [];

var peer = new Peer({ key: 'oz9b3ni30qtcsor', debug: 2, config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
    { url: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' }
]}});

peer.on('open', id => {
    $('#my-peer-id').val(id);
    Materialize.updateTextFields();
});

const connectBtn = document.querySelector('#connect');
connectBtn.addEventListener('click', () => {
    const destinyPeer = document.querySelector('#destination-peer').value;
    const user = document.querySelector('#my-peer-id').getAttribute('data-user');
    const newConnection = peer.connect(destinyPeer, {
        label: 'file', reliable: true, metadata: {user}
    });

    newConnection.on('open', () => {
        Materialize.toast('Conectado!', 5000);
        const div = document.createElement('div');
        div.innerHTML =` <div class="chip"> ${destinyPeer}
                    <i id="${destinyPeer}" class="close material-icons">close</i>
                    </div>`
        const users = document.querySelector('.users');
        users.appendChild(div);

        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', function(e)  {
            newConnection.close();
            // const peerId = this.id;
            // connections.forEach(function (c, i) {
            //     if (c.peer === peerId){
            //         c.close();
            //         Materialize.toast('Conexão encerrada!', 5000);
            //     }
            // })
        });

        connections.push(newConnection);
        connect(newConnection);
    });

    newConnection.on('close', () => cleanView())
});

const connect = connection => {
    connection.on('data', data => {
        console.log('Receiving data...');
        console.log(data);
        if(data.constructor === ArrayBuffer) {
            const dataView = new Uint8Array(data);
            const dataBlob = new Blob([dataView]);
            const url = window.URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.innerHTML = `<a download target="_blank" href="${url}">Download de Arquivo (Enviado por ${connection.metadata.user})</a> <br>`
            const files = document.querySelector(`.files`);
            files.appendChild(a);
            Materialize.toast("Você recebeu um novo arquivo!", 5000);
        }
    })
};

const fileInput = document.querySelector('#file');
fileInput.addEventListener('change', function(){
    const file = this.files[0];
    for(let i in connections){
        console.log(`sending to connection number ${i}`);
        connections[i].send(file);
    }

});

// peer.on('close', function() {
//     Materialize.toast('Usuário se desconectou!', 5000);
// });

peer.on('connection', connect);


peer.on('connection', conn => {
    const user = conn.metadata.user;
    Materialize.toast( `"${user}" se conectou a você!`, 5000);
    const div = document.createElement('div');
    // li.innerHTML = `<li id="${conn.peer}" class="collection-item"> ${user} </li>`;
    div.innerHTML =` <div  class="chip"> ${user}
                        <i id="${conn.peer}" class="close material-icons">close</i>
                    </div> `;
    const users = document.querySelector('.users');
    users.appendChild(div);

    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', function(e)  {
        conn.close();

    });

    conn.on('close', function () {
        cleanView();
    })
});


const cleanView = () => {
    const input = document.querySelector('#destination-peer');
    input.value = '';

    const users = document.querySelector('.users');
    const files = document.querySelector('.files');

    while (users.hasChildNodes()) {
        users.removeChild(users.lastChild);
    }

    while (files.hasChildNodes()) {
        files.removeChild(files.lastChild);
    }

    Materialize.toast('Conexão encerrada!', 5000);

};
