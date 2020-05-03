$(document).ready(function () {
    $('#sideButton').on('click', function () {
        $('.sideMenu').toggleClass('active');
        });
    $('#sideClose').on('click', function () {
        $('.sideMenu').toggleClass('active');
        });
        // console.log($(".nav-item"));
        var width = $(window).width();
        if(width < 500){
            $(".fa-eye").parent().parent().hide();
            $(".fa-area-chart").parent().parent().hide();
        }

    $(window).resize(function(){
        var width = $(this).width();
        // console.log(width);
        if(width < 500){
            $(".fa-eye").parent().parent().hide();
            $(".fa-area-chart").parent().parent().hide();
            
        }else{
            $(".fa-eye").parent().parent().show();
            $(".fa-area-chart").parent().parent().show();
        }
    });
});

