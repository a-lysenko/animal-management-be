import * as express from 'express';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import {SuccessSave} from './types';

export const register = (app: express.Application, db: pgPromise.IDatabase<{}, pg.IClient>) => {
  app.get('/pets', (req: any, res) => {
    res.redirect('/api/pets/all');
  });

  app.get(`/api/pets/all`, async (req: any, res) => {
    try {
      const pets = await db.any(`
                SELECT
                    p.id
                    , p.animal_id animalid
                    , p.owner_id ownerid
                    , a.birthday
                    , a.species
                    , a.vaccinated
                    , o.fullname
                FROM    pets p
                LEFT JOIN animals a
                ON p.animal_id = a.id
                LEFT JOIN owners o
                ON p.owner_id = o.id
                ORDER BY a.birthday`);
      return res.json(pets);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.get(`/api/pets/:id`, async (req: any, res) => {
    try {
      const pets = await db.any(`
            SELECT
                p.id
                , p.animal_id animalid
                , p.owner_id ownerid
                , a.birthday
                , a.species
                , a.vaccinated
                , o.fullname
            FROM    pets p
            LEFT JOIN animals a
            ON p.animal_id = a.id
            LEFT JOIN owners o
            ON p.owner_id = o.id
            WHERE   p.id = $[id]`,
        {id: Number(req.params.id)});
      return res.json(pets);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.post(`/api/pets/add`, async (req, res) => {
    const pet = {
      animalid: req.body.animalid,
      ownerid: req.body.ownerid
    };

    try {
      const id = await db.one(`
                INSERT INTO pets( animal_id, owner_id )
                VALUES( $[animalid], $[ownerid] )
                RETURNING id;`,
        {...pet});
      return res.json(id);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.put(`/api/pets/update`, async (req: any, res) => {
    try {
      const id = await db.one<SuccessSave>(`
                UPDATE pets
                SET owner_id = $[ownerid]
                WHERE
                    id = $[id]
                RETURNING
                    id;`,
        {...req.body});
      return res.json(id);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.delete(`/api/pets/remove/:id`, async (req: any, res) => {
    try {
      const id = await db.result(`
                DELETE
                FROM    pets
                WHERE   id = $[id]`,
        {id: req.params.id}, (r) => r.rowCount);
      return res.json({id});
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });
};
