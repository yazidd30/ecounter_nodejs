var multer = require('multer');

exports.login = function(req, res){
    var message = '';
    var sess = req.session;
    var md5 = require('md5');

    if(req.method == 'POST'){
        // jika method post maka jalankan auth login
        // 1. ambil nilai dari atribut pada body form
        var post = req.body;
        // 2. ambil nilai dari atribut name dan password dari form input username
        var name = post.username;
        var pass = md5(post.password);
        
        // 3. koneksikan dan buat query data admin
        req.getConnection(function(err, connect){
            var sql = "SELECT id_admin, username, name, admin_level FROM admin_tbl WHERE username='"+name+"' AND password='"+pass+"'";
            //console.log(sql);
            var query = connect.query(sql, function(err, results){ 
                // console.log(results);
                if (results.length){ 
                    // Jika hasil quuery ada, daftarkan session ke halaaman home admin
                    req.session.adminId = results[0].id_admin;
                    req.session.admin = results[0];
                    console.log(results[0].id_admin); 
                    res.redirect('./home');
                }else{
                    // Jika Hasil query tidak ada maka akan di kembalikan ke layout form login
                    message = "User Tidak Ditemukan! Silahkan Coba lagi Cuy";
                    res.render('./admin/index', { 
                        message: message
                    });
                }
            });
        });
    }else{
        // jika method bukan POST makan tampilkan ke form login
   
        res.render('./admin/index', {
            message: message
        });
    }

}

exports.home = function(req, res){
    var admin = req.session.admin;
    var adminId = req.session.adminId;
    console.log('id_admin'+adminId);
    
    if(adminId == null){
        res.redirect('/ecounter_nodejs/admin/login');
        return;
    }

    req.getConnection(function(err,connect){
        var sql = "SELECT * FROM product ORDER BY createdate DESC";
        var query = connect.query(sql, function(err, results){
            // Jika koneksi dari query berhasil maka tampilkan show admin!
            res.render('./admin/home', {
                pathname : 'home',
                data : results
            });
        });
    });
}

exports.add_news = function(req, res){
    var admin = req.session.admin;
    var adminId = req.session.adminId;
    console.log('id_admin' + adminId);
    
    if(adminId == null){
        res.redirect('/ecounter_nodejs/admin/login');
        return;
    }

    res.render('./admin/home', {
        pathname : 'add_news'
    });
}

exports.prosess_add_news = function(req, res){
    var storage = multer.diskStorage({
        destination : './public/news_images',
        filename : function(req, file, callback){
            callback(null, file.originalname);
        }
    });

    var upload = multer({storage : storage }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err){
        if (err){
            return res.end('Error Uploading Image!');
        }
        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect){
            // Tangkap nilai atau value dari body (atribut name)
            var post = {
                title : req.body.title,
                description : req.body.description,
                images : req.file.filename,
                createdate : date
            }
            console.log(post); // Berfungsi untuk menampilkan data post di console

            var sql = "INSERT INTO product SET ?";
            var query = connect.query(sql, post, function(err, results){
                if(err){
                    console.log('Error input news : %', err);
                }
                req.flash('info', 'Sukses tambah data! Data has been Create! ');
                res.redirect('/ecounter_nodejs/admin/home');
            });
        });
    });
}

exports.edit_product = function(req, res){
    var admin = req.session.admin;
    var adminId = req.session.adminId;
    console.log('id_admin' + adminId);
    
    if(adminId == null){
        res.redirect('/ecounter_nodejs/admin/login');
        return;
    }
    
    var id_product = req.params.id_product; //menangkap parameter ID news yang dari link edit
    console.log(id_product);   
    req.getConnection(function(err, connect){
        var sql = "SELECT * FROM product WHERE id_product=?";
        var query = connect.query(sql, id_product, function(err, results){
            console.log(results);
            if(err){
                console.log('Error show product : %s', err);
            }
            res.render('./admin/home', {
                id_product : id_product,
                pathname : 'edit_product',
                data : results
            });
        });
    });
}

exports.prosess_edit_news = function(req, res){
    var id_news = req.params.id_news;
    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function(req, file, callback){
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage:storage}).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err){
        if(err){
            var image = req.body.image_old;
            console.log('Error uploading image!');
        }else if (req.file == undefined){
            var image = req.body.image_old;
        }else{
            var image = req.file.filename;
        }
        console.log(req.file);
        console.log(req.body);
        
        req.getConnection(function(err, connect){
            var post = {
                title : req.body.title,
                description : req.body.description,
                images : image,
                createdate : date
            }
            var sql = "UPDATE product SET ? WHERE  id_product=?";
            var query = connect.query(sql, [post, id_news], function(err, results){
                if (err){
                    console.log('Error Edit news! %s', err);
                }
                req.flash('info', 'Sukses update data! Data has been Update! ');
                res.redirect('/ecounter_nodejs/admin/home');
            });
        });
    });
}

exports.delete_news = function(req, res){
    var id_news = req.params.id_news;

    req.getConnection(function(err, connect){
        var sql = "DELETE FROM product WHERE id_product=?";
        var query = connect.query(sql, id_news , function(err, results){
            if (err){
                console.log('Error delete news!', err);
            }
            req.flash('info', 'Sukses Delete data! Data has been Delete! ');
            res.redirect('/ecounter_nodejs/admin/home');
        });
    });
}

exports.logout = function(req, res){
    req.session.destroy(function(err){
        res.redirect('/ecounter_nodejs/admin/login');
    });
}