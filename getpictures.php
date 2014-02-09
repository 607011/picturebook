<?php
header("Content-type", "text/json");
$filenames = array();
$dir = opendir("pictures");
while (false !== ($file = readdir($dir))) {
  if (preg_match("/\.(png|jpg|gif)$/", $file))
    array_push($filenames, $file);
}
closedir($dir);
echo json_encode($filenames);
?>