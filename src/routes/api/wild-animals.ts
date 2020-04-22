import * as express from 'express';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import {SuccessSave} from './types';

export const register = (app: express.Application, db: pgPromise.IDatabase<{}, pg.IClient>) => {
  app.get('/wild-animals', (req: any, res) => {
    res.redirect('/api/wild-animals/all');
  });

  app.get(`/api/wild-animals/all`, async (req: any, res) => {
    try {
      const wildAnimals = await db.any(`
                SELECT
                    wa.id
                    , wa.animal_id animalid
                    , wa.trackingid
                    , a.birthday
                    , a.species
                    , a.vaccinated
                FROM    wild_animals wa
                LEFT JOIN animals a
                ON wa.animal_id = a.id
                ORDER BY a.birthday`);
      return res.json(wildAnimals);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.get(`/api/wild-animals/:id`, async (req: any, res) => {
    try {
      const wildAnimals = await db.any(`
            SELECT
                wa.id
                , wa.animal_id animalid
                , wa.trackingid
                , a.birthday
                , a.species
                , a.vaccinated
                FROM    wild_animals wa
                LEFT JOIN animals a
                ON wa.animal_id = a.id
                WHERE   wa.id = $[id]`,
        {id: Number(req.params.id)});
      return res.json(wildAnimals);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.post(`/api/wild-animals/add`, async (req, res) => {
    const wildAnimal = {
      animalid: req.body.animalid,
      trackingid: req.body.trackingid
    };

    try {
      const id = await db.one(`
                INSERT INTO wild_animals( animal_id, trackingid )
                VALUES( $[animalid], $[trackingid] )
                RETURNING id;`,
        {...wildAnimal});
      return res.json(id);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.put(`/api/wild-animals/update`, async (req: any, res) => {
    try {
      const id = await db.one<SuccessSave>(`
                UPDATE wild_animals
                SET trackingid = $[trackingid]
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

  app.delete(`/api/wild-animals/remove/:id`, async (req: any, res) => {
    try {
      const id = await db.result(`
                DELETE
                FROM    wild_animals
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
