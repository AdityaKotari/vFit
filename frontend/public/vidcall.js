
        
            var peer = new Peer();
 
            peer.on('open', function(id) 
            {
                document.getElementById("demo").innerHTML = id;
            }); 
 
            peer.on('connection', function(connection)
            {
                setInterval(score_dispatch, 1000, connection);
 
                connection.on('data', function(data)
                {
                    console.log(data);
                    document.getElementById("demo").innerHTML = data;
                });
            });
 
            peer.on('call', function(call) 
            {
                navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then( 
                function(stream)
                {
                    call.answer(stream);
 
                    call.on('stream', function(stream)
                    {
                        video = document.getElementById('sendvidshere');
                        video.srcObject = stream;
                        video.autoplay= true;
                    });
                }).catch(() => {});
            });
 
            function score_dispatch(conn)
            {
                conn.send(Math.random() * 1000000);
            }
            
            function do_call()
            {
                connection = peer.connect(document.getElementById("id-supply").value);
                connection.on('data', function(data)
                {
                    console.log(data);
                    document.getElementById("demo").innerHTML = data;
                });
                setInterval(score_dispatch, 1000, connection);
                navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then( 
                function(stream)
                {
                    console.log(document.getElementById("id-supply").value);
                    call = peer.call(document.getElementById("id-supply").value, stream);
 
                    call.on('stream', function(stream)
                    {
                        video = document.getElementById('sendvidshere');
                        video.srcObject = stream;
                        video.autoplay= true;
                    });
                }).catch(() => {});
            };