$(document).ready(function () {
  $(".owl-carousel").owlCarousel(
    //những option bên dưới ở chỗ api web owl carousel
    {
      items: 1,
      margin: 20,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
      center: true,
      nav: true,
      navText: [
        '<i class="fas fa-chevron-left"></i>',
        '<i class="fas fa-chevron-right"></i>',
      ],
      dots: true,
      dotsEach: 2,
    }
  );
});

/*
//jqdoc
$(function () {
    //window là object, là cái web của mình
    $(window).scroll(function () {
        console.log($(window).scrollTop());//in ra vị trí thanh scroll hiện tại
        const position = $(window).scrollTop();
        if(position > 300){
            $("header").addClass("fixed");
            $(".toTop").addClass("fixed");
        }else{
            $("header").removeClass("fixed");
            $(".toTop").removeClass("fixed");
        }

        //add class thì gọn hơn css get set nếu như muốn thay đổi nhiều thuộc tính css
        // //$(".toTop").css("height")
        // if(position > 300){
        //     $(".toTop").css("opacity", "1");
        // }else{
        //     $(".toTop").css("opacity", "0");
        // }
    });
});
*/
