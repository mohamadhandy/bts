# bts
Technical test bts.id

## How to run this project

1. clone this project
2. `npm install`
3. before running make sure you already installed postgres sql & dbeaver or pgadmin
4. make sure to check your username in postgres and adjust in `db.js`.
5. run this query
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE checklists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE checklist_items (
    id SERIAL PRIMARY KEY,
    checklist_id INTEGER REFERENCES checklists(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL
);

ALTER TABLE checklist_items ADD COLUMN status BOOLEAN DEFAULT false;
UPDATE checklist_items SET status = false;
```
6. run using `node index.js` in your terminal
