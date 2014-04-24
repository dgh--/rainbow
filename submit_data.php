<?php

// just wrote a quick basic PHP script to act as a backend;
// TODO:  rewrite this with Python & Flask when I have time

$filename = "postdata.json";
$handle = fopen($filename, "wb");
fwrite($handle, $_POST['json']);
fclose($handle);


