export default {
  get: (req, res) => {
    const data = {
      currentYear: new Date().getFullYear(),
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      title: 'URL Shorterner Microservice' 
    };
    
    res.render('index', data)
  }
}