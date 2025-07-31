fetch('js/products.json')
    .then(response => response.json())
    .then(data =>{
        const myProductsSwiper = document.querySelectorAll('.swiper-wrapper');
        myProductsSwiper.forEach(swiper => {
            data.forEach(item => {
                if(item.old_price){
                    swiper.innerHTML += `
                        <div class="swiper-slide">
                            <div class="card">
                                <div class="images">
                                    <div class="sale">%${item.sale}</div>
                                    <img class="img-hover" src="${item.img_hover}" alt="" srcset="">
                                    <img src="${item.img}" alt="" srcset="">
                                </div>
                                <div class="text">
                                    <h3>${item.name}</h3>
                                </div>
                                <div class="rates">
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star-half-stroke"></i>
                                </div>
                                <div class="price">
                                    <h3 class="new">$${item.price}</h3>
                                    <h3 class="old">$${item.old_price}</h3>
                                </div>
                                <div class="icons">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                    <i class="fa-solid fa-heart"></i>
                                    <i class="fa-solid fa-share"></i>
                                </div>
                            </div>
                        </div>
                    `
            }
        });
        })
        new Swiper('.myProductsSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.products-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
                1200: { slidesPerView: 5, spaceBetween: 30 },
            },
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            loop: true,
        });
    });