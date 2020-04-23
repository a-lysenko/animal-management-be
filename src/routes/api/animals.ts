import * as express from 'express';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import {SuccessSave} from './types';

export const register = ( app: express.Application, db: pgPromise.IDatabase<{},pg.IClient> ) => {
  app.get( '/animals', ( req: any, res ) => {
    res.redirect( '/api/animals/all' );
  } );

  app.get( `/api/animals/all`, async ( req: any, res ) => {
    try {
      const animals = await db.any( `
                SELECT
                    a.id
                    , a.birthday
                    , a.species
                    , a.vaccinated
                    , NOT p.id ISNULL ispet
                    , NOT w.id ISNULL iswild
                FROM    animals a
                LEFT JOIN pets p
                ON p.animal_id = a.id
                LEFT JOIN wild_animals w
                ON w.animal_id = a.id
                ORDER BY birthday`);
      return res.json( animals );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );

  app.get( `/api/animals/:id`, async ( req: any, res ) => {
    try {
      const animal = await db.any( `
                SELECT
                    id
                    , birthday
                    , species
                    , vaccinated
                FROM    animals
                WHERE   id = $[animalId]`,
        { animalId: Number(req.params.id) } );
      return res.json( animal[0] || null );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );

  app.post( `/api/animals/add`, async ( req: any, res ) => {
    try {
      const id = await db.one( `
                INSERT INTO animals( birthday, species, vaccinated )
                VALUES( $[birthday], $[species], $[vaccinated] )
                RETURNING id;`,
        { ...req.body  } );
      return res.json( id );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );

  app.put( `/api/animals/update`, async ( req: any, res ) => {
    try {
      const id = await db.one<SuccessSave>( `
                UPDATE animals
                SET birthday = $[birthday]
                    , species = $[species]
                    , vaccinated = $[vaccinated]
                WHERE
                    id = $[id]
                RETURNING
                    id;`,
        { ...req.body  } );
      return res.json( id );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );

  app.delete( `/api/animals/remove/:id`, async ( req: any, res ) => {
    try {
      const id = await db.result( `
                DELETE
                FROM    animals
                WHERE   id = $[animalId]`,
        { animalId: req.params.id  }, ( r ) => r.rowCount );
      return res.json( { id } );
    } catch ( err ) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json( { error: err.message || err } );
    }
  } );
};
