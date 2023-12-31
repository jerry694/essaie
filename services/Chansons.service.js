const db = require ('./db.service')
const helper = require('../helper')
const config = require('../config')


async function getListOfSongs(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * FROM chansons LIMIT ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta,
    };
}

async function getSongById(songId, page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * FROM chansons WHERE id = ?`,
        [songId]
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta,
    };
}

async function addSong(songData) {
    const { titreChanson, nomArtiste, nomsaArtistescCollaborateurs, pochetteAlbum, chansonUrl,lyrics, prix } = songData;
    const ArtistescCollaborateurs = nomsaArtistescCollaborateurs.split('\n').map(artist => artist.trim());


    const result = await db.query(
        'INSERT INTO chansons (titreChanson, nomArtiste, nomsaArtistescCollaborateurs, pochetteAlbum,chansonUrl ,lyrics, prix) VALUES (?, ?, ?, ?,?, ?, ?)',
        [titreChanson, nomArtiste, JSON.stringify(ArtistescCollaborateurs), pochetteAlbum,chansonUrl, lyrics, prix]
    );
    const newSongId = result.insertId;
    const newSong = await getSongById(newSongId);
    return {
        data: newSong.data,
        message: 'Song added successfully.',
    };
}

async function updateSong(songId, updatedSongData) {
    const { titreChanson, nomArtiste, nomsaArtistescCollaborateurs, pochetteAlbum, chansonUrl,lyrics, prix } = updatedSongData;
    const ArtistescCollaborateurs = nomsaArtistescCollaborateurs.split('\n').map(artist => artist.trim());

    const result = await db.query(
        'UPDATE chansons SET titreChanson = ?, nomArtiste = ?, nomsaArtistescCollaborateurs = ?, pochetteAlbum = ?,chansonUrl = ?, lyrics = ?, prix = ? WHERE id = ?',
        [titreChanson, nomArtiste, JSON.stringify(ArtistescCollaborateurs), pochetteAlbum, chansonUrl,lyrics, prix, songId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Song not found or not updated.');
    }

    const updatedSong = await getSongById(songId);

    return {
        data: updatedSong.data,
        message: 'Song updated successfully.',
    };
}

async function deleteSong(songId) {
    const result = await db.query(
        'DELETE FROM chansons WHERE id = ?',
        [songId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Song not found or not deleted.');
    }

    return {
        message: 'Song deleted successfully.',
    };
}

module.exports = {
    getListOfSongs,
    getSongById,
    addSong,
    updateSong,
    deleteSong,
};