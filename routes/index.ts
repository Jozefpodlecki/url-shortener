import homeController from './../controllers/home'
import shorturlController from './../controllers/shorturl'

export default (app: any) => {

  app.post('/api/shorturl/new', shorturlController.addUrl);  
  app.get('/api/shorturl/:id', shorturlController.getUrl);
  app.get("/", homeController.get);
}