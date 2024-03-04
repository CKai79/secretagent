const dbFile = "./w3s-dynamic-storage/database.db";
const sqlite = require('better-sqlite3');
const path = require('path');

// Initialize the database
const db = new sqlite(path.resolve(dbFile), {fileMustExist: false});

const createTableIfNotExist = () => {
  const stmt_keyvaluepairs = db.prepare(`CREATE TABLE IF NOT EXISTS key_value_pairs (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, value TEXT, createdAt CURRENT_TIMESTAMP)`);
  stmt_keyvaluepairs.run();
  const stmt_pagecounter = db.prepare(`CREATE TABLE IF NOT EXISTS page_counter (id INTEGER PRIMARY KEY AUTOINCREMENT, route TEXT, createdAt CURRENT_TIMESTAMP)`);
  stmt_pagecounter.run();
};

const getKeyValuePairs = async () => {
  const stmt = db.prepare('SELECT * FROM key_value_pairs');
  return stmt.all();
}

const checkIfIdExists = async (id) => {
  const stmt = db.prepare('SELECT * FROM key_value_pairs WHERE id = ?');
  const response = stmt.get(id);
  if(response) return true;
  return false;
}

const checkIfKeyExists = async (key) => {
  const stmt = db.prepare('SELECT * FROM key_value_pairs WHERE key = ?');
  const response = stmt.get(key);
  if(response) return true;
  return false;
}

const insertKeyValuePair = async (request) => {
  const ifExists = await checkIfKeyExists(request.key);
  if(ifExists) {
    return {
      success: false,
      msg: "Insert failed. Key already exists.",
    }  
  }

  try {
    const stmt = db.prepare('INSERT INTO key_value_pairs (key, value, createdAt) VALUES (?, ?, CURRENT_TIMESTAMP)');
    stmt.run(request.key, request.value);
    const stmt2 = db.prepare('SELECT * FROM key_value_pairs WHERE key = ?');
    const obj = stmt2.get(request.key);
    return {
      success: true,
      msg: "Key-Value Pair added successfully!",
      id: obj.id
    }    
  } catch (error) {
    console.log(error)
    return {
      success: false,
      msg: error
    }
  }
}

const deleteKeyValuePair = async (id) => {
  const ifExists = await checkIfIdExists(id);
  if(!ifExists) {
    return {
      success: false,
      msg: "Delete failed. Key does not exists."
    }  
  }
  
  try {
    const stmt = db.prepare('DELETE FROM key_value_pairs WHERE id = ?');
    stmt.run(id);
    return {
      success: true,
      msg: "Key-Value Pair deleted successfully!"
    }
  } catch (error) {
    return {
      success: false,
      msg: error
    }
  }
}

const addPageCounter = async (route) => {
  try {
    const stmt = db.prepare('INSERT INTO page_counter (route, createdAt) VALUES (?, CURRENT_TIMESTAMP)');
    stmt.run(route);
    return {
      success: true,
      msg: "Page counter added successfully!"
    }
  } catch (error) {
    return {
      success: false,
      msg: error
    }
  }
}

const getPagesCounterLength = async () => {
  try {
    const pageCountersData = [];
    const stmt = db.prepare('SELECT DISTINCT route FROM page_counter');
    const routes = stmt.all();
    routes.forEach(route => {
      const query = db.prepare(`SELECT COUNT (id) as count FROM page_counter WHERE route=?`);
      const res = query.get(route.route)
      pageCountersData.push({
        "route": route.route,
        "count": res.count
      })
    })
    return {
      success: true,
      data: pageCountersData
    }
  } catch (error) {
    return {
      success: false,
      msg: error
    }
  }
}

const getKeyCounterLength = async () => {
  try {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM key_value_pairs');
    const count = stmt.get();
    return {
      success: true,
      data: count
    }
  } catch (error) {
    return {
      success: false,
      msg: error
    }
  }
}

module.exports = {
  createTableIfNotExist,
  insertKeyValuePair,
  getKeyValuePairs,
  deleteKeyValuePair,
  addPageCounter,
  getPagesCounterLength,
  getKeyCounterLength,
};
