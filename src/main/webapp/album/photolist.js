$(document).ready(function() {
    $('#filelist').DataTable( {
        "ajax": '/webapp_demo/file_tran/list',
        "displayLength": 25
    } );
} );