
exports.respondWithName = (req, res) => {
    res.render('index', { name: 'Pekka Lehtola' });
};

exports.respondMedia = (req, res) => {
    res.render('media', { image:"https://pbs.twimg.com/profile_images/1380422774116728836/h4wmLjKT.jpg"});
}

exports.respondContacts = (req, res) => {
    res.render('contact', { phone: 123495823123 });
};