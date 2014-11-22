<?php
class DB_Connect {

    function __construct() {}

    function __destruct() {}

    public function connect() {
        require_once 'config.php';
        $con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD,DB_DATABASE) or die("Error " . mysqli_error($con));
        //mysqli::select_db(DB_DATABASE);
        return $con;
    }

    public function close(){
        mysql_close();
    }
}

?>