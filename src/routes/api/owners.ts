import * as express from "express";
import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";

export const register = ( app: express.Application, db: pgPromise.IDatabase<{},pg.IClient> ) => {
  app.get( "/owners", ( req: any, res ) => {
    res.redirect( "/api/owners/all" );
  } );

  app.get( `/api/owners/all`, async ( req: any, res ) => {
    try {
      const owners = await db.any( `
                SELECT
                    id
                    , fullname
                FROM    owners
                ORDER BY fullname`);
      return res.json( owners );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );

  app.get( `/api/owners/:id`, async ( req: any, res ) => {
    try {
      const owners = await db.any( `
                SELECT
                    id
                    , fullname
                FROM    owners
                WHERE   id = $[ownerId]`,
        { ownerId: Number(req.params.id) } );
      return res.json( owners );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );

  app.post( `/api/owners/add`, async ( req: any, res ) => {
    try {
      const id = await db.one( `
                INSERT INTO owners( fullname )
                VALUES( $[fullname] )
                RETURNING id;`,
        { ...req.body  } );
      return res.json( { id } );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );

  app.put( `/api/owners/update`, async ( req: any, res ) => {
    try {
      const id = await db.one( `
                UPDATE owners
                SET fullname = $[fullname]
                WHERE
                    id = $[id]
                RETURNING
                    id;`,
        { ...req.body  } );
      return res.json( { id } );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );

  app.delete( `/api/owners/remove/:id`, async ( req: any, res ) => {
    try {
      const id = await db.result( `
                DELETE
                FROM    owners
                WHERE   id = $[ownerId]`,
        { ownerId: req.params.id  }, ( r ) => r.rowCount );
      return res.json( { id } );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );
};
