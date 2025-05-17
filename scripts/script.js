function setHeaderBackground(headerBg, footnoteLocation, footnoteYear, i) {
    headerBg.css("background-image", `linear-gradient(to top, rgb(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url("${headers[i]['url']}")`);
    footnoteLocation.text(headers[i]["location"]);
    footnoteYear.text(headers[i]["year"]);
}

function filterPhotos(ogPhotos, year, country) {
    let filtered = ogPhotos;
    if (year != "All") {
        filtered = filtered.filter((photo) => { return photo["year"] == year});
    }
    if (country != "All") {
        filtered = filtered.filter((photo) => { return photo["country"] == country});
    }
    // const filtered = ogPhotos.filter((photo) => { return photo[attr] == value});
    return filtered;
}

function comparePhotos(b, a) {
    if (a['score'] != b['score']) {
        return a['score'] - b['score'];
    }
    if (a['country'] != b['country']) {
        return a['country'].localeCompare(b['country']);
    }
    if (a['city'] != b['city']) {
        return b['city'].localeCompare(a['city']);
    }
    if (a['year'] != b['year']) {
        return a['year'] - b['year'];
    }
    return b['url'].localeCompare(a['url']);
}

function showPhotos(photos) {
    for (let i=0; i < photos.length; i++) {
        photo = photos[i];
        if (i % 3 == 0) {
            $("#photo-grid-wrapper").append(`<div class="row" id="row${i/3}"></div>`);
        }
        let block = $('<div class="block"></div>');
        let card = $('<div class="card"></div>');

        let cardBg = $('<div class="card-bg"></div>')
        cardBg.css("background-image", `url("${photo['url']}")`);
        card.append(cardBg);

        let cardOverlay = $('<div class="card-overlay"></div>')
        card.append(cardOverlay);

        let cardFootnote = $('<div class="card-footnote"></div>')
        let cardFootnoteLocation = $(`<p>${photo['city']}, ${photo['country']}</p>`)
        let cardFootnoteYear = $(`<p>${photo['year']}</p>`)
        cardFootnote.append(cardFootnoteLocation);
        cardFootnote.append(cardFootnoteYear);
        card.append(cardFootnote);

        card.mouseover(function() {
            card.css("transform", "scale(1.1)");
            cardOverlay.css("opacity", 0);
            cardFootnote.css("opacity", 1);
        })
        card.mouseout(function() {
            card.css("transform", "scale(1)");
            cardOverlay.css("opacity", 0.2);
            cardFootnote.css("opacity", 0);
        })

        block.append(card);
        $(`#row${Math.floor(i/3)}`).append(block);
        
        let modal = $('#img-modal');
        let modalContent = $('.modal-content');
        let modalCaption = $('#modal-caption');
        card.on("click", function() {
            modal.css("display", "block");
            modalContent.attr("src", photos[i]['url']);
            modalCaption.text(`${photos[i]['city']}, ${photos[i]['country']}, ${photos[i]['year']}. ${photos[i]['caption']}`);
        });
        let closeBtn = $('#close-btn');
        closeBtn.on("click", function() {
            modal.css("display", "none");
        });
    }
}

$(document).ready(function(){
    // Carousel
    let headerBg = $("#header-bg");
    let footnoteLocation = $("#footnote-location");
    let footnoteYear = $("#footnote-year");
    setHeaderBackground(headerBg, footnoteLocation, footnoteYear, 0);
    $(".dot").each(function(index) {
        $(this).on("click", function() {
            $(".dot-active").removeClass("dot-active");
            $(this).addClass("dot-active");
            headerBg.css("opacity", 0);
            footnoteLocation.css("opacity", 0);
            footnoteYear.css("opacity", 0);
            setTimeout(function() {
                setHeaderBackground(headerBg, footnoteLocation, footnoteYear, index);
                headerBg.css("opacity", 1);
                footnoteLocation.css("opacity", 1);
                footnoteYear.css("opacity", 1);
            }, 250);
        })
    });

    // Filters
    let filterYear = $("#filter-year");
    let years = [...new Set(photos.map(item => item.year))].sort((a, b) => a - b);
    years.forEach((elem) => {
        let badge = $(`<div class="badge badge-year">${elem}</div>`);
        filterYear.append(badge);
    })
    $(".badge-year").each(function() {
        $(this).on("click", function() {
            let year = $(this).text();
            let country = $(".badge-country.badge-active").text();
            $(".badge-year.badge-active").removeClass("badge-active");
            $(this).addClass("badge-active");
            $("#photo-grid-wrapper").css("opacity", 0);
            setTimeout(function() {
                $("#photo-grid-wrapper").empty();
                let filteredPhotos = filterPhotos(photos, year, country);
                console.log(filteredPhotos.length);
                showPhotos(filteredPhotos);
                $("#photo-grid-wrapper").css("opacity", 1);
            }, 300);
        });
    });

    let filterCountry = $("#filter-country");
    let countries = [...new Set(photos.map(item => item.country))].sort();
    countries.forEach((elem) => {
        let badge = $(`<div class="badge badge-country">${elem}</div>`);
        filterCountry.append(badge);
    })
    $(".badge-country").each(function() {
        $(this).on("click", function() {
            let country = $(this).text();
            let year = $(".badge-year.badge-active").text();
            $(".badge-country.badge-active").removeClass("badge-active");
            $(this).addClass("badge-active");
            $("#photo-grid-wrapper").css("opacity", 0);
            setTimeout(function() {
                $("#photo-grid-wrapper").empty();
                let filteredPhotos = filterPhotos(photos, year, country);
                console.log(filteredPhotos.length);
                showPhotos(filteredPhotos);
                $("#photo-grid-wrapper").css("opacity", 1);
            }, 300);
        });
    });

    // Gallery
    photos.sort(comparePhotos);
    showPhotos(photos);

    // About
    $(".about-link").attr("target", "_blank");
    $(".about-link").attr("rel", "noopener noreferrer");
});