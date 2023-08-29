import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('buysell.db');

const createTables = () => {
    // Create your tables here
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, role TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, location TEXT NOT NULL, password TEXT NOT NULL)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, color TEXT NOT NULL, image TEXT NOT NULL, product_count INTEGER NOT NULL)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, user_id INTEGER NOT NULL, price REAL NOT NULL, description TEXT NOT NULL, status TEXT NOT NULL, image TEXT NOT NULL, category_id INTEGER NOT NULL)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, user_id INTEGER NOT NULL)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS purchase_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, buyer_id INTEGER NOT NULL, vendor_id INTEGER NOT NULL, status TEXT NOT NULL, product_id INTEGER NOT NULL)'
        );
    });
};

const dropTables = () => {
    // Drop your tables here
    db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS users');
        tx.executeSql('DROP TABLE IF EXISTS categories');
        tx.executeSql('DROP TABLE IF EXISTS category');
        tx.executeSql('DROP TABLE IF EXISTS favorites');
        tx.executeSql('DROP TABLE IF EXISTS purchase_requests');
    });
};

export const initDatabase = () => {
    createTables();
};

export const resetDatabase = () => {
    dropTables();
    createTables();
};

export default db;
