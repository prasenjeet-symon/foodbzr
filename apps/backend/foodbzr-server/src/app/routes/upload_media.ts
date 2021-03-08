import * as del from 'del';
import * as Loki from 'lokijs';

export const loadCollection = function (colName, db: Loki): Promise<Loki.Collection<any>> {
    return new Promise((resolve) => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        });
    });
};

export const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

export const cleanFolder = function (folderPath: any) {
    // delete files inside folder but not the folder itself
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
};
