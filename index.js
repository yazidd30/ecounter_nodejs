var express = require('express');
var app = express();
var logger = require('morgan'); //memuat fungsi middleware morgan pada object logger dan mengeset module log dengan format developer
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');

var expressku   = require('./routes/expressku');
var adminku     = require('./routes/adminku');


var conn = require('express-myconnection');
var mysql  = require('mysql');

app.set('port', process.env.port || 3000); //pengenalan setting port
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use('/public',express.static(__dirname + '/public')); //direktori file template public
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());

app.use(
    conn(mysql, {
        host: 'localhost',
        user: 'root',
        password: '',
        port : 3306,
        database: 'ecommerce' // ini bener nama db-nya? iya bnar, oalah salah yaa itu yg buat latihan kmrin wait, sudah di tambahakan
    }, 'single')
);

app.use(
    session({
        secret: 'yazid',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 120000 }
    })
);

app.get('/', function(req, res){
    res.send('Server is Running on port ' + app.get('port'));
    // res.send('Server nya sudah Running..!');
});

app.get('/ecounter_nodejs', expressku.home);
app.get('/ecounter_nodejs/products_detail/:id_product', expressku.products_detail);
// app.get('/express', expressku.home);
// app.get('/express/news', expressku.news);
// app.get('/express/about', expressku.about);
// app.get('/express/contact', expressku.contact);
// app.get('/express/gallery', expressku.gallery);
// app.get('/express/news_detail/:id_news', expressku.news_detail);
// app.get('/express/search_news', expressku.searchnews);
app.get('/ecounter_nodejs/admin', adminku.login), adminku.login;;
app.get('/ecounter_nodejs/admin/login', adminku.login);
app.get('/ecounter_nodejs/admin/home', adminku.home);
app.get('/ecounter_nodejs/admin/add_news', adminku.add_news);
app.get('/ecounter_nodejs/admin/edit_product/:id_product', adminku.edit_product);
app.get('/ecounter_nodejs/admin/delete_news/:id_news', adminku.delete_news);
app.get('/ecounter_nodejs/admin/logout', adminku.logout);

app.post('/ecounter_nodejs/admin/login', adminku.login); 
app.post('/ecounter_nodejs/admin/add_news', adminku.prosess_add_news); 
app.post('/ecounter_nodejs/admin/edit_news/:id_news', adminku.prosess_edit_news); 


app.listen(app.get('port'), function(){
    console.log('Server is Running on port ' + app.get('port'));
});