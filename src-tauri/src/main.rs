// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_users_table",
            sql: "CREATE TABLE IF NOT EXISTS users (
            id INTEGER NOT NULL PRIMARY KEY, 
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            token TEXT NOT NULL
            ) WITHOUT ROWID;",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_patients_table",
            sql: "CREATE TABLE IF NOT EXISTS patients(
                name TEXT NOT NULL CHECK(length(name) <= 200),
                surname TEXT NOT NULL CHECK(length(surname) <= 200),
                date_of_birth TEXT NOT NULL CHECK(date(date_of_birth, '+0 days') IS date_of_birth),
                gender TEXT NOT NULL CHECK(gender IN ('M', 'F', 'O')),
                description TEXT NOT NULL CHECK(length(description) <= 2000),
                photo TEXT NOT NULL
                );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_fts_index",
            sql: "
            CREATE VIRTUAL TABLE patients_fts USING fts5(name, surname, description, content=patients, tokenize=\"trigram\");

            INSERT INTO patients_fts(ROWID, name, surname, description) SELECT ROWID, name, surname, description FROM patients;
            
            CREATE TRIGGER patients_fts_ai AFTER INSERT ON patients BEGIN
              INSERT INTO patients_fts(ROWID, name, surname, description) VALUES (new.ROWID, new.name, new.surname, new.description);
            END;
            CREATE TRIGGER patients_fts_ad AFTER DELETE ON patients BEGIN
              INSERT INTO patients_fts(patients_fts, ROWID, name, surname, description) VALUES('delete', old.ROWID, old.name, old.surname, old.description);
            END;
            CREATE TRIGGER patients_fts_au AFTER UPDATE ON patients BEGIN
              INSERT INTO patients_fts(patients_fts, ROWID, name, surname, description) VALUES('delete', old.ROWID, old.name, old.surname, old.description);
              INSERT INTO patients_fts(ROWID, name, surname, description) VALUES (new.ROWID, new.name, new.surname, new.description);
            END;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_appointments",
            sql: "CREATE TABLE IF NOT EXISTS appointments(
                start_datetime TEXT NOT NULL CHECK(datetime(start_datetime, '+0 days') IS start_datetime),
                end_datetime TEXT NOT NULL CHECK(datetime(end_datetime, '+0 days') IS end_datetime),
                patients TEXT NOT NULL,
                description TEXT NOT NULL CHECK(length(description) <= 2000)
                );
                
                CREATE INDEX idx_appointments_start_datetime ON appointments(start_datetime);",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:data.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
