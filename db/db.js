import * as SQLite from 'expo-sqlite';

const dbname = 'map.db';

let db;

export function openDatabase() {
    db = SQLite.openDatabase(dbname);
    db.transaction((tx) => {
        tx.executeSql(
            "create table if not exists markers (id integer primary key autoincrement not null, latitude real not null, longitude real not null);",
            null,
            () => console.log('Success loaded markers table!'),
            (_, error) => console.log('Error', error)
        );
        tx.executeSql(
            "create table if not exists images (id integer primary key autoincrement not null, marker_id integer not null, uri text not null);",
            null,
            () => console.log('Success loaded images table!'),
            (_, error) => console.log('Error', error)
        );
    });
}

export function addMarker(markers, setMarkers, marker) {
    db.transaction((tx) => {
        tx.executeSql(
            "insert into markers (latitude, longitude) values (?, ?)", 
            [marker.latlng.latitude, marker.latlng.longitude], 
            (_, result) => setMarkers([...markers, { id: result.insertId, latlng: marker.latlng }]),
            (_, error) => console.log('Error', error)
        );
    });
}

export function addImage(images, setImage, image) {
    db.transaction((tx) => {
        tx.executeSql(
            "insert into images (marker_id, uri) values (?, ?)", 
            [image.markerId, image.uri],
            () => setImage([...images, image.uri ]),
            (_, error) => console.log('Error', error)
        );
    });
}

export function loadMarker(callback) {
    db.transaction(
        (tx) => {
            tx.executeSql("select id, latitude, longitude from markers", 
            null,
            (_, {rows}) => callback((rows._array.map(r => ({ id: r.id, latlng: { latitude: r.latitude, longitude: r.longitude }})))),
            (_, error) => console.log('Error', error)
            );
        }
    )
}

export function loadImages(markerId, callback) {
    db.transaction(
        (tx) => {
            tx.executeSql("select uri from images where marker_id = ?",
                [markerId],
                (_, {rows}) => callback(rows._array.map(r => r.uri)),
                (_, error) => console.log('Error', error)
            );
        }
    )
}



