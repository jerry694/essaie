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
        res.json(await songService.getListOfSongs(req.query.page));
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