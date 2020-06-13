exports.home = function (req, res)
{
    req.getConnection(function (err, connect) {
        var query = connect.query('SELECT * FROM product', function (err, rows) {
            if (err) {
                console.log('Error message: %', err);
            }
            res.render('home', {
                page_title: "Exercises Ecommerce",
                data: rows
            });
        });
    });
}

exports.products_detail = function (req, res)
{
    var id_product = req.params.id_product;
    req.getConnection(function (err, connect) {
        var query = connect.query('SELECT * FROM product WHERE id_product=?', id_product, function (err, rows) {
            if (err) {
                console.log('Error message: %', err);
            }
            res.render('products_detail', {
                page_title: "Exercises Ecommerce - Products Detail",
                data: rows
            });
        });
    });
}

exports.about = function (req, res)
{
    res.render('about');
}

exports.contact = function (req, res)
{
    res.render('contact');
}

exports.gallery = function (req, res)
{
    res.render('gallery');
}

exports.search_news = function (req, res)
{
    res.render('search_news');
}