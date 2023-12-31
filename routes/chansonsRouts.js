const express = require('express')
const multer = require('multer');
const path = require('path');

const os = require('os');
const ifaces = os.networkInterfaces();

let serverIP = '127.0.0.1';

Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
        if (iface.family === 'IPv4' && !iface.internal) {
            serverIP = iface.address;
        }
    });
});



const app = express();
const fs = require('fs').promises;




const storage = multer.diskStorage({
    destination: '.',
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.' + file.mimetype.split('/')[1]); 
    }
  });
  
  const upload = multer({ storage });
  




let router = express.Router()
const songService = require('../services/Chansons.service')

router.get('/', async function (req, res, next) {
    try {
        res.json([{
            "id": 1,
            "titreChanson": "Coco Androide",
            "nomArtiste": "LikFraiz",
            "nomsaArtistescCollaborateurs": null,
            "pochetteAlbum": "https://source.boomplaymusic.com/group10/M00/11/16/50d8e8212e2b41d0b6a66ebf3a0ad6f1_464_464.jpg",
            "chansonUrl": "NYXIA.mp3",
            "lyrics": "Coco android coca le n'ta inside the table\nMême intension que Diogo Jota inside the box\naucun poto n'a assez riz pour buy mes blèmes\nJ'crois que... la vrai vie ne sera jamais comme dans la mposs\nTu fais donc quoi? a ton avis!\nOn mouille le maillot sans baisser short!\nY'a pas de gri gri sous mon habit!\nMais fais comme un nkassa je perd par le nord\n\n\nA sans a l'heure sur le benskin\nburberry sur la griffe du slim\nallons a deux ses mon code puk'puk\nSans calé c'est son code pin (neuh)\nJe rêve de monarchie de chine\nToi tu rêves de contrefaçon de jeans\n2-3-7 orijin, on peux pas s'arrêter on a pas l'usine\nD'un coté j'ai la cote a toi de faire le choix\nOn pèse sur la balance sans prendre le poids\nSuffit que tu sois cline pour qu'on te pointe du doigts\nY'a pas de combi si tu ndem tu va choi\nTrès fort comme le sky dans le sachet\nN'arrivent pas croire que je suis camerounais\nElle m'immortalise parce que jamais on sais\nToi t'es médiatisé mais aucun effet",
            "prix": "0.00",
            "created_at": "2023-12-28T19:44:55.000Z",
            "updated_at": "2023-12-29T11:57:47.000Z"
        }]);
    } catch (err) {
        console.error(`Error while getting songs`, err.message);
        next(err);
    }
});

router.get('/one/:id', async function (req, res, next) {
    try {
        const songId = req.params.id;
        res.json(await songService.getSongById(songId));
    } catch (err) {
        console.error(`Error while getting song by ID`, err.message);
        next(err);
    }
});


  router.post('/addSong', upload.any(), async function(req, res){
    try {
      const newSongData = req.body;
      console.log('newSongData:', newSongData);
  
      if (req.files && req.files.length > 0) {
        const pochetteAlbumPath = req.files[0].path; 
        const chansonUrlPath = req.files[1].path; 

        
        const storageDirectory = './assets/medias';

        
        const pochetteAlbumDestination = `${storageDirectory}/${req.files[0].originalname}`;
        const chansonUrlDestination = `${storageDirectory}/${req.files[1].originalname}`;

        await fs.rename(pochetteAlbumPath, pochetteAlbumDestination);
        await fs.rename(chansonUrlPath, chansonUrlDestination);

        
        newSongData.pochetteAlbum = `http://${serverIP}:3000/assets/medias/${req.files[0].originalname}`;
        newSongData.chansonUrl = `http://${serverIP}:3000/assets/medias/${req.files[1].originalname}`;
  
        console.log('File paths:', newSongData.pochetteAlbum, newSongData.chansonUrl);
        const result = await songService.addSong(newSongData);
        res.json(result);
      } else {
        console.log('Files do not exist in the request.');
        res.status(400).json({ error: 'Files do not exist in the request.' });
      }
    } catch (err) {
      console.error(`Error while adding a new song`, err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


router.put('/:id',upload.any(), async function (req, res, next) {
    
    try {
        
        const songId = req.params.id;
        const updatedSongData = req.body;
        console.log('updatedSongData:', updatedSongData);
        const pochetteAlbumPath = req.files[0].path; 
        const chansonUrlPath = req.files[1].path; 

        
        const storageDirectory = './assets/medias';

        
        const pochetteAlbumDestination = `${storageDirectory}/${req.files[0].originalname}`;
        const chansonUrlDestination = `${storageDirectory}/${req.files[1].originalname}`;

        await fs.rename(pochetteAlbumPath, pochetteAlbumDestination);
        await fs.rename(chansonUrlPath, chansonUrlDestination);

        
        updatedSongData.pochetteAlbum = `http://${serverIP}:3000/assets/medias/${req.files[0].originalname}`;
        updatedSongData.chansonUrl = `http://${serverIP}:3000/assets/medias/${req.files[1].originalname}`;
  
        console.log('File paths:', updatedSongData.pochetteAlbum, updatedSongData.chansonUrl);
        const result = await songService.updateSong(songId, updatedSongData);
        res.json(result);
    } catch (err) {
        console.error(`Error while updating a song`, err.message);
        next(err);
    }
});


router.delete('/:id', async function (req, res, next) {
    try {
        const songId = req.params.id;
        const result = await songService.deleteSong(songId);
        res.json(result);
    } catch (err) {
        console.error(`Error while deleting a song`, err.message);
        next(err);
    }
});

module.exports = router;
