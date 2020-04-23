import * as express from 'express';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';

export const register = (app: express.Application, db: pgPromise.IDatabase<{}, pg.IClient>) => {
  app.get('/owners', (req: any, res) => {
    res.redirect('/api/owners/all');
  });

  app.get(`/api/owners/all`, async (req, res) => {
    try {
      const owners = await db.any(`
                SELECT
                    o.id id
                    , fullname
                    , a.id addressesid
                    , city
                    , country
                    , street
                    , zipcode
                FROM    owners o
                LEFT JOIN addresses a
                ON o.id = a.owner_id
                ORDER BY fullname`);
      return res.json(owners);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.get(`/api/owners/:id`, async (req: any, res) => {
    try {
      const owners = await db.any(`
                SELECT
                    o.id
                    , o.fullname
                    , a.id addressesid
                    , a.city
                    , a.country
                    , a.street
                    , a.zipcode
                FROM    owners o
                LEFT JOIN addresses a
                ON o.id = a.owner_id
                WHERE   o.id = $[ownerId]`,
        {ownerId: Number(req.params.id)});
      return res.json(owners[0] || null);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.post(`/api/owners/add`, async (req, res) => {
    const address = {
      city: req.body.city || '',
      country: req.body.country || '',
      street: req.body.street || '',
      zipcode: req.body.zipcode || ''
    };

    try {
      const id = await db.one(`
                WITH saved_owner as (
                    INSERT INTO owners( fullname )
                    VALUES( $[fullname] )
                    RETURNING id
                )
                INSERT INTO addresses( owner_id, city, country, street, zipcode )
                VALUES( (SELECT id FROM saved_owner), $[city], $[country], $[street], $[zipcode] )
                RETURNING (SELECT id FROM saved_owner)`,
        {fullname: req.body.fullname, ...address});
      return res.json({id});
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.put(`/api/owners/update`, async (req, res) => {
    const address = {
      addressid: req.body.addressid,
      city: req.body.city || '',
      country: req.body.country || '',
      street: req.body.street || '',
      zipcode: req.body.zipcode || ''
    };

    try {
      const id = await db.one(`
        WITH updated_owner as (
          UPDATE owners
          SET fullname = $[fullname]
          WHERE
              id = $[id]
          RETURNING id
        )
        UPDATE addresses a
          SET city = $[city]
            , country = $[country]
            , street = $[street]
            , zipcode = $[zipcode]
          WHERE
              a.id = $[addressid]
              AND a.owner_id = (SELECT uo.id FROM updated_owner uo)
          RETURNING (SELECT uo.id FROM updated_owner uo)`,
        {id: req.body.id, fullname: req.body.fullname, ...address});
      return res.json({id});
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });

  app.delete(`/api/owners/remove/:id`, async (req: any, res) => {
    try {
      const id = await db.result(`
                DELETE
                FROM owners
                WHERE
                    id = $[ownerId]`,
        {ownerId: req.params.id}, (r) => r.rowCount);
      return res.json({id});
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({error: err.message || err});
    }
  });
};
