import * as express from "express";
import pgPromise from "pg-promise";
import * as animalsAPI from './animals';
import * as wildAnimalsAPI from './wild-animals';
import * as ownersAPI from './owners';

export const register = ( app: express.Application ) => {
    const port = parseInt( process.env.PGPORT || "5432", 10 );
    const config = {
        database: process.env.PGDATABASE || "postgres",
        host: process.env.PGHOST || "localhost",
        port,
        user: process.env.PGUSER || "postgres"
    };

    const pgp = pgPromise();
    const db = pgp( config );

    animalsAPI.register(app, db);
    wildAnimalsAPI.register(app, db);
    ownersAPI.register(app, db);

    app.get( `/api/guitars/find/:search`, async ( req: any, res ) => {
        try {
            const userId = 'mock-user-id'; // req.userContext.userinfo.sub;
            const guitars = await db.any( `
                SELECT
                    id
                    , brand
                    , model
                    , year
                    , color
                FROM    guitars
                WHERE   user_id = $[userId]
                AND   ( brand ILIKE $[search] OR model ILIKE $[search] )`,
                { userId, search: `%${ req.params.search }%` } );
            return res.json( guitars );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.post( `/api/guitars/update`, async ( req: any, res ) => {
        try {
            const userId = 'mock-user-id'; // req.userContext.userinfo.sub;
            const id = await db.one( `
                UPDATE guitars
                SET brand = $[brand]
                    , model = $[model]
                    , year = $[year]
                    , color = $[color]
                WHERE
                    id = $[id]
                    AND user_id = $[userId]
                RETURNING
                    id;`,
                { userId, ...req.body  } );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );
};
