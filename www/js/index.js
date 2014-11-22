/*
Desarrollado por Ricardo Vargas
*/
;(function($){
    var self = $.mobile.app = {
        connection : null,

        init : function() {

            $.mobile.defaultPageTransition = "slidefade";

            $( document ).on( "pagecreate", function() {

                //self.openDB();

                $( "#page1" ).on( "pagecreate", function() {
                    var TABLES_TO_SYNC = [{tableName : 'tabla'}],
                    //server = 'http://localhost/sync-prueba/insertuser.php',
                    //server = 'http://192.168.0.100/sync-prueba/insertuser.php',
                    server = 'http://invimars.com/syncprueba/insertuser.php',
                    sync_info = {
                        user : $('#user').val(),
                        pass : $('#pass').val()
                    };

                    self.openDB();
                    
                    $("#guardar").off().click(function() {
                        self.createTable();
                    });

                    $("#page3").off().on('pageshow', function(){
                        self.readData();
                    });

                    $("#sync").off().click(function() {
                        self.sync();
                    });

                    DBSYNC.initSync(TABLES_TO_SYNC, self.connection, sync_info, server, function(){});

                });
                
                $('#ingreso').off().click(function() {
                    self.validate();
                });


            });
        },

        openDB : function() {
            self.connection = window.openDatabase("Sync", "1.0", "Prueba de sync", 200000);
            self.transaction(function(tx){
                /*tx.executeSql('DROP TABLE IF EXISTS tabla');
                tx.executeSql('DROP TABLE IF EXISTS sync_info');
                tx.executeSql('DROP TABLE IF EXISTS new_elem');*/
                tx.executeSql('CREATE TABLE IF NOT EXISTS tabla (id INTEGER PRIMARY KEY ASC, nombre VARCHAR(20), apellido VARCHAR(20), BDBid TEXT, last_sync_date TEXT, last_sync INTEGER)');
            });
        },

        transaction : function(fn,err,suc) {
            if (self.connection === null){
                self.openDB();
            }
            self.connection.transaction(fn,err,suc);
        },

        createTable : function(){
            var datos = [
            $("#nombre").val(),
            $("#apellido").val()
            ];

            self.transaction(function(tx){
                tx.executeSql('INSERT INTO tabla (nombre, apellido) VALUES (?, ?)', datos);
            }, self.error, function(){
                $.mobile.changePage("#page3");
                document.getElementById("frm").reset();
                console.log("Procesado con éxito!");
            });
        },

        readData : function(){
            self.transaction(function(tx){
                tx.executeSql('SELECT * FROM tabla', [], function(tx, rs){
                    var len = rs.rows.length,
                            i = 0,
                            item;
                    if (len > 0){
                        $("#lista").empty();
                        for (; i < len; i += 1) {
                            item = rs.rows.item(i);
                            $("#lista").append("<li>" + item.nombre + " " + item.apellido + "</li>");
                        }
                    }
                });
            },self.error);
        },

        error : function(err){
            console.error("Error procesando el query: ",err);
        },

        sync : function() {
            $('<input>')
            .appendTo('#uiProgress')
            .attr({'name':'slider','id':'slider','data-highlight':'true','min':'0','max':'100','value':'50','type':'range'})
            .slider({create: function( event, ui ) {
                $(this).parent().find('input').hide();
                $(this).parent().find('input').css('margin-left','-9999px'); // Fix for some FF versions
                $(this).parent().find('.ui-slider-track').css('margin','0 15px 0 15px');
                $(this).parent().find('.ui-slider-handle').hide();
            }
            });

            DBSYNC.syncNow(self.callBackSyncProgress, null, null, function(result) {
                var nuevoEnv = result.nbUpdated === 1 ? ' nuevo dato enviado ' : ' nuevos datos enviados ',
                    nuevoRec = result.nbSent === 1 ? ' nuevo dato enviado ' : ' nuevos datos enviados ',
                    mensaje = '';
                console.log('****************************************');
                console.log(result);
                console.log('****************************************');
                if (result.syncOK === true && result.nbSent > 0) {
                    self.showInfo('#uiProgress', 'Datos sincronizados correctamente!', 'green');
                    if (result.nbUpdated === 1) {
                        mensaje = result.nbSent + nuevoRec + ' al servidor y ' + result.nbUpdated + ' recibido.';
                    } else if (result.nbUpdated > 1) {
                        mensaje = result.nbSent + nuevoRec + ' al servidor y ' + result.nbUpdated + ' recibidos.';
                    } else {
                        mensaje = result.nbSent + nuevoRec + ' al servidor.';
                    }
                    self.showInfo('#sincronizados', mensaje, 'white');
                    console.log('Synchronized successfully');

                    // Si el bandWidth está en true: result.codeStr === 'nothingToSend'
                    // En este caso se hace así para poder sincronizar datos desde el servidor 
                    // sin que se ingresen nuevos en el cliente.
                } else if(result.nbUpdated === 0 && result.nbSent === 0){
                    self.showInfo('#uiProgress', 'No hay datos nuevos para sincronizar!', 'yellow');
                } else if(result.codeStr === 'chkServer'){
                    self.showInfo('#uiProgress', 'Buscando nuevos datos en el servidor.', 'white');
                    self.showInfo('#sincronizados', result.nbUpdated + nuevoEnv + ' desde el servidor.', 'white');
                } else {
                    self.showInfo('#uiProgress', 'Error al sincronizar.', 'red');
                }

                $(".ui-slider").remove();
            });
        },

        callBackSyncProgress : function(message, percent, msgKey) {
            self.setProgressValue("#slider", percent);
            
            //$('#uiProgress').html(message+' ('+percent+'%)');
        },

        setProgressValue : function(id, value) {
            $(id).val(value);
            $(id).slider("refresh");
        },

        validate : function() {
            if ($('#user').val() === 'admin' && $('#pass').val() === '123') {
                $.mobile.changePage( $("#page1"));
            }
            else {
                $('#error')
                .text("Usuario o password incorrectos!")
                .css('text-align','center')
                .css('color', 'red');
            }
        },

        showInfo: function(elem, mensaje, color) {
            $(elem)
            .text(mensaje)
            .fadeOut(3000, function(){
                $(this).empty();
                $(this).show();
            })
            .css('text-align','center')
            .css('color', color);          
        }


    };

    $.mobile.app.init();

}(jQuery));