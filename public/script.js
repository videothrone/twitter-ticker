// Create a json file containing the text and hrefs of the links in your ticker project and remove the links from your html file.
// When the page loads, make an ajax request to fetch the text and hrefs and, once you have them, insert the links into the page.
// Once the links are in the page, start the animation. To test this you should use http-server.

(function() {
    var headlines = $("#headlines");
    var links = $("a");
    var left = headlines.offset().left;
    var myReq;

    moveHeadlines();

    $.ajax({
        url: "/data.json",
        method: "GET",
        success: function(response) {
            // console.log("response: ", response);
            var myHtml = "";

            for (var i = 0; i < response.length; i++) {
                // console.log("response[i]: ", response[i]);
                var x =
                    '<a href="' +
                    response[i].url +
                    '">' +
                    response[i].text +
                    "<a>";
                myHtml = myHtml + x;
            }

            $("#headlines").html(myHtml);
        },
        error: function(err) {
            console.log("error: ", err);
        }
    });

    function moveHeadlines() {
        if (left <= -$("links[0]").outerWidth()) {
            left += $("links[0]").outerWidth();
            headlines.append(links[0]);
        }
        var start = left--;
        headlines.eq(0).css({
            left: start + "px"
        });
        myReq = requestAnimationFrame(moveHeadlines);
    }

    headlines.on("mouseenter", function() {
        cancelAnimationFrame(myReq);
    });

    headlines.on("mouseleave", function() {
        requestAnimationFrame(moveHeadlines);
    });
})();
