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
