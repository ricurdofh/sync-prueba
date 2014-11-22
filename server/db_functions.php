<?php 

class DB_Functions {
    private $db;
    private $link;

    function __construct() {
        include_once './db_connect.php';
        $this->db = new DB_Connect();
        $this->link = $this->db->connect();
    }

    function __destruct() {}

    public function storeUser($nombre, $apellido, $BDBid) {
        $query = "INSERT INTO tabla (nombre, apellido, BDBid) VALUES ('$nombre', '$apellido', '$BDBid')";
        $result = $this->link->query($query) or die("Error in the consult.." . mysqli_error($this->link));

        if ($result){
            return true;
        } else {
            if (mysqli_errno() == 1062) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function getAllData() {
        $result = mysqli_query($this->link, "SELECT * FROM tabla");
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    }

    public function checkLogin($user, $pass) {
        $query = "SELECT * FROM login WHERE user = '$user' and pass = '$pass'";
        $result = mysqli_query($this->link, $query) or die("Error in the consult.." . mysqli_error($this->link));
        if(mysqli_num_rows($result) > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getDataToSync($last_sync) {
        $result = mysqli_query($this->link, "SELECT * FROM tabla WHERE last_sync_date > '$last_sync'");
        $all = array();
        while ($row = $result->fetch_assoc()) {
            array_push($all, $row);
        }
        return $all;
    }
}

?>