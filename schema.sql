CREATE TABLE IF NOT EXISTS znaki (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  kod       TEXT NOT NULL UNIQUE,
  kategoria TEXT NOT NULL,
  nazwa     TEXT NOT NULL,
  znaczenie TEXT NOT NULL,
  obrazek   TEXT
);

CREATE TABLE IF NOT EXISTS postepy (
  user_email TEXT NOT NULL,
  kod        TEXT NOT NULL,
  status     TEXT CHECK(status IN ('umiem','nie_umiem','pominiety')),
  updated_at INTEGER DEFAULT (unixepoch()),
  PRIMARY KEY (user_email, kod)
);
