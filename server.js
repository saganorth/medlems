import express from 'express' 
import { MongoClient, ObjectId} from "mongodb"
const port = 3000;
const app = express();


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static('public'));

const client = new MongoClient('mongodb://127.0.0.1:27017'); 
await client.connect();
const db = client.db('club');
const membersCollection = db.collection('member');



app.get('/member', async (req, res) => {
    let sort = req.query.sort || '0';
    let member;
  
    if (sort === '1') {
      member = await membersCollection.find({}).sort({ name: 1 }).toArray();
    } else if (sort === '-1') {
      member = await membersCollection.find({}).sort({ name: -1 }).toArray();
    } else {
      member = await membersCollection.find({}).toArray();
    }
  
    res.render('member', { member, sort });
  });



   
   app.get('/start', async (req, res) => {

    const start = await membersCollection.find({}).toArray();
    res.render('start', { start});
   });

   app.get('/forum', async (req, res) => {
    const forum = await membersCollection.find({}).toArray();
    res.render('forum', { forum });
   });
   app.get('/acticiy', async (req, res) => {

    const acticiy = await membersCollection.find({}).toArray();
    res.render('acticiy', { acticiy});
   });


   app.get('/user/:id', async (req, res) => {
    try {
      const user = await membersCollection.findOne({ _id: new ObjectId(req.params.id) });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      res.render('user', {
        name: user.name,
        email: user.email,
        tel: user.tel,
        added: user.added,
        favorite: user.favorite,
        id: user._id
      });
    } catch (error) {
      console.error(error);
      res.redirect('/start');
    }
   }); 

   app.post('/member/create', async (req, res) => {
    await membersCollection.insertOne(req.body);
    res.redirect('/member');
   });
   app.post('/user/delete/:id', async (req, res) => {
    console.log('here:', req.params)
     await membersCollection.deleteOne({ _id: new ObjectId(req.params.id)});
     res.redirect('/member');

   });
   
   app.post('/user/update/:id', async (req, res) => {
    console.log('here:', req.params, req.body)
    const id = req.params.id;
    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      tel: req.body.tel,
      favorite: req.body.favorite,
      added: req.body.added
    };
    await membersCollection.updateOne({ _id:new ObjectId(id) }, { $set: updatedData });
    res.redirect('/member');
  });
  
  
   
   app.listen(port, () => console.log(`Listening on ${port}`));