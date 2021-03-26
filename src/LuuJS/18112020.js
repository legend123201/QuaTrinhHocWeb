
$(document).ready(function () {
  const products = [
    {
      "id": 1,
      "name": "Brocolli - 1 Kg",
      "price": 120,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg",
      "category": "vegetables"
    },
    {
      "id": 2,
      "name": "Cauliflower - 1 Kg",
      "price": 60,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg",
      "category": "vegetables"
    },
    {
      "id": 3,
      "name": "Cucumber - 1 Kg",
      "price": 48,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg",
      "category": "vegetables"
    },
    {
      "id": 4,
      "name": "Beetroot - 1 Kg",
      "price": 32,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/beetroot.jpg",
      "category": "vegetables"
    },
    {
      "id": 5,
      "name": "Carrot - 1 Kg",
      "price": 56,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/carrots.jpg",
      "category": "vegetables"
    },
    {
      "id": 6,
      "name": "Tomato - 1 Kg",
      "price": 16,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/tomato.jpg",
      "category": "vegetables"
    },
    {
      "id": 7,
      "name": "Beans - 1 Kg",
      "price": 82,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/beans.jpg",
      "category": "vegetables"
    },
    {
      "id": 8,
      "name": "Brinjal - 1 Kg",
      "price": 35,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/brinjal.jpg",
      "category": "vegetables"
    },
    {
      "id": 9,
      "name": "Capsicum",
      "price": 60,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/capsicum.jpg",
      "category": "vegetables"
    },
    {
      "id": 10,
      "name": "Mushroom - 1 Kg",
      "price": 75,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/button-mushroom.jpg",
      "category": "vegetables"
    },
    {
      "id": 11,
      "name": "Potato - 1 Kg",
      "price": 22,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/potato.jpg",
      "category": "vegetables"
    },
    {
      "id": 12,
      "name": "Pumpkin - 1 Kg",
      "price": 48,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/pumpkin.jpg",
      "category": "vegetables"
    },
    {
      "id": 13,
      "name": "Corn - 1 Kg",
      "price": 75,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/corn.jpg",
      "category": "vegetables"
    },
    {
      "id": 14,
      "name": "Onion - 1 Kg",
      "price": 16,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/onion.jpg",
      "category": "vegetables"
    },
    {
      "id": 15,
      "name": "Apple - 1 Kg",
      "price": 72,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/apple.jpg",
      "category": "fruits"
    },
    {
      "id": 16,
      "name": "Banana - 1 Kg",
      "price": 45,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/banana.jpg",
      "category": "fruits"
    },
    {
      "id": 17,
      "name": "Grapes - 1 Kg",
      "price": 60,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/grapes.jpg",
      "category": "fruits"
    },
    {
      "id": 18,
      "name": "Mango - 1 Kg",
      "price": 75,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/mango.jpg",
      "category": "fruits"
    },
    {
      "id": 19,
      "name": "Musk Melon - 1 Kg",
      "price": 36,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/musk-melon.jpg",
      "category": "fruits"
    },
    {
      "id": 20,
      "name": "Orange - 1 Kg",
      "price": 75,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/orange.jpg",
      "category": "fruits"
    },
    {
      "id": 21,
      "name": "Pears - 1 Kg",
      "price": 69,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/pears.jpg",
      "category": "fruits"
    },
    {
      "id": 22,
      "name": "Pomegranate - 1 Kg",
      "price": 95,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/pomegranate.jpg",
      "category": "fruits"
    },
    {
      "id": 23,
      "name": "Raspberry - 1/4 Kg",
      "price": 160,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/raspberry.jpg",
      "category": "fruits"
    },
    {
      "id": 24,
      "name": "Strawberry - 1/4 Kg",
      "price": 180,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/strawberry.jpg",
      "category": "fruits"
    },
    {
      "id": 25,
      "name": "Water Melon - 1 Kg",
      "price": 28,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/water-melon.jpg",
      "category": "fruits"
    },
    {
      "id": 26,
      "name": "Almonds - 1/4 Kg",
      "price": 200,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/almonds.jpg",
      "category": "nuts"
    },
    {
      "id": 27,
      "name": "Pista - 1/4 Kg",
      "price": 190,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/pista.jpg",
      "category": "nuts"
    },
    {
      "id": 28,
      "name": "Nuts Mixture - 1 Kg",
      "price": 950,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/nuts-mixture.jpg",
      "category": "nuts"
    },
    {
      "id": 29,
      "name": "Cashews - 1 Kg",
      "price": 650,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/cashews.jpg",
      "category": "nuts"
    },
    {
      "id": 30,
      "name": "Walnuts - 1/4 Kg",
      "price": 170,
      "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/walnuts.jpg",
      "category": "nuts"
    }
  ];

  Render(products);

  //đang bấm nhưng bỏ phím ra ko giữ nữa
  $(".search-input").keyup(function (e) {
    console.log(e.target.value); //cách 1, e.target.value là 1 string
    console.log($(".search-input").val()); //cách 2
    let strMatch = new RegExp(e.target.value, 'ig'); // i là insensitive, nghĩa là ko phân biệt hoa thường, g là global, nghĩa là thay đổi tất cả
    let matchArr = products.filter((val, index) => { //lọc ra những cái nào có strMatch
      /* cách của thầy
      //return val.name.toLowerCase().includes(e.target.value.toLowerCase());
      */

      return val.name.match(strMatch); //include ko dùng regexp đc?
    }).map((val, index) => { //thay thế tất cả các ptu vừa tìm đc bằng chữ đỏ
      /* cách của thầy
      // const newName = val.name
      //   .split(e.target.value)
      //   .join( `<span style="color: red;">${e.target.value}</span>`);
      */

      const newName = val.name.replace(strMatch, MatchStr);
      //có thể dùng function ở hàm replace, tham số là giá trị đang đc thay đổi, làm như thế này thì từ nào đang ghi hoa vẫn ghi hoa, từ nào ghi thường vẫn ghi thường sau khi replace
      function MatchStr(match) {
        return `<span style="color: red;">${match}</span>`;
      }
      return { ...val, name: newName }; //phải để name: newName ở cuối để nó đè lên cái name cũ (của ...val) đằng trc (chưa hiểu thì qua file objects xem lý thuyết)
    })

    renderProducts(matchArr);
  });
});

function Render(products) {
  //xoá mảng product trong html
  $(".row").empty();

  //load data ra giao diện
  products.map((val) => {
    $(
      `
            <div class="col-lg-3">
            <div class="item">
                <div class="image">
                    <img src="${val.image}"
                        alt="">
                </div>
                <div class="content">
                    <p class="name">
                        ${val.name}
                    </p>
                    <p class="price">
                        $${val.price}
                    </p>
                    <button>ADD TO CARD</button>
                </div>

            </div>
        </div>
            `
    ).appendTo(".row");
  })
}

function renderProducts(products) {
  $(".list-products").empty();
  products.map((val) => {
    $(
      `
      <li>${val.name}</li>
      `
    ).appendTo(".list-products");
  });
}